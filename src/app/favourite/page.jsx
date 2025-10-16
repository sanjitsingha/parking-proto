"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ParkingSpaceCard from "@/app/_components/ParkingSpaceCard";
import Image from "next/image";

const Page = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchFavourites = async () => {
            try {
                // 1️⃣ Get favourite IDs from user
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("favourite")
                    .eq("id", user.id)
                    .single();

                if (userError) throw userError;

                const favouriteIds = userData?.favourite || [];

                // 2️⃣ If no favourites, set empty
                if (favouriteIds.length === 0) {
                    setFavourites([]);
                    setLoading(false);
                    return;
                }

                // 3️⃣ Get parking lots by favourite IDs
                const { data: parkingData, error: parkingError } = await supabase
                    .from("parking_lots")
                    .select("*")
                    .in("id", favouriteIds);

                if (parkingError) throw parkingError;

                setFavourites(parkingData);
            } catch (error) {
                console.error("Error fetching favourites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, [user, router]);

    if (loading) {
        return (
            <div className="w-full font-inter h-[calc(100vh-90px)] bg-blue-light flex justify-center items-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    console.log(favourites[0].id);
    const handleCardClick = () => {
        router.push(`/details/${favourites[0].id}`);
    }

    return (
        <div className="w-full font-inter h-[calc(100vh-90px)] bg-blue-light">
            <div className="w-full h-full p-4">
                <h1 className="text-xl text-white mb-4">Favourites</h1>

                {favourites.length === 0 ? (
                    <p className="text-white text-sm">No favourites added yet 🚗</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {favourites.map((lot) => (
                            // <ParkingSpaceCard key={lot.id} details={lot} />
                            // <p key={lot.id}>{lot.name}</p>
                            <div onClick={handleCardClick} key={lot.id} className="w-full h-[100px] flex items-center bg-white rounded-lg shadow-lg"  >

                                <div>
                                    <Image src={lot.images[0]} alt={lot.name} width={100} height={100} />
                                </div>
                                <div>
                                    <p>{lot.name}</p>
                                </div>

                            </div>

                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default Page;
