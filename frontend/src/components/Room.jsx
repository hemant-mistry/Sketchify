import React from 'react'
import { useState } from 'react'
import Canvas from './Canvas.jsx'
import WaitingRoom from './WaitingRoom.jsx'

const Room = () => {
    const [Waitingroom, setWaitingRoom] = useState(true)

    const handleWaitingRoom = () => {
        setWaitingRoom(false)
    }
    
  return (
    <div>
        {Waitingroom ? <WaitingRoom handleWaitingRoom={handleWaitingRoom} /> : <Canvas />}
    </div>
  )
}

export default Room