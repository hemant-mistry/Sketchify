import React from 'react';
import { FaCircle, FaEraser, FaArrowDown } from 'react-icons/fa';

const Toolbar = ({
    color,
    setColor,
    isEraserActive,
    setIsEraserActive,
    strokeWidth,
    setStrokeWidth,
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <FaCircle style={{ color: 'red', margin: '0 4px', fontSize: '36px', cursor: "pointer", background: color === 'red' && !isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setColor('red')} />
            <FaCircle style={{ color: 'green', margin: '0 4px', fontSize: '36px', cursor: "pointer", background: color === 'green' && !isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setColor('green')} />
            <FaCircle style={{ color: 'blue', margin: '0 4px', fontSize: '36px', cursor: "pointer", background: color === 'blue' && !isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setColor('blue')} />
            <FaCircle style={{ color: 'gold', margin: '0 4px', fontSize: '36px', cursor: "pointer", background: color === 'gold' && !isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setColor('gold')} />
            <FaCircle style={{ color: 'purple', margin: '0 4px', fontSize: '36px', cursor: "pointer", background: color === 'purple' && !isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setColor('purple')} />
            <div style={{ borderLeft: '1px solid black', height: '24px', margin: '0 4px' }}></div>
            <FaEraser style={{ margin: '0 4px', fontSize: '24px', cursor: "pointer", background: isEraserActive ? 'rgba(0, 0, 0, 0.1)' : 'none' }} onClick={() => setIsEraserActive(!isEraserActive)} />
            <FaArrowDown style={{ margin: '0 4px', fontSize: '24px', cursor: "pointer" }} />
        </div>
    );
};

export default Toolbar;
