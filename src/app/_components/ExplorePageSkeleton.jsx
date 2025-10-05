import React from "react";

const ExplorePageSkeleton = () => {
  return (
    <div className="p-4  flex flex-col gap-6">
      <div className="w-full animate-pulse p-2 rounded-lg overflow-hidden  bg-gray-100 ">
        <div className="bg-gray-300 rounded-lg animate-pulse h-[230px]"></div>
        <div className="bg-gray-300 rounded-lg animate-pulse mt-3 h-[60px]"></div>
      </div>

      <div className="w-full animate-pulse p-2 rounded-lg overflow-hidden  bg-gray-100 ">
        <div className="bg-gray-300 rounded-lg animate-pulse h-[230px]"></div>
        <div className="bg-gray-300 rounded-lg animate-pulse mt-3 h-[60px]"></div>
      </div>

      <div className="w-full animate-pulse p-2 rounded-lg overflow-hidden  bg-gray-100 ">
        <div className="bg-gray-300 rounded-lg animate-pulse h-[230px]"></div>
        <div className="bg-gray-300 rounded-lg animate-pulse mt-3 h-[60px]"></div>
      </div>
    </div>
  );
};

export default ExplorePageSkeleton;
