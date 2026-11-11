import { apiService } from '@/api/apiService'

export const candidateService = {
  getNames: (params: { name: string }, signal?: AbortSignal) =>
    apiService
      .get<string[]>('/api/candidates/names', { params, signal })
      .then(async ({ data }) => data),
}
