import { Menu } from "lucide-react";
import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <div className="w-full h-[clac(100vh-90px)]  p-4 mt-10 ">
        <div className="hidden">
          <p className="text-2xl font-inter">
            enter you phone number to <br />{" "}
            <span className="text-yellow-400 font-bold">get, set, go..</span>
          </p>
        </div>
        <div>
          <p className="text-2xl font-inter">
            enter 6 digit otp <br />{" "}
            <span className="text-yellow-400 font-bold">
              so, that we can procced
            </span>
          </p>
        </div>
        <form className="w-full font-inter mt-16 hidden ">
          <input
            type="text"
            className="text-xl outline-none font-semibold border-b border-black/10 pb-2 w-full"
            placeholder="Full Name"
          />
          <div className="flex gap-4 border-b border-black/10 mt-6 pb-2">
            <p className="text-xl font-semibold ">+91</p>
            <input
              type="number"
              className="outline-none text-xl font-semibold"
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="w-full text-sm flex items-center gap-2 mt-10 ">
            <input type="checkbox" />
            <p className="opacity/50">
              By ticking Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Atque, vel.
            </p>
          </div>
          <button className="bg-yellow-400 text-xl font-semibold w-full rounded-full mt-10 py-2">
            Procced
          </button>
          <div className="w-full flex items-center justify-center mt-2">
            <Link className="text-black/50 text-center" href={"/setup"}>
              skip
            </Link>
          </div>
        </form>
        <div className="mt-10">
          {/* otp verification div */}
          <div className=" font-inter mt-4 flex gap-4">
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
            <input
              className="outline-none pb-2 border-b border-black/10 w-12 text-center text-xl font-semibold"
              type="number"
            />
          </div>
          <div className="w-full mt-3  items-center justify-center hidden ">
            <p className="text-red-500 font-inter font-semibold">Wrong Otp!!</p>
          </div>
          <button className="bg-yellow-400 text-xl font-semibold w-full rounded-full mt-10 py-2">
            Verify
          </button>
        </div>
      </div>
    </>
  );
};

export default page;
