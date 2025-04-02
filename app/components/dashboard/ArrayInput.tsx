import React, { useEffect, useState } from "react";
import { GoDash } from "react-icons/go";

interface ArrayInputProps {
  label: string;
  name: string;
  values: string[]; // Simplified to only accept string arrays
  onChange: (values: string[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
  errors?: string[]; // Array of errors for each input
  touched?: boolean[]; // Array of touched states for each input
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  name,
  values = [], // Default to empty array
  onChange,
  onBlur,
  errors = [],
  touched = [],
}) => {
  // Use direct state from props
  const [inputValues, setInputValues] = useState<string[]>(values);
  
  // Update state when props change
  useEffect(() => {
    // Ensure we have at least one empty field
    const arrayValues = values.length > 0 ? values : [''];
    setInputValues(arrayValues);
  }, [values]);

  // Handle value change for a specific index
  const handleValueChange = (index: number, newValue: string) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = newValue;
    setInputValues(updatedValues);
    onChange(updatedValues);
  };

  // Add a new input
  const handleAdd = () => {
    if (inputValues.length < 3) {
      const updatedValues = [...inputValues, ""];
      setInputValues(updatedValues);
      onChange(updatedValues);
    }
  };

  // Remove an input by index
  const handleRemove = (index: number) => {
    const updatedValues = inputValues.filter((_, i) => i !== index);
    setInputValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-left text-sm font-medium">{label}</label>
      {inputValues.map((value, index) => (
        <div key={index} className="flex items-center space-x-2 ">
          <div className="w-full">
            <input
              type="text"
              name={`${name}[${index}]`}
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              onBlur={onBlur}
              className={`mt-1 block lg:bg-mainBlack placeholder:text-gray-500 text-white p-2 w-full border rounded ${
                errors[index] && touched[index] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={`Enter ${label} ${index + 1}`}
            />
            {errors[index] && touched[index] && (
              <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
            )}
          </div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-mainGreen bg-black text-xl font-semibold rounded-full p-1"
            >
              <GoDash />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        disabled={inputValues.length >= 3}
        className={`mt-4 w-full text-sm px-4 py-2 rounded ${
          inputValues.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-mainGreen text-white"
        }`}
      >
        Add More
      </button>
    </div>
  );
};

export default ArrayInput;