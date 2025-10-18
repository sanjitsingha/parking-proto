"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handlepush = () => {
    router.push("/explore");
  };
  return (
    <>
      <div className="w-full bg-[#24262e] flex pt-30  p-4  h-[calc(100vh-90px)]">
        <div className="w-full text-center ">
          <h2 className="text-3xl text-white leading-10 font-inter">
            Find Your
            <br />{" "}
            <span className="font-semibold text-yellow-400">
              Perfect Parking Spot in Seconds
            </span>
          </h2>
          <p className="text-white/60 mt-6 text-sm font-inter">
            No more wasting time searching for parking. Eassy Parking helps you
            quickly find and reserve nearby spaces with just one tap.
          </p>
          <button
            onClick={handlepush}
            className="bg-yellow-400 px-8 py-3  rounded-full font-inter mt-8 text-black font-semibold"
          >
            Find Parking Nearby
          </button>
        </div>
      </div>
    </>
  );
}
