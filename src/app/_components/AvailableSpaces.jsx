import Image from "next/image";
import React from "react";

const AvailableSpaces = () => {
  return (
    <div className="w-full p-4">
      <div className="w-full bg-white">
        <div className="w-full">
          <Image
            src={"/public/no-image.jpg"}
            width={600}
            height={600}
            alt="image"
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableSpaces;
