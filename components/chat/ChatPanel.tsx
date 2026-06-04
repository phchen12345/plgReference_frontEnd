"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Stack, Text, Textarea } from "@chakra-ui/react";
import { Send } from "lucide-react";

type ChatMessage = {
  id: string;
  nickname: string;
  text: string;
  createdAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3100";

function getWebSocketUrl() {
  const url = new URL(API_BASE_URL);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/chat";
  url.search = "";
  return url.toString();
}

export function ChatPanel() {
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 建立 WebSocket 連線後，後端會推送歷史訊息、新訊息與線上人數。
  // 使用者名稱固定由後端設定為「匿名球迷」。
  useEffect(() => {
    const socket = new WebSocket(getWebSocketUrl());
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnected(true);
    });

    socket.addEventListener("close", () => {
      setConnected(false);
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat.history") {
        setMessages(data.messages);
        setOnlineCount(data.onlineCount);
      }

      if (data.type === "chat.message") {
        setMessages((current) => [...current, data.message]);
      }

      if (data.type === "chat.presence") {
        setOnlineCount(data.onlineCount);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [cooldown]);

  function sendMessage() {
    const value = text.trim();

    if (!value || socketRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "chat.message",
        text: value,
      }),
    );

    setText("");
    setCooldown(10);
  }

  return (
    <Stack
      gap={4}
      h="full"
      minH={0}
      bg="white"
      color="gray.950"
      _dark={{ bg: "gray.900", color: "gray.100" }}
    >
      <HStack justify="space-between" align="flex-start">
        <Stack gap={1}>
          <Text as="h2" fontSize="lg" fontWeight="bold">
            聊天室
          </Text>
          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            {connected ? "已連線" : "未連線"} · {onlineCount} 人在線
          </Text>
        </Stack>
      </HStack>

      <Stack
        gap={3}
        flex="1"
        minH={0}
        overflowY="auto"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        bg="gray.50"
        _dark={{ bg: "gray.950", borderColor: "gray.800" }}
      >
        {messages.length === 0 ? (
          <Text color="gray.500" fontSize="sm" _dark={{ color: "gray.400" }}>
            目前沒有訊息
          </Text>
        ) : (
          messages.map((message) => (
            <Box key={message.id}>
              <HStack gap={2}>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  _dark={{ color: "gray.400" }}
                >
                  {message.nickname}
                </Text>

                <Text
                  fontSize="xs"
                  color="gray.400"
                  _dark={{ color: "gray.500" }}
                >
                  {new Date(message.createdAt).toLocaleTimeString("zh-TW", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </HStack>

              <Text>{message.text}</Text>
            </Box>
          ))
        )}
        <Box ref={messagesEndRef} h="1px" />
      </Stack>

      <HStack align="end">
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="輸入訊息"
          maxLength={50}
          rows={2}
        />
        <Button
          onClick={sendMessage}
          disabled={!connected || !text.trim() || cooldown > 0}
        >
          <Send size={18} />
          {cooldown > 0 ? `${cooldown}s` : "送出"}
        </Button>
      </HStack>
    </Stack>
  );
}
