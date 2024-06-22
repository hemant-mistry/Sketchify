import React from 'react'
import { useParams } from 'react-router-dom';

const Test = () => {
    const { roomNumber } = useParams();
  return (
    <div>
      <h1>Room Number: {roomNumber}</h1>
    </div>
  )
}

export default Test