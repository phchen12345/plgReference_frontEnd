import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterMode = "all" | "favorites";

type FavoriteTeam = {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
};

type FavoriteTeamsState = {
  favoriteTeams: FavoriteTeam[];

  toggleFavoriteTeam: (team: FavoriteTeam) => void;

  isFavoriteTeam: (teamId: number) => boolean;
};

export const useFavoriteTeamsStore = create<FavoriteTeamsState>()(
  persist(
    (set, get) => ({
      favoriteTeams: [],
      filterMode: "all",

      toggleFavoriteTeam: (team) =>
        set((state) => {
          const exists = state.favoriteTeams.some(
            (item) => item.id === team.id,
          );

          if (exists) {
            return {
              favoriteTeams: state.favoriteTeams.filter(
                (item) => item.id !== team.id,
              ),
            };
          }

          return {
            favoriteTeams: [...state.favoriteTeams, team],
          };
        }),

      isFavoriteTeam: (teamId) =>
        get().favoriteTeams.some((team) => team.id === teamId),
    }),
    {
      name: "favorite-teams-store",
    },
  ),
);
