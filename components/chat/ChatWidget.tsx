"use client";

import { useState } from "react";
import { Box, IconButton, Portal } from "@chakra-ui/react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Portal>
      <Box
        position="fixed"
        right={{ base: 4, md: 6 }}
        bottom={{ base: 4, md: 6 }}
        zIndex={1400}
      >
        {open ? (
          <Box
            w={{ base: "calc(100vw - 32px)", sm: "380px" }}
            h={{ base: "min(620px, calc(100vh - 32px))", sm: "560px" }}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="2xl"
            p={4}
            _dark={{ bg: "gray.900", borderColor: "gray.800" }}
          >
            <IconButton
              aria-label="關閉聊天室"
              size="sm"
              variant="ghost"
              position="absolute"
              top={3}
              right={3}
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </IconButton>

            <ChatPanel />
          </Box>
        ) : (
          <IconButton
            aria-label="開啟聊天室"
            w="56px"
            h="56px"
            borderRadius="full"
            colorPalette="gray"
            boxShadow="xl"
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={24} />
          </IconButton>
        )}
      </Box>
    </Portal>
  );
}
