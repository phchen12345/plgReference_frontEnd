import { HStack, Image, Text } from "@chakra-ui/react";
import type { ScheduleGame } from "../types/schedules";

export function Team({
  name,
  logoUrl,
  logoSide = "left",
}: Pick<ScheduleGame["homeTeam"], "name" | "logoUrl"> & {
  logoSide?: "left" | "right";
}) {
  return (
    <HStack
      gap={3}
      minW={0}
      justify={logoSide === "right" ? "flex-end" : "flex-start"}
    >
      {logoSide === "left" && (
        <Image
          src={logoUrl}
          alt={name}
          boxSize="40px"
          objectFit="contain"
          flexShrink={0}
        />
      )}

      <Text fontWeight="semibold" truncate>
        {name}
      </Text>

      {logoSide === "right" && (
        <Image
          src={logoUrl}
          alt={name}
          boxSize="40px"
          objectFit="contain"
          flexShrink={0}
        />
      )}
    </HStack>
  );
}
