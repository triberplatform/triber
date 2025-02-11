interface OptionInputProps {
  label: string;
  name: string;
  options: { value: string | boolean; label: string }[];
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
}

const OptionInput: React.FC<OptionInputProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  touched,
  onBlur,
  error,
}) => {
  return (
    <div className="lg:mb-7 relative">
      <label className="block text-left text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`mt-1 block bg-black lg:bg-mainBlack placeholder:text-white text-white p-[0.65rem] w-full border ${
          touched && error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-mainGreen focus:border-mainGreen`}
      >
        <option value="" className="text-gray-500" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value.toString()} // Convert to string for key
            value={option.value.toString()} // Convert boolean to string
            className="hover:bg-mainGreen py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
      {touched && error && (
        <div className="text-red-500 text-sm mt-1 absolute mx-auto italic">
          {error}
        </div>
      )}
    </div>
  );
};

export default OptionInput;
