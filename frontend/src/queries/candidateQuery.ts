import { candidateService } from '@/api/candidateService'
import type { RoleKey } from '@/constants/role'
import { useQuery } from '@tanstack/react-query'

export const candidateQuery = {
  useGetNames: (name: string, enabled = true) =>
    useQuery({
      queryKey: ['candidate-name', name],
      queryFn: ({ signal }) => candidateService.getNames({ name }, signal),
      enabled,
    }),

  useGetCandidate: (id: number, role: RoleKey, enabled = true) =>
    useQuery({
      queryKey: ['candidate', id, role],
      queryFn: ({ signal }) => candidateService.getCandidate(id, { role }, signal),
      enabled,
    }),
}
