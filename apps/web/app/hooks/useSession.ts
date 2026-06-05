"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";

const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();

      if (error) {
        throw new Error("Failed to fetch session");
      }
      return data;
    },
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export default useSession;
