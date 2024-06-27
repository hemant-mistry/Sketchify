import React, { useState } from "react";

const WaitingRoom = ({ handleWaitingRoom }) => {
  const players = ["Player 1", "Player 2", "Player 3"]; // Replace with your player data
  const [timer, setTimer] = useState("Start");

  const startGame = () => {
    setTimer(3);
    setTimeout(() => {
      setTimer(2);
    }, 1000);
    setTimeout(() => {
      setTimer(1);
    }, 2000);
    setTimeout(() => {
      handleWaitingRoom();
    }, 3000);
  };

  const triggerFunction = () => {
    // Your function logic here
    console.log("Function triggered after 3 seconds");
  };
  const PlayerList = ({ players }) => {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-6'>
        {players.map((player, index) => (
          <div key={index} className='flex flex-col items-center gap-2'>
            <div className='text-sm font-medium text-foreground'>{player}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className=' rounded-md'>
      <h1 className='text-black my-10'>Waiting Room</h1>
      {/* <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul> */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 py-6'>
        {players.map((player, index) => (
          <div key={index} className='flex flex-col items-center gap-2'>
            <span class='relative flex shrink-0 overflow-hidden rounded-full w-12 h-12 bg-black'>
              <span class='flex h-full w-full items-center justify-center rounded-full bg-muted'>
                {player[0] + (index + 1)}
              </span>
            </span>
            <div className='text-sm font-medium text-foreground text-black'>
              {player}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={startGame}
        class='bg-indigo-950 text-indigo-100 border border-indigo-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group w-full'
      >
        <span class='bg-indigo-400 shadow-indigo-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]'></span>
        {timer}
      </button>
    </div>
  );
};

export default WaitingRoom;
