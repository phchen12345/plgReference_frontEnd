import { Button, HStack, Text } from "@chakra-ui/react";

export function SchedulePagination({
  page,
  pageCount,
  //   isLoading = false,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <HStack justify="center">
      <Button
        // disabled={page <= 1 || isLoading}
        size="sm"
        variant="outline"
        onClick={() => onPageChange(page - 1)}
      >
        上一頁
      </Button>

      <Text fontSize="sm">
        第 {page} / {pageCount} 頁
      </Text>

      <Button
        // disabled={page >= pageCount || isLoading}
        size="sm"
        variant="outline"
        onClick={() => onPageChange(page + 1)}
      >
        下一頁
      </Button>
    </HStack>
  );
}
