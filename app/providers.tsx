"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useState } from "react";
import { useColorModeStore } from "@/stores/useColorModeStore";
import { useFavoriteTeamsStore } from "@/stores/useFavoriteTeamsStore";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    useColorModeStore.persist.rehydrate();
    useFavoriteTeamsStore.persist.rehydrate();
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
    // <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  );
}
