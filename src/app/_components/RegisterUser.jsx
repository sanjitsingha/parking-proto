import { Bike, Car } from "lucide-react";
import React from "react";

const RegisterUser = () => {
  return (
    <div className=" w-full font-inter  bg-blue-light h-[calc(100vh-90px)]">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex-1 bg-yellow h-full"></div>
        <div className="w-full p-4 min-h-[400px]">
          <form action="">
            <input
              placeholder="Full Name"
              className="bg-gray-100/20 w-full text-lg  text-white px-4 border outline-none border-yellow rounded-lg py-3"
              type="text"
            />
            <input
              placeholder="Phone Number"
              className="bg-gray-100/20 mt-3 w-full text-lg  text-white px-4 border outline-none border-yellow rounded-lg py-3"
              type="number"
            />
            <div className="w-full mt-3">
              <p className="text-white ">
                Type of Vehicle <span className="opacity-50">(Optional)</span>
              </p>
              <div className="w-full flex mt-4 items-center gap-4 ">
                <div className="">
                  <input
                    type="checkbox"
                    id="bike-option"
                    value=""
                    className="hidden peer"
                    required=""
                  />
                  <label
                    for="bike-option"
                    className="inline-flex items-center justify-between w-fit p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="block">
                      <Bike />
                    </div>
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="car-option"
                    value=""
                    className="hidden peer"
                    required=""
                  />
                  <label
                    for="car-option"
                    className="inline-flex items-center justify-between w-fit p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <div className="block">
                      <Car />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <button className="w-full bg-yellow text-black rounded-lg mt-6 px-4 py-3">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
