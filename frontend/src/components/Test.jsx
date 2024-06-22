import React from 'react'
import { useParams } from 'react-router-dom';


const Test = ({ formData }) => {
    const { option1, option2 } = formData;
    const { roomNumber } = useParams();
    return (
        <div>
            <h1>Test</h1>
            <p>Room Number: {roomNumber}</p>
            <p>Option 1: {option1 ? 'Yes' : 'No'}</p>
            <p>Option 2: {option2 ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default Test