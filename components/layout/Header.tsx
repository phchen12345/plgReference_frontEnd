"use client";

import { Box, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Menu as MenuIcon } from "lucide-react";
import { ColorModeButton } from "./ColorModeButton";
import { useFavoriteTeamsStore } from "@/stores/useFavoriteTeamsStore";
import Image from "next/image";
import { motion } from "framer-motion";

export function Header() {
  const favoriteTeams = useFavoriteTeamsStore((state) => state.favoriteTeams);

  return (
    <Box
      as="header"
      borderBottom="1px solid"
      borderColor="gray.200"
      bg="white"
      px={6}
      py={3}
      position="sticky"
      top={0}
      zIndex={100}
      _dark={{ bg: "gray.950", borderColor: "gray.800", color: "gray.100" }}
    >
      <Flex align="center" justify="space-between">
        <HStack gap={3}>
          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            aria-label="Open menu"
            variant="ghost"
            _dark={{ _hover: { bg: "gray.800" } }}
          >
            <MenuIcon size={20} />
          </IconButton>

          <Stack gap={0}>
            <Text fontSize="2xl" fontWeight="bold">
              PLG
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              REFERENCE
            </Text>
          </Stack>
          <motion.div
            animate={{ x: [0, -6, 6, -6, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <HStack>
              {favoriteTeams.map((team) => (
                <Box key={team.id}>
                  <Image
                    src={team.logoUrl}
                    alt={team.name}
                    width={48}
                    height={48}
                  />
                </Box>
              ))}
            </HStack>
          </motion.div>
        </HStack>

        <HStack gap={2} display={{ base: "none", md: "flex" }}>
          {/* <Button variant="ghost">Dashboard</Button> */}
          {/* <Button variant="ghost">球隊數據</Button> */}
          {/* <Button variant="ghost">Players</Button> */}
          {/* <Button variant="ghost">Games</Button> */}
          {/* <Button variant="ghost">Stats</Button> */}
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  );
}
