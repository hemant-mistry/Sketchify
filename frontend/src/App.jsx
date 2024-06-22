import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Test from './components/Test';

function App() {
  const [roomNumber, setRoomNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Room Number:', roomNumber);
    navigate(`/room/${roomNumber}`); // Use navigate to redirect
    
  };

  return (
    <div>
      <h1>Sketchify</h1>
      {/* ... other content */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="roomNumber">Room Number:</label>
        <input
          type="text"
          id="roomNumber"
          name="roomNumber"
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <button type="submit">Join room</button>
      </form>
    </div>
  );
}

export default App;
