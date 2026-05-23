"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ColorMode = "light" | "dark";

type ColorModeState = {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
};

export const useColorModeStore = create<ColorModeState>()(
  persist(
    (set, get) => ({
      colorMode: "light",

      setColorMode: (mode) => {
        set({ colorMode: mode });
      },

      toggleColorMode: () => {
        const nextMode = get().colorMode === "light" ? "dark" : "light";
        set({ colorMode: nextMode });
      },
    }),
    {
      name: "color-mode",
      skipHydration: true,
    },
  ),
);
