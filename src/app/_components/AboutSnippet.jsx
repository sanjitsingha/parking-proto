import React from "react";
import logowhite from "../../../public/logo/easy-parking-logo-white.svg";
import Image from "next/image";
import { LucideHeart } from "lucide-react";
import Link from "next/link";

const AboutSnippet = () => {
  return (
    <div className="w-full absolute bottom-0 left-0 p-4 pb-20 bg-blue-dark">
      <div className="w-full">
        <div className="flex items-center">
          <p className="text-2xl inline text-white font-semibold font-inter">
            Made with
          </p>
          <span className="ml-2">
            <LucideHeart
              className="animate-pulse"
              fill="red"
              color="red"
              size={30}
            />
          </span>
        </div>
        <p className="text-2xl inline text-[#FEC400] font-semibold font-inter">
          in India.
        </p>
      </div>
      <p className="font-inter text-white/50 mt-5 text-xs">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellendus
        tenetur iusto veritatis consequatur accusantium, repudiandae facere
        fugiat voluptas esse sunt?
      </p>
      <Image
        className="z-10 mt-6"
        src={logowhite}
        alt="logo"
        width={140}
        height={100}
      />
      <div className="w-full flex gap-10 mt-10">
        <Link className="text-xs text-yellow" href={"/about/privacy-policy"}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default AboutSnippet;
