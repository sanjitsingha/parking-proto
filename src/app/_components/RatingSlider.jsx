"use client";
import React, { useState } from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const RatingSlider = ({ onRateChange }) => {
  const [rating, setRating] = useState(3);

  const handleChange = (value) => {
    setRating(value); // update local state
    if (onRateChange) {
      onRateChange(value); // send value back to parent
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Slider
        min={1}
        max={5}
        step={0.5}
        value={rating}
        onChange={handleChange}
        included={true}
        dotStyle={{ borderColor: "gold" }}
        activeDotStyle={{ borderColor: "orange" }}
        handleStyle={{
          borderColor: "gold",
          backgroundColor: "gold",
        }}
        trackStyle={{ backgroundColor: "#ec1c36" }}
        railStyle={{ backgroundColor: "#12a4dd" }}
      />

      <p className="mt-4 font-raleway text-lg">Your Rating: {rating} ⭐</p>
    </div>
  );
};

export default RatingSlider;
