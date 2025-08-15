"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Topbar from "@/app/_components/topbar";
import Image from "next/image";
import { ArrowLeft, Cctv, MapPin, Star, TruckElectricIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const supabase = createClientComponentClient();
  const [details, setDetails] = useState(null);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    async function fetchData() {
      const { data: row, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setDetails(row);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  if (!details) return <p>Loading...</p>;

  console.log(details);
  return (
    <div className="w-full font-raleway">
      <button
        onClick={handleGoBack}
        className="bg-white h-12 w-12 rounded-full fixed top-5 left-5 flex items-center justify-center"
      >
        <ArrowLeft />
      </button>
      <div className=" fixed top-8 bg-green-500 border border-green-200 py-1 px-3 rounded-full right-5">
        <p className="text-white">{details.status}</p>
      </div>
      <div className="w-full bg-gray-200 object-cover h-[300px]">
        <Image
          width={600}
          height={600}
          src={details.images[0]}
          alt="profile image"
        />
      </div>
      <div className="p-4">
        <h2 className="font-raleway text-2xl font-semibold">{details.name}</h2>
        <span className="flex mt-2 text-black/60 items-center gap-1">
          <MapPin color="green" size={16} />{" "}
          <p className="font-medium ">{details.name}</p>
        </span>
        <span className="flex items-center gap-1 mt-2 ">
          <p>5.3</p>
          <span className="text-yellow-400 flex items-center">
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
            <Star size={14} />
          </span>
          <p>(100 Reviews)</p>
        </span>
        <hr className="my-4 opacity-20" />

        <div className="w-full grid grid-cols-3">
          <div className="flex flex-col items-center">
            <TruckElectricIcon />
            <p className="text-center">EV Charging Available</p>
          </div>
          <div className="flex flex-col items-center">
            <Cctv />
            <p className="text-center">CCTV Available</p>
          </div>
          <div className="flex flex-col items-center">
            <Cctv />
            <p className="text-center">CCTV Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
