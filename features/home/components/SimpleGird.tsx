import { Badge, Box, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { GameCard } from "./GameCard";
import type { ScheduleGame } from "@/features/home/types/schedules";

export default function GameSection({
  title,
  games,
  emptyText,
}: {
  title: string;
  games: ScheduleGame[];
  emptyText: string;
}) {
  return (
    <Stack gap={4} w="full">
      <Flex align="center" justify="space-between">
        <Text as="h2" fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <Badge colorPalette="gray">{games.length} 場</Badge>
      </Flex>

      {games.length === 0 ? (
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          p={5}
          _dark={{
            bg: "gray.900",
            borderColor: "gray.700",
          }}
        >
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            {emptyText}
          </Text>
        </Box>
      ) : (
        <SimpleGrid gap={4}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
