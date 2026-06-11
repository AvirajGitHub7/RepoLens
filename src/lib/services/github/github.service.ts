import { parseGithubUrl, parseRepoMeta, parseRepoStructure } from "./parsers";
import { GithubLanguageResponse, GithubRepoResponse, GithubTreeResponse } from "./types";
import { RepoMeta, TechStack } from "@/lib/types";

const GITHUB_API_BASE = "https://api.github.com";

export async function fetchUserRepos(token: string): Promise<GithubRepoResponse[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${token}`,
  };

  const res = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=100`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch user repositories: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchRepoData(
  repoUrl: string,
  onProgress?: (progress: number) => void | Promise<void>,
  token?: string | null
): Promise<{ repoMeta: RepoMeta; techStack: TechStack }> {
  const { owner, repo } = parseGithubUrl(repoUrl);
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  // Use user-provided token if available, otherwise fallback to global token
  const authToken = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (authToken) {
    headers.Authorization = `token ${authToken}`;
  }

  // 1. Fetch Repo Metadata
  const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repository metadata: ${repoRes.statusText}`);
  }
  const repoData: GithubRepoResponse = await repoRes.json();
  const repoMeta = parseRepoMeta(repoUrl, repoData);

  if (onProgress) await onProgress(30);

  // 2. Fetch Languages
  const langRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers });
  const techStack: TechStack = { languages: [], frameworks: [], databases: [], devops: [], testing: [] };
  if (langRes.ok) {
    const langData: GithubLanguageResponse = await langRes.json();
    techStack.languages = Object.keys(langData);
  }

  if (onProgress) await onProgress(50);

  // 3. Fetch README
  const readmeRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
    headers: {
      ...headers,
      Accept: "application/vnd.github.v3.raw",
    },
  });
  
  if (readmeRes.ok) {
    repoMeta.readme = await readmeRes.text();
  } else {
    repoMeta.readme = null;
  }

  if (onProgress) await onProgress(70);

  // 4. Fetch Repository Structure (Tree)
  const treeRes = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${repoMeta.defaultBranch}?recursive=1`,
    { headers }
  );
  
  if (treeRes.ok) {
    const treeData: GithubTreeResponse = await treeRes.json();
    repoMeta.structure = parseRepoStructure(treeData);
  }

  return { repoMeta, techStack };
}
