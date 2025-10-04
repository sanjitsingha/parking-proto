"use client";
import { Navigation, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CurrentLocationParking from "../_components/CurrentLocationParking";
import AvailableSpaces from "../_components/AvailableSpaces";

const page = () => {
  const router = useRouter();
  const [locationPermission, setlocationPermission] = useState(null);

  return (
    <div className="font-inter">
      <div className="w-full h-[calc(100vh-90px)] ">
        {/* Location permision */}
        <div className="w-full hidden bg-[#24262e] p-4 pt-50  flex-col items-center h-full text-center gap-6">
          <p className="font-semibold text-white text-xl">Enable Location</p>
          <div className="bg-[#18191F] p-6 rounded-full">
            <Navigation className="text-white mx-auto" size={60} />
          </div>
          <p className="text-white/60 text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum
            accusantium adipisci impedit.
          </p>
          <button className="bg-yellow-400 px-6 py-3 rounded-full">
            Allow Location
          </button>
        </div>
        <CurrentLocationParking />
        {/* <AvailableSpaces /> */}
      </div>
    </div>
  );
};

export default page;
