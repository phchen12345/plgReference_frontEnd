import { Box, HStack, Skeleton, Stack, Spinner } from "@chakra-ui/react";

export function PageLoading() {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      px={{ base: 4, md: 8 }}
      py={8}
      _dark={{ bg: "gray.950", color: "gray.100" }}
      display="grid"
      placeItems="center"
    >
      <Spinner size="xl" />
      <Stack gap={6} maxW="1120px" mx="auto">
        <Stack gap={2}>
          <Skeleton height="36px" width="220px" />
          <Skeleton height="20px" width="320px" maxW="full" />
        </Stack>

        <HStack gap={4} align="stretch" flexWrap="wrap">
          <Skeleton height="180px" flex="1" minW="280px" borderRadius="md" />
          <Skeleton height="180px" flex="1" minW="280px" borderRadius="md" />
        </HStack>

        <Skeleton height="420px" borderRadius="md" />
      </Stack>
    </Box>
  );
}
