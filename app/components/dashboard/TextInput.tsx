"use client";
import { useField, useFormikContext } from "formik";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();

  return (
    <div className="lg:mb-7">
      <label
        className="block text-left text-sm font-medium"
        htmlFor={props.name}
      >
        {label}
      </label>
      <input
        className={`mt-1 block w-full bg-black placeholder:text-gray-500 text-white p-2 border border-gray-500 ${
          submitCount > 0 && meta.error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-indigo-500 focus:border-indigo-500 !bg-black`}
        {...field}
        {...props}
      />
      {submitCount > 0 && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;
