"use server"

import { updateTag } from "next/cache"
import { GITHUB_CACHE_TAG } from "@/services/github/github.client"

export async function retryGithubFetch(): Promise<void> {
	updateTag(GITHUB_CACHE_TAG)
}
