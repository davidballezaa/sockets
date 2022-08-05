import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import {
  Box,
  Button,
  ChakraProvider,
  Center,
  Heading,
  Input,
  Container,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  function changeUsername(event) {
    setUsername(event.target.value);
  }

  function changeRoom(event) {
    setRoom(event.target.value);
  }

  function joinRoom() {
    if (username.length && room.length) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <ChakraProvider>
      {!showChat ? (
        <Center className="App" height={"100vh"}>
          <Container>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Heading as="h3" size="xl" mb={4}>
                Join A Chat
              </Heading>
              <Input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={changeUsername}
                mb={3}
              />
              <Input
                type="text"
                placeholder="Room ID"
                value={room}
                onChange={changeRoom}
                mb={3}
              />
              <Button
                rightIcon={<ArrowForwardIcon />}
                onClick={joinRoom}
                borderRadius="base"
                colorScheme="blue"
              >
                Join a Room
              </Button>
            </Box>
          </Container>
        </Center>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </ChakraProvider>
  );
}

export default App;
