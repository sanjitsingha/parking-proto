import React from "react";
import RegisterUser from "../_components/RegisterUser";
import LoginUser from "../_components/LoginUser";

const page = () => {
  return (
    <div className="w-full h-[calc(100vh-90px)] bg-blue-light">
      <div className="w-full h-full p-4 flex flex-col font-inter">
        <div className="flex-1 "></div>
        <div className="w-full pb-10">
          <LoginUser />
        </div>
      </div>
    </div>
  );
};

export default page;
