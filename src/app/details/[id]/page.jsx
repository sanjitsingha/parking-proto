"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Topbar from "@/app/_components/topbar";

const page = () => {
  const params = useParams();
  const id = params.id;

  const supabase = createClientComponentClient();
  const [details, setDetails] = useState(null);

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
    <div className="w-full">
      <Topbar name={details.name} />
    </div>
  );
};

export default page;
