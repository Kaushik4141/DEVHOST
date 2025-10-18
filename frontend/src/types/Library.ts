/**
 * TypeScript interface for Library data from libraries.io API
 */
export interface Library {
  id: string;
  name: string;
  description: string;
  language: string;
  homepage: string;
  repository_url: string;
  stars: number;
  forks: number;
  latest_release_number: string;
  latest_release_published_at: string;
  package_manager_url: string;
  rank: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response type for libraries.io API
 */
export interface LibrariesResponse {
  libraries: Library[];
  error?: string;
}