"use client";
import React, { useEffect, useState } from "react";
import RatingSlider from "@/app/_components/RatingSlider";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const page = () => {
  const params = useParams();
  const id = params.id;

  const supabase = createClientComponentClient();
  const [finalRating, setFinalRating] = useState(null);
  const [parkingData, setparkingData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data: row, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.log(error);
      } else {
        setparkingData(row);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  const handlesubmit = () => {
    console.log(parkingData);
  };

  return (
    <>
      <div className="p-4 pt-30">
        <p>{parkingData?.name}</p>
        <RatingSlider onRateChange={(value) => setFinalRating(value)} />
        <textarea className="w-full font-raleway p-2 text-start rounded-md min-h-[250px] outline-none border border-gray-200" />{" "}
        <button
          onClick={handlesubmit}
          className="w-full h-12 bg-green-500 rounded-md text-white font-raleway text-lg mt-6"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default page;
