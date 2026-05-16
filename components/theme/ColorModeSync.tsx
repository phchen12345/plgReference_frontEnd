"use client";

import { useEffect } from "react";
import { useColorModeStore } from "@/stores/useColorModeStore";

export function ColorModeSync() {
  const colorMode = useColorModeStore((state) => state.colorMode);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(colorMode);
  }, [colorMode]);

  return null;
}
