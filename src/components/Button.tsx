import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
};

export const Button: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-black",
  children,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      className={twMerge(
        `border border-[#ffffff] w-[190px] p-3 mt-6 rounded-[100px]  transition`,
        `${btnColor} ${loading && "bg-[#000000]"}`
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-3">
          <Spinner />
          <span className="text-white inline-block">Loading...</span>
        </div>
      ) : (
        <span className={`text-white font-medium ${textColor}`}>
          {children}
        </span>
      )}
    </button>
  );
};
