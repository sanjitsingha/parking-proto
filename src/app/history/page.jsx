import { CalendarRange, Clock, IndianRupee, MapPinIcon } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="bg-blue-light font-inter w-full h-[calc(100vh-90px)]">
      <div className="p-4">
        <div className="w-full bg-blue-dark rounded-md border-white/15 border ">
          <div className="flex p-2 items-center justify-between">
            <h1 className="text-[16px]  text-white  ">
              Ghoshpukur Parking Lot
            </h1>
            <span className="text-white/60 items-center flex gap-1 text-xs">
              <CalendarRange size={12} /> <p className="">16/10/20025</p>
            </span>
          </div>
          <div className="w-full  border-t  border-blue-light border-dashed p-2">
            <span className="text-white/60 items-center flex gap-1 text-xs">
              <MapPinIcon size={12} />{" "}
              <p className="">Ghoshpukur, Near Bus Stand, Siliguri</p>
            </span>
            <span className="text-white/60 mt-2 items-center flex gap-1 text-xs">
              <Clock size={12} /> <p className="">Time: 12:00 Pm</p>
            </span>
            <span className="text-white/60 mt-2 items-center flex gap-1 text-xs">
              <IndianRupee size={12} /> <p className="">125.00</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
