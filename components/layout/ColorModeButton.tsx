"use client";

import { IconButton } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useColorModeStore } from "@/stores/useColorModeStore";

export function ColorModeButton() {
  const colorMode = useColorModeStore((state) => state.colorMode);
  const toggleColorMode = useColorModeStore((state) => state.toggleColorMode);

  return (
    <IconButton
      aria-label="切換明暗模式"
      onClick={toggleColorMode}
      size="sm"
      variant="ghost"
      _dark={{ color: "gray.100", _hover: { bg: "gray.800" } }}
    >
      {colorMode === "light" ? <Moon /> : <Sun />}
    </IconButton>
  );
}
