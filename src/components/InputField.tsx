import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  add?: boolean;
};

const InputField: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  textarea = false,
  add = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-4">
      <span className="text-left text-[#0C1421] mb-2">{label}</span>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          className={`input w-full p-3 border border-[#D4D7E3] min-w-8 text-black bg-white resize-none ${
            add ? "rounded-xl h-24" : "rounded-xl h-32"
          }`}
          {...register(name)}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`input w-full p-3 border border-[#D4D7E3] min-w-8 text-black bg-white ${
            add ? "rounded-xl h-10" : "rounded-full h-12"
          }`}
          {...register(name)}
        />
      )}
      {errors[name] && (
        <span className="text-red-500">{errors[name]?.message as string}</span>
      )}
    </div>
  );
};

export default InputField;
