import {
  Avatar,
  AvatarBadge,
  Button,
  Flex,
  Input,
  Box,
  Center,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevMessages) => [...prevMessages, data]);
    });
  }, [socket]);

  function changeCurrentMessage(event) {
    setCurrentMessage(event.target.value);
  }

  async function sendMessage() {
    if (currentMessage.length > 0) {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage("");
    }
  }

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex w="40%" h="90%" flexDirection="column">
        <Flex className="chat-header" alignItems="center" mb={3}>
          <Avatar name={room} me={3}>
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>
          <p>Live Chat, room {room}</p>
        </Flex>
        <Box className="chat-body" border="1px" borderColor="gray.200">
          {messageList.length ? (
            messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      {messageContent.message}
                    </div>
                    <Flex>
                      <div className="message-time">{messageContent.time}</div>
                      <div className="message-author">
                        {messageContent.author}
                      </div>
                    </Flex>
                  </div>
                </div>
              );
            })
          ) : (
            <Center h="100%">
              <Text color="gray.400">Try sending a new message</Text>
            </Center>
          )}
        </Box>
        <Flex className="chat-footer" w="100%" mt={3}>
          <Input
            type="text"
            value={currentMessage}
            placeholder="Type something..."
            borderRadius="none"
            onChange={changeCurrentMessage}
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}
          />
          <Button
            borderRadius="none"
            disabled={currentMessage.trim().length <= 0}
            onClick={sendMessage}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Chat;
