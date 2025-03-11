import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder:string;
};

const InputField: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="mb-4">
      <span className='text-left text-[#0C1421] mb-2'>
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className='input w-full p-3 border border-[#D4D7E3] min-w-8 rounded-[100px] text-black bg-white'
        {...register(name)}
      />
      {errors[name] && (
        <span className="text-red-500">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default InputField;
