import React, { useState } from "react";

export const EndGame = () => {
  return (
    <div className='flex flex-col items-center space-y-2  bg-white p-16 rounded-md'>
      {/* <img
        src='https://media.giphy.com/media/3o7TKz9bX9v9KzC4xy/giphy.gif'
        alt='End Game'
      /> */}
      {/* <Carousel
        images={[
          "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?cs=srgb&dl=pexels-padrinan-255379.jpg&fm=jpg",
          "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjU0NmJhdGNoMy1teW50LTM0LWJhZGdld2F0ZXJjb2xvcl8xLmpwZw.jpg",
          "https://via.placeholder.com/250",
        ]}
      /> */}
      <div>
        <h1 className='text-3xl font-bold text-black'>Game Over</h1>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Play Again
        </button>
      </div>
    </div>
  );
};

const Carousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='carousel' style={{ width: "100%" }}>
      <button onClick={handlePrev}>Previous</button>
      <img
        src={images[currentImageIndex]}
        alt='Carousel Image'
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Carousel;
