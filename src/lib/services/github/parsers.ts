import { RepoMeta, RepoStructureItem } from "@/lib/types";
import { GithubRepoResponse, GithubTreeResponse } from "./types";

export function parseGithubUrl(url: string): { owner: string; repo: string } {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") {
      throw new Error("Not a valid GitHub URL");
    }
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error("Invalid GitHub repository URL format");
    }
    return {
      owner: pathParts[0],
      repo: pathParts[1].replace(".git", ""),
    };
  } catch (e) {
    throw new Error("Failed to parse GitHub URL: " + (e instanceof Error ? e.message : "Unknown error"));
  }
}

export function parseRepoMeta(repoUrl: string, data: GithubRepoResponse): RepoMeta {
  return {
    owner: data.owner.login,
    name: data.name,
    fullName: data.full_name,
    description: data.description || "",
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language || "Unknown",
    topics: data.topics || [],
    isPrivate: data.private,
    updatedAt: data.updated_at,
    size: data.size,
    url: repoUrl,
    defaultBranch: data.default_branch,
  };
}

export function parseRepoStructure(treeData: GithubTreeResponse): RepoStructureItem[] {
  if (!treeData || !treeData.tree) return [];
  
  return treeData.tree
    .filter((item) => item.type === "blob" || item.type === "tree")
    .map((item) => ({
      path: item.path,
      type: item.type as "blob" | "tree",
      size: item.size,
    }));
}
