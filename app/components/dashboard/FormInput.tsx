"use client";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?:boolean
}

const FormInput: React.FC<TextInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onBlur,
  onChange,
  touched,
  error,
}) => {
  return (
    <div className="lg:mb-7 relative">
      <label
        className="block text-left text-sm font-medium"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={`mt-1 block bg-mainBlack placeholder:text-gray-500 text-white p-2 w-full border ${
          touched && error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {touched && error &&  <div className="text-red-500 text-sm mt-1 absolute mx-auto italic ">{error}</div>}
    </div>
  );
};

export default FormInput;
