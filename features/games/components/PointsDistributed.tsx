"use client";

import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { TeamPointTypeChart } from "./TeamPointTypeChart";
import type { GameBoxscore } from "../types/games";
import Image from "next/image";

type LineScoreProps = {
  teams: GameBoxscore["teams"];
};

const boxSize = "12px";
const fontSize = "14px";

export function PointsDistributed({ teams }: LineScoreProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      h="full"
      width="full"
      _dark={{ bg: "gray.900", borderColor: "gray.700", color: "gray.100" }}
    >
      <Text p={4}>球隊得分分佈</Text>

      <Flex direction={{ base: "column", xl: "row" }} pb={4} px={4} gap={4}>
        <Box w="100%">
          <Stack>
            <HStack justify="space-between" wrap="wrap">
              <HStack>
                <Image
                  src={teams.away.team.logoUrl}
                  alt={teams.away.team.name}
                  width={24}
                  height={24}
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                  }}
                />
                <Text>{teams.away.team.name}</Text>
              </HStack>
              <HStack>
                <Box boxSize={boxSize} borderRadius="full" bg="green.500" />
                <Text fontSize={fontSize}>本土</Text>
                <Box boxSize={boxSize} borderRadius="full" bg="blue.500" />
                <Text fontSize={fontSize}>洋將</Text>
                <Box boxSize={boxSize} borderRadius="full" bg="purple.500" />
                <Text fontSize={fontSize}>外籍生</Text>
              </HStack>
            </HStack>
          </Stack>
          <TeamPointTypeChart teamBoxscore={teams.away} />
        </Box>
        <Box w="100%">
          <Stack>
            <HStack justify="space-between" wrap="wrap">
              <HStack>
                <Image
                  src={teams.home.team.logoUrl}
                  alt={teams.home.team.name}
                  width={24}
                  height={24}
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                  }}
                />
                <Text>{teams.home.team.name}</Text>
              </HStack>
              <HStack>
                <Box boxSize={boxSize} borderRadius="full" bg="green.500" />
                <Text fontSize={fontSize}>本土</Text>
                <Box boxSize={boxSize} borderRadius="full" bg="blue.500" />
                <Text fontSize={fontSize}>洋將</Text>
                <Box boxSize={boxSize} borderRadius="full" bg="purple.500" />
                <Text fontSize={fontSize}>外籍生</Text>
              </HStack>
            </HStack>
          </Stack>
          <TeamPointTypeChart teamBoxscore={teams.home} />
        </Box>
      </Flex>
    </Box>
  );
}
