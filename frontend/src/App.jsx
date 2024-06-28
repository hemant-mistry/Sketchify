import { useState, useEffect } from "react";

import Test from "./components/Test";
import WaitingRoom from "./components/WaitingRoom";
import Canvas from "./components/Canvas.jsx";
import { EndGame } from "./components/EndGame.jsx";
import axios from "axios";

function App() {
  const [roomNumber, setRoomNumber] = useState("");
  const [showRoomComponent, setShowRoomComponent] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Room Number:", roomNumber);
  };
  // const handleCreateRoom = () => {
  //   const randomRoomNumber = Math.floor(Math.random() * 1000000);
  //   const newUrl = window.location.href + `?room=${randomRoomNumber}`;
  //   window.history.pushState({ path: newUrl }, "", newUrl);
  //   setShowRoomComponent(true);
  // };

  // const handleJoinRoom = () => {
  //   const newUrl = window.location.href + `?room=${roomNumber}`;
  //   window.history.pushState({ path: newUrl }, "", newUrl);
  //   setShowRoomComponent(true);
  // };

  // Check if there is a room parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get("room");

  if (roomParam && !showRoomComponent) {
    setShowRoomComponent(true);
  }

  const handleWaitingRoom = () => {
    console.log("Waiting room");
    setGameStarted(true);
  };

  const handleEndGame = () => {
    setGameStarted(false);
    setShowRoomComponent(false);
    setEndGame(true);
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/create-room/");
      console.log("Created room:", response.data);
      setRoomNumber(response.data.room.room_number); // Update state with created room number
      setShowRoomComponent(true);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/display-rooms/");
      console.log("Available rooms:", response.data);
      setAvailableRooms(response.data.rooms); // Update state with fetched rooms array
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  useEffect(() => {
    fetchAvailableRooms(); // Fetch available rooms when component mounts
  }, []);
  const handleJoinRoom = async (roomId) => {
    const response = await axios.post("http://127.0.0.1:8000/join-room/", {
      room_number: roomNumber,
      user_name: userName,
    });

    console.log("Joined room:", response.data);
    setRoomNumber(response.data.room.room_number); // Update state with joined room number

    // Replace with your WebSocket server URL
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);

    ws.onopen = () => {
      console.log(`WebSocket connected to room ${roomId}`);
      // Send a sample message when the WebSocket connection is opened

      ws.send(JSON.stringify({ message: "Hello, room!", user: "Client" }));
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      // Handle incoming messages from the WebSocket server
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Redirect or handle other UI changes after joining room
    const newUrl = window.location.href + `?room=${roomNumber}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    setShowRoomComponent(true);
  };

  return (
    <div className='w-screen min-h-screen flex justify-center items-center flex-col animated-background h-screen bg-gradient-to-r from-blue-500 via-blue-500 to-indigo-500'>
      {endGame ? (
        <EndGame />
      ) : (
        <div>
          {gameStarted ? (
            <Canvas handleEndGame={handleEndGame} />
          ) : (
            <div className='flex flex-col items-center space-y-2  bg-white p-16 rounded-md'>
              <h1 className='text-3xl font-bold text-black'>Sketching Lobby</h1>

              <p className='text-muted-foreground text-black'>
                Create a new room or join an existing one
              </p>
              <div className='flex flex-col items-center space-y-2 bg-slate-50 p-4'>
                {showRoomComponent ? (
                  <WaitingRoom
                    roomNumber={roomNumber}
                    handleWaitingRoom={handleWaitingRoom}
                  />
                ) : (
                  <>
                    <input
                      type='text'
                      placeholder='Enter UserName'
                      className='border-2 border-gray-300 p-2 rounded-lg bg-white text-black w-64'
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                      type='text'
                      placeholder='Enter room number'
                      className='border-2 border-gray-300 p-2 rounded-lg bg-white text-black w-64'
                      onChange={(e) => setRoomNumber(e.target.value)}
                    />

                    <button
                      onClick={handleJoinRoom}
                      class='bg-indigo-950 text-indigo-100 border border-indigo-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group w-full'
                    >
                      <span class='bg-indigo-400 shadow-indigo-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]'></span>
                      Join room
                    </button>
                    <h3 class='flex items-center w-full'>
                      <span class='flex-grow bg-gray-200 rounded h-1'></span>
                      <span class='mx-3 text-lg font-medium text-gray-500'>
                        Or
                      </span>
                      <span class='flex-grow bg-gray-200 rounded h-1'></span>
                    </h3>
                    <button
                      onClick={handleCreateRoom}
                      class='bg-indigo-950 text-indigo-100 border border-indigo-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group w-full'
                    >
                      <span class='bg-indigo-400 shadow-indigo-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]'></span>
                      Create a new room
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
