import React from "react";

const page = () => {
  return (
    <div className="w-full font-inter h-[calc(100vh-90px)] bg-blue-light">
      <div className="w-full h-full p-4">
        <p className="text-sm text-white">Notifications</p>
        <div className=" py-4">
          <div className="w-full h-fit rounded-lg shadow-sm bg-blue-dark border border-white/15 p-2">
            <p className="text-white text-sm ">
              We are Launching Soon | Get Ready
            </p>
            <p className="text-xs mt-3 text-white/60">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore
              laboriosam nam velit iure praesentium voluptates amet magni
              architecto in iusto?
            </p>
            <div className="w-full flex pt-2 border-t border-white/15 mt-4 items-center ">
              <p className=" text-[10px] text-white">21-10-2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
