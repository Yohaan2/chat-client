import { useQuery } from "@tanstack/react-query"
import { getUser } from "../module/user"

export const useUser = (isAuthenticated) => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    refetchOnWindowFocus: false,
    enabled: !!isAuthenticated,
    retry: false,
  })
}