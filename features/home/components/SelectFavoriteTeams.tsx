"use client";

import { CheckboxCard, For, Text, Box, Flex } from "@chakra-ui/react";
import { Team } from "../types/schedules";
import Image from "next/image";
import { useFavoriteTeamsStore } from "@/stores/useFavoriteTeamsStore";

type Props = {
  uniqueTeams: Team[];
};

export default function SelectFavoriteTeams({ uniqueTeams }: Props) {
  const favoriteTeams = useFavoriteTeamsStore((state) => state.favoriteTeams);
  const toggleFavoriteTeam = useFavoriteTeamsStore(
    (state) => state.toggleFavoriteTeam,
  );

  return (
    <>
      <Box>
        <Text pb={2} color="gray.500">
          選擇你關注的球隊
        </Text>
        <Flex gap={3} wrap="wrap">
          <For each={uniqueTeams}>
            {(team) => {
              const checked = favoriteTeams.some((item) => item.id === team.id);
              return (
                <CheckboxCard.Root
                  key={team.id}
                  checked={checked}
                  onCheckedChange={() => toggleFavoriteTeam(team)}
                  cursor="pointer"
                >
                  <CheckboxCard.HiddenInput />
                  <CheckboxCard.Control>
                    <CheckboxCard.Content>
                      <CheckboxCard.Label>
                        {team.name}
                        <Image
                          src={team.logoUrl}
                          alt={team.name}
                          width={48}
                          height={48}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "contain",
                          }}
                        ></Image>
                      </CheckboxCard.Label>
                    </CheckboxCard.Content>
                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>
              );
            }}
          </For>
        </Flex>
      </Box>
    </>
  );
}
