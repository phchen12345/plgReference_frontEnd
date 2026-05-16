import { Box, Flex, Stack, Text, Badge } from "@chakra-ui/react";
import type { ScheduleGame } from "@/features/home/types/schedules";
import { formatGameDate, formatGameTime, formatScore } from "../page";
import { Team } from "../components/Team";
import Link from "next/link";

const statusLabels = {
  regular_season: "例行賽",
  playoffs: "季後賽",
  finals: "總冠軍賽",
} satisfies Record<ScheduleGame["stage"], string>;

export function GameCard({ game }: { game: ScheduleGame }) {
  return (
    <Link href={`/games/${game.id}`} style={{ textDecoration: "none" }}>
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={5}
        cursor="pointer"
        transition="border-color 0.2s, box-shadow 0.2s"
        _hover={{
          borderColor: "blue.300",
          boxShadow: "sm",
        }}
        _dark={{
          bg: "gray.900",
          borderColor: "gray.700",
          color: "gray.100",
          _hover: {
            borderColor: "blue.400",
          },
        }}
      >
        <Flex justify="space-between" align="center" gap={4} mb={5}>
          <Stack gap={1}>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {formatGameDate(game.gameDate)} {formatGameTime(game.gameTime)}
            </Text>
          </Stack>

          <Stack align="flex-start">
            <Text textStyle="xs" color="gray.500" _dark={{ color: "gray.400" }}>
              {game.venue}
            </Text>
            <Badge
              alignSelf="flex-end"
              colorPalette={game.stage === "regular_season" ? "gray" : "red"}
            >
              {statusLabels[game.stage]}
            </Badge>
          </Stack>
        </Flex>
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Box flex="1" minW={0}>
            <Team
              name={game.homeTeam.shortName}
              logoUrl={game.homeTeam.logoUrl}
              logoSide="right"
            />
          </Box>

          <Flex
            align="center"
            justify="center"
            minW="96px"
            minH="44px"
            px={4}
            borderX={{ base: "0", md: "1px solid" }}
            borderY={{ base: "1px solid", md: "0" }}
            borderColor="gray.100"
            _dark={{ borderColor: "gray.700" }}
          >
            <Text fontSize="xl" fontWeight="bold" whiteSpace="nowrap">
              {formatScore(game)}
            </Text>
          </Flex>

          <Box flex="1" minW={0}>
            <Team
              name={game.awayTeam.shortName}
              logoUrl={game.awayTeam.logoUrl}
              logoSide="left"
            />
          </Box>
        </Flex>
      </Box>
    </Link>
  );
}
