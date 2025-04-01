import React, { useEffect, useState } from "react";
import { GoDash } from "react-icons/go";

interface ArrayInputProps {
  label: string;
  name: string;
  values: string[] | string; // Can be array or string representation of array
  onChange: (values: string[]) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
  errors?: string[]; // Array of errors for each input
  touched?: boolean[]; // Array of touched states for each input
}

const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  name,
  values,
  onChange,
  onBlur,
  errors = [],
  touched = [],
}) => {
  // Parse values if needed and maintain as state
  const [parsedValues, setParsedValues] = useState<string[]>([]);
  
  // Parse values on component mount or when values change
  useEffect(() => {
    let arrayValues: string[] = [];
    
    // Handle different formats of values
    if (Array.isArray(values)) {
      // Already an array
      arrayValues = values;
    } else if (typeof values === 'string') {
      try {
        // Try to parse as JSON (for format like "[\"Test\",\"test\"]")
        const parsed = JSON.parse(values);
        if (Array.isArray(parsed)) {
          arrayValues = parsed;
        } else {
          // If parsed but not an array, use as single item
          arrayValues = [values];
        }
      } catch (e) {
        // If parsing fails, treat as a single string value
        arrayValues = [values];
      }
    } else if (values === null || values === undefined) {
      // Handle null/undefined
      arrayValues = [''];
    }
    
    // Ensure we have at least one empty field
    if (arrayValues.length === 0) {
      arrayValues = [''];
    }
    
    setParsedValues(arrayValues);
  }, [values]);

  // Handle value change for a specific index
  const handleValueChange = (index: number, newValue: string) => {
    const updatedValues = [...parsedValues];
    updatedValues[index] = newValue;
    setParsedValues(updatedValues);
    onChange(updatedValues);
  };

  // Add a new input
  const handleAdd = () => {
    if (parsedValues.length < 3) {
      const updatedValues = [...parsedValues, ""];
      setParsedValues(updatedValues);
      onChange(updatedValues);
    }
  };

  // Remove an input by index
  const handleRemove = (index: number) => {
    const updatedValues = parsedValues.filter((_, i) => i !== index);
    setParsedValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="mb-4">
      <label className="block text-left text-sm font-medium">{label}</label>
      {parsedValues.map((value, index) => (
        <div key={index} className="flex items-center space-x-2 ">
          <div className="w-full">
            <input
              type="text"
              name={`${name}[${index}]`}
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              onBlur={onBlur} // Call the onBlur prop for Formik tracking
              className={`mt-1 block lg:bg-mainBlack placeholder:text-gray-500 text-white p-2 w-full border rounded ${
                errors[index] && touched[index] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={`Enter ${label} ${index + 1}`}
            />
            {/* Display error message if the field is touched and has an error */}
            {errors[index] && touched[index] && (
              <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
            )}
          </div>
          {index > 0 && ( // Show "Remove" button only for inputs beyond the first one
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
        disabled={parsedValues.length >= 3} // Disable when max inputs reached
        className={`mt-4 w-full text-sm px-4 py-2 rounded ${
          parsedValues.length >= 3 ? "bg-gray-400 cursor-not-allowed" : "bg-mainGreen text-white"
        }`}
      >
        Add More
      </button>
    </div>
  );
};

export default ArrayInput;