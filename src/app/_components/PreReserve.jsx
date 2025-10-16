"use client";
import React from "react";
import CarAnimation from "../../../public/animations/free-reserve-animaton.json";
import Lottie from "lottie-react";

const PreReserve = () => {
  return (
    <div className="w-full fixed  top-0 left-0 z-999 h-[calc(100vh-90px)] bg-black/60 flex font-inter items-center p-4 ">
      <div className="w-full bg-white shadow-2xs/10 rounded-xl p-2 min-h-[300px]">
        <div className="min-h-[200px] flex items-center justify-center">
          <Lottie
            animationData={CarAnimation}
            loop={true}
            autoplay={true}
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <p className="text-xl font-semibold"> Free Reserve</p>
        <p className="text-sm mt-3 text-black/60">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus, ex harum
        </p>
        <div className="w-full">
          <form action="">
            <select
              required
              className="w-full py-3 border-yellow border px-2 rounded-full"
              name="vehicle"
              id="vehicle"
            >
              <option value="">Choose your Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
            <button className="bg-yellow mt-4 py-3 rounded-full w-full px-4">
              Free Reserve
            </button>
          </form>
        </div>

        <button className="text-sm text-black/60  mt-1">skip</button>
      </div>
    </div>
  );
};

export default PreReserve;
