import { Box, HStack, Link, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <>
      <Box bg="gray.100" alignItems="center" justifyItems="center">
        <Stack fontSize="sm" color="gray.500">
          <HStack p={4}>
            <Text>本站非官方數據平台，資料來源</Text>
            <Link
              variant="underline"
              href="https://pleagueofficial.com/"
              color="gray.700"
            >
              PLG官方網站
            </Link>
          </HStack>
        </Stack>
      </Box>
    </>
  );
}
