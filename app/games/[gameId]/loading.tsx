import { Box, HStack, Skeleton, Stack } from "@chakra-ui/react";

export default function GameLoading() {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      px={{ base: 4, md: 4 }}
      py={2}
      _dark={{ bg: "gray.950", color: "gray.100" }}
    >
      <Skeleton height="24px" width="120px" mb={4} />

      <Box bg="white" borderRadius="md" p={6}>
        <Stack gap={4} align="center">
          <HStack gap={6}>
            <Skeleton boxSize="56px" borderRadius="full" />
            <Skeleton height="44px" width="160px" />
            <Skeleton boxSize="56px" borderRadius="full" />
          </HStack>

          <Skeleton height="18px" width="320px" maxW="full" />
        </Stack>
      </Box>
    </Box>
  );
}
