import { apiService } from '@/api/apiService'
import type { RoleKey } from '@/constants/role'
import type { CandidateResponseDto } from '@/interfaces/candidateResponse'

export const candidateService = {
  getNames: (params: { name: string }, signal?: AbortSignal) =>
    apiService
      .get<string[]>('/api/candidates/names', { params, signal })
      .then(async ({ data }) => data),

  getCandidate: (id: number, params: { role: RoleKey }, signal?: AbortSignal) =>
    apiService
      .get<CandidateResponseDto>(`/api/candidates/${id}`, { params, signal })
      .then(async ({ data }) => data),
}
