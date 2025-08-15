import { BellDotIcon } from "lucide-react";
import React from "react";

const topbar = () => {
  return (
    <div className="bg-white fixed w-full h-[90px] flex items-center justify-between px-4 shadow-2xl/5">
      <h3 className="font-raleway text-2xl">Explore</h3>
      <div className="w-12 rounded-md h-12 flex items-center justify-center bg-green-100">
        <BellDotIcon size={28} />
      </div>
    </div>
  );
};

export default topbar;
