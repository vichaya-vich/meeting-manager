import { candidateService } from '@/api/candidateService'
import { useQuery } from '@tanstack/react-query'

export const candidateQuery = {
  useGetNames: (name: string, enabled = true) =>
    useQuery({
      queryKey: ['candidate-name', name],
      queryFn: ({ signal }) => candidateService.getNames({ name }, signal),
      enabled,
    }),
}
