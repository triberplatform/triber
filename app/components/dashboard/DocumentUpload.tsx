import React, { useState } from 'react';
import { BiUpload } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

interface DocumentUploadProps {
  label: string;
  name: string;
  accept?: string;
  onChange: (file: File | null) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  name,
  accept,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [inputKey, setInputKey] = useState<number>(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName('');
      onChange(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    onChange(null);
    setInputKey(Date.now()); // Reset the key to force re-render
  };

  return (
    <div className="lg:mb-7 relative">
      <label className="block text-left text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <div className="mt-1 flex items-center">
        <label className="text-mainGreen flex gap-3 items-center py-2 px-4 text-sm bg-black rounded-md cursor-pointer">
          <BiUpload size={15} /> Upload Document
          <input
            key={inputKey} // Use key to force re-render
            type="file"
            id={name}
            name={name}
            accept={accept}
            onChange={handleFileChange}
            onBlur={onBlur}
            className="hidden"
          />
        </label>
        <span className="ml-3 text-gray-300 flex items-center">
          {fileName || (touched && error ? <span className="text-red-500">{error}</span> : 'No file chosen')}
          {fileName && (
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <AiOutlineClose size={15} />
            </button>
          )}
        </span>
      </div>
    </div>
  );
};

export default DocumentUpload;