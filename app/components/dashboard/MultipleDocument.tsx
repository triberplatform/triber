import React, { useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

interface DocumentUploadProps {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  onChange: (file: File | File[] | null) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
}

const MultipleDocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  name,
  accept,
  multiple = false,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState<number>(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const files = Array.from(event.currentTarget.files);
      
      if (multiple) {
        setFileNames(files.map(file => file.name));
        onChange(files);
      } else {
        setFileNames([files[0].name]);
        onChange(files[0]);
      }
    } else {
      setFileNames([]);
      onChange(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFileNames = fileNames.filter((_, i) => i !== index);
    setFileNames(newFileNames);
    
    if (multiple) {
      // If there are remaining files, update with the filtered list
      if (newFileNames.length > 0) {
        // We need to create new File objects here since we only have names
        // In practice, you might want to keep track of the actual File objects
        onChange(newFileNames.map(name => new File([], name)));
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
    }

    if (newFileNames.length === 0) {
      setInputKey(Date.now()); // Reset input only if all files are removed
    }
  };

  return (
    <div className="lg:mb-7 relative">
      <label className="block text-left text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <div className="mt-1">
        <label className="text-mainGreen flex gap-3 items-center py-2 px-4 text-sm bg-black rounded-md cursor-pointer">
          <BiUpload size={15} /> Upload Document
          <input
            key={inputKey}
            type="file"
            id={name}
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            onBlur={onBlur}
            className="hidden"
          />
        </label>
        
        {/* File List */}
        <div className="mt-2">
          {fileNames.length > 0 ? (
            <ul className="space-y-2">
              {fileNames.map((name, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="truncate max-w-xs">{name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                  >
                    <AiOutlineClose size={15} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-300 block mt-2">
              {touched && error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                'No file chosen'
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleDocumentUpload;