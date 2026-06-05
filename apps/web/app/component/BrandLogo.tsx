import React from "react";
import DarkIcon from "../favicon.ico";
import LightIcon from "../../public/light.png";
import { useRouter } from "next/navigation";

const BrandLogo = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.replace("/")}
      className="group flex items-center gap-2.5 cursor-pointer"
    >
      {/* Icon wrapper: spins slightly and scales up on hover */}
      <div className="transition-transform duration-300 ease-out  group-hover:rotate-[-8deg]">
        <img
          src={LightIcon.src}
          alt=""
          width={35}
          height={35}
          className="hidden dark:block"
        />
        <img
          src={DarkIcon.src}
          alt=""
          width={35}
          height={35}
          className="block dark:hidden"
        />
      </div>

      {/* Text: slides right slightly + fades to a brand accent color */}
      <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
        SketchFlow
      </span>
    </div>
  );
};

export default BrandLogo;
