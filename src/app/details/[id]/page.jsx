"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Topbar from "@/app/_components/topbar";
import Image from "next/image";
import {
  ArrowLeft,
  Cctv,
  IndianRupee,
  MapPin,
  Star,
  TruckElectricIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const supabase = createClientComponentClient();
  const [details, setDetails] = useState(null);
  const [activeTab, setactiveTab] = useState("information");

  const reviews = [
    {
      id: "1",
      stars: "2",
      review: "very good",
      date: "15/08/2025",
    },
    {
      id: "2",
      stars: "2",
      review: "very good",
      date: "15/08/2025",
    },
    {
      id: "3",
      stars: "2",
      review: "poor",
      date: "15/08/2025",
    },
    {
      id: "4",
      stars: "4",
      review: "bad",
      date: "15/08/2025",
    },
    {
      id: "5",
      stars: "4",
      review: "wow",
      date: "15/08/2025",
    },
  ];

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

  //   Later on this loading witll changed to loading Animation, or shimmer efect
  if (!details) return <p>Loading...</p>;

  return (
    <div className="w-full font-raleway">
      <button
        onClick={handleGoBack}
        className="bg-white h-12 w-12 rounded-full fixed top-5 left-5 flex items-center justify-center"
      >
        <ArrowLeft />
      </button>

      <div className="w-full fixed bottom-0 p-5 h-30 rounded-t-lg">
        <button className="w-full h-[60px] bg-green-400 flex items-center justify-center rounded-lg">
          <MapPin size={22} color="white" />{" "}
          <p className="font-semibold text-white text-xl">Park Here</p>
        </button>
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
        <div className=" bg-green-500  w-fit h-fit py-1 px-3 rounded-full ">
          <p className="text-white text-[8px]">{details.status}</p>
        </div>
        <h2 className="font-raleway text-2xl font-semibold">{details.name}</h2>
        <span className="flex mt-2 text-black/60 items-center gap-1">
          <IndianRupee color="green" size={16} />{" "}
          <p className="font-medium ">{details.price_per_hour + " /hr"}</p>
        </span>
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

        <div className="w-full grid   grid-cols-3">
          <div className="flex flex-col items-center">
            <TruckElectricIcon />
            <p className="text-center text-sm">EV Charging Available</p>
          </div>
          <div className="flex flex-col items-center">
            <Cctv />
            <p className="text-center text-sm">CCTV Available</p>
          </div>
          <div className="flex flex-col items-center">
            <Cctv />
            <p className="text-center text-sm">CCTV Available</p>
          </div>
        </div>
        <hr className="my-4 opacity-20" />
        <div className="w-full flex gap-3">
          <button
            onClick={() => setactiveTab("information")}
            className={`text-lg font-semibold ${
              activeTab === "information"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setactiveTab("reviews")}
            className={`text-lg font-semibold ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Reviews
          </button>
        </div>
        <div>
          {activeTab === "information" && (
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
              ducimus alias provident qui, adipisci corporis repellat, expedita
              ab odit eligendi numquam consequatur facilis debitis quaerat
              laudantium impedit. Eveniet, voluptatibus voluptatum.
            </p>
          )}
        </div>
        <div className="w-full mt-5">
          {activeTab === "reviews" && (
            <div className="w-full mt-2 ">
              <div className="w-full ">
                <button className="w-full h-[32px] bg-green-500">
                  Write a Review
                </button>
              </div>
              {reviews.map((review) => (
                <div key={review.id}>
                  <span className="bg-green-500 w-fit py-1 px-2 flex items-center rounded-lg text-white font-semibold">
                    <Star size={16} />
                    <p> {review.stars}</p>
                  </span>
                  <p>{review.review}</p>
                  <div className="w-full justify-end flex">
                    <p>{review.date}</p>
                  </div>
                  <hr className="my-2 opacity-15" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
