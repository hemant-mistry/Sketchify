import React, { useState } from 'react';

const WaitingRoom = ({handleWaitingRoom}) => {
    const players = ['Player 1', 'Player 2', 'Player 3']; // Replace with your player data
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
        console.log('Function triggered after 3 seconds');

    };


    return (
        <div>
            <h1>Waiting Room</h1>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
            <button onClick={startGame}>{timer}</button>
        </div>
    );
};

export default WaitingRoom;
