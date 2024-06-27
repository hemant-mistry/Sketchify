import * as React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import Toolbar from "./ui/Toolbar";
import { FaTrash } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
  margin: "0.5rem",
  width: "100%",
};

const Canvas = ({ handleEndGame }) => {
  const [color, setColor] = React.useState("red");
  const [isEraserActive, setIsEraserActive] = React.useState(false);
  const [strokeWidth, setStrokeWidth] = React.useState(4);
  const [customColor, setCustomColor] = React.useState("");

  const canvasRef = React.useRef(null);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setIsEraserActive(false);
  };

  const handleEraserToggle = () => {
    setIsEraserActive(!isEraserActive);
  };

  const handleStrokeWidthChange = (event) => {
    setStrokeWidth(event.target.value);
  };

  const handleCustomColorChange = (event) => {
    setCustomColor(event.target.value);
  };

  const handleDeleteCanvas = () => {
    const canvas = canvasRef.current;
    canvas.clearCanvas();
  };

  const colorPalette = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
  ];

  const playerList = {
    "Player 1": "red",
    "Player 2": "blue",
    "Player 3": "green",
    "Player 4": "yellow",
    "Player 5": "orange",
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "90vw",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Toolbar
              color={color}
              setColor={handleColorChange}
              isEraserActive={isEraserActive}
              setIsEraserActive={handleEraserToggle}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
            />

            <FaTrash
              style={{ margin: "0 4px", fontSize: "24px", cursor: "pointer" }}
              onClick={handleDeleteCanvas}
            />
            <button onClick={handleEndGame}>Get Image</button>
          </div>
        </div>

        <input
          type='range'
          min='1'
          max='100' // Updated max value to 100
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
          style={{ width: "90%" }}
        />
        {/* <p>Current Width: {strokeWidth}px</p> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "1rem",
            width: "100%",
            height: "100%",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: "#f0f0f0",
              borderRadius: "0.25rem",
              width: "15%",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                borderBottom: "1px solid #9c9c9c",
                width: "100%",
              }}
            >
              <FaClock
                fill='black'
                style={{
                  fontSize: "1.5rem",
                  marginBottom: 20,
                }}
              />
              <span
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "1.5rem",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                1
              </span>
            </div>

            {Object.keys(playerList).map((player, index) => (
              <div
                key={index}
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "black",
                  borderBottom: "1px solid #9c9c9c",
                  width: "100%",
                  padding: "0.5rem",
                }}
              >
                {player}
              </div>
            ))}
          </div>
          <ReactSketchCanvas
            id='sketch-canvas'
            style={styles}
            strokeWidth={strokeWidth}
            strokeColor={customColor || (isEraserActive ? "#ffffff" : color)}
            withTimestamp={false}
            ref={canvasRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;
