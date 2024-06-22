import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
    margin: '0.5rem',
    width: '100%',
};

const Canvas = () => {
    const [color, setColor] = React.useState('red');
    const [isEraserActive, setIsEraserActive] = React.useState(false);
    const [strokeWidth, setStrokeWidth] = React.useState(4);

    const handleColorChange = (newColor) => {
        setColor(newColor);
    };

    const handleEraserToggle = () => {
        setIsEraserActive(!isEraserActive);
    };

    const handleStrokeWidthChange = (event) => {
        setStrokeWidth(event.target.value);
    };

    return (
        <div style={{ height:"100%", width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '90vw',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <button onClick={() => handleColorChange('red')}>Red</button>
                    <button onClick={() => handleColorChange('blue')}>Blue</button>
                    <button onClick={() => handleColorChange('green')}>Green</button>
                    <button onClick={handleEraserToggle}>{isEraserActive ? 'Disable Eraser' : 'Enable Eraser'}</button>
                </div>

                <input
                    type="range"
                    min="1"
                    max="100" // Updated max value to 100
                    value={strokeWidth}
                    onChange={handleStrokeWidthChange}
                />

                <ReactSketchCanvas
                    style={styles}
                    strokeWidth={strokeWidth}
                    strokeColor={isEraserActive ? '#ffffff' : color}
                    withTimestamp={false}
                    ref={(canvas) => {
                        console.log(canvas);
                    }}
                />
            </div>
        </div>
    );
};

export default Canvas;