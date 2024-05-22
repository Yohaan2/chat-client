import { useQuery } from "@tanstack/react-query"
import { getUser } from "../module/user"

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser
  })
}