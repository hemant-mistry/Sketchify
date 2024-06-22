import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Form } from "react-router-dom";

import { Link, Navigate, redirect } from "react-router-dom";
import Test from './components/Test';
import { useParams } from 'react-router-dom';


function App() {
  return (
    <div>
      <h1>Sketchify</h1>
      <p>Sketchify is a web-based collaborative drawing tool.</p>
      <p>Click the button below to start a new room.</p>
      <Link to="/room/1">Start a new room</Link>

      <Form>
        <input type="text" placeholder="Enter room number" />
        <button type="submit">Join room</button>
      </Form>
      
    </div>
  )
}

export default App