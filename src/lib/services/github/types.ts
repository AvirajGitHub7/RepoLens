export interface GithubRepoResponse {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  private: boolean;
  updated_at: string;
  size: number;
  default_branch: string;
}

export interface GithubLanguageResponse {
  [language: string]: number;
}

export interface GithubTreeResponse {
  sha: string;
  url: string;
  tree: GithubTreeItemResponse[];
  truncated: boolean;
}

export interface GithubTreeItemResponse {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
  url: string;
}
