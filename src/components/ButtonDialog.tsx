import React from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner";

type LoadingButtonProps = {
  loading?: boolean;
  btnColor?: string;
  textColor?: string;
  children: React.ReactNode;
  onClick?: () => void; // Bấm nút chính
  showCancel?: boolean; // Kiểm soát hiển thị nút Cancel
  onCancel?: () => void; // Bấm nút Cancel
};

export const ButtonDialog: React.FC<LoadingButtonProps> = ({
  textColor = "text-white",
  btnColor = "bg-black",
  children,
  loading = false,
  onClick,
  showCancel = false,
  onCancel,
}) => {
  return (
    <div className="flex items-center gap-3 mt-6">
      {/* Nút chính */}
      <button
        type="button"
        onClick={onClick}
        className={twMerge(
          `border border-white w-[190px] p-3 rounded-[100px] transition`,
          `${btnColor} ${loading ? "bg-gray-700" : ""}`
        )}
        disabled={loading}
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

      {/* Nút Cancel (hiển thị nếu showCancel = true) */}
      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-400 bg-gray-600 text-white w-[120px] p-3 rounded-[100px] transition hover:bg-gray-500"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
