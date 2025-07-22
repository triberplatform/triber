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
  maxSizeKB?: number; // Add maxSizeKB prop with default value in component
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  name,
  accept,
  onChange,
  onBlur,
  error,
  touched,
  maxSizeKB = 5000, // Default to 800KB if not specified
}) => {
  const [fileName, setFileName] = useState<string>('');
  const [inputKey, setInputKey] = useState<number>(Date.now());
  const [sizeError, setSizeError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError('');
    
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      const file = event.currentTarget.files[0];
      
      // Check file size (convert KB to bytes by multiplying by 1024)
      if (file.size > maxSizeKB * 1024) {
        setSizeError(`File size exceeds ${maxSizeKB}KB limit`);
        setFileName('');
        onChange(null);
        setInputKey(Date.now()); // Reset input
        return;
      }
      
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName('');
      onChange(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setSizeError('');
    onChange(null);
    setInputKey(Date.now()); // Reset the key to force re-render
  };

  const displayError = sizeError || (touched && error ? error : '');

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
          {fileName || (displayError ? <span className="text-red-500">{displayError}</span> : 'No file chosen')}
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
      {sizeError && <p className="mt-1 text-sm text-red-500">{sizeError}</p>}
    </div>
  );
};

export default DocumentUpload;