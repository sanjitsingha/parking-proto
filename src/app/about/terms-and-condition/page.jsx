"use client";
import { ChevronLeft } from "lucide-react";
import React from "react";

import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  return (
    <div className="w-full font-inter h-[calc(100vh-90px)] bg-blue-light">
      <div className="w-full  py-4 items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="text-yellow flex item-center gap-1"
        >
          <ChevronLeft /> <p>Go Back</p>
        </button>
      </div>
      <div className="w-full mt-3">
        <p className="text-xl text-center text-white font-semibold">
          Terms and Condition
        </p>
      </div>
    </div>
  );
};

export default page;
