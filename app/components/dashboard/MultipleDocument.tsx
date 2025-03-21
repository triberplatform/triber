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
  const [files, setFiles] = useState<File[]>([]);
  const [inputKey, setInputKey] = useState<number>(Date.now());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const selectedFiles = Array.from(event.currentTarget.files);
      
      if (multiple) {
        // For multiple files, add the newly selected files to existing ones
        const updatedFiles = [...files, ...selectedFiles];
        setFiles(updatedFiles);
        onChange(updatedFiles);
      } else {
        // For single file, just use the first one
        setFiles([selectedFiles[0]]);
        onChange(selectedFiles[0]);
      }
    } else {
      setFiles([]);
      onChange(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (multiple) {
      // If there are remaining files, update with the filtered list
      if (newFiles.length > 0) {
        onChange(newFiles);
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
    }

    if (newFiles.length === 0) {
      setInputKey(Date.now()); // Reset input only if all files are removed
    }
  };

  // Function to truncate long filenames
  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop() || '';
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  };

  return (
    <div className="lg:mb-7 relative">
      <label className="block text-left text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <div className="mt-1">
        <label className="text-mainGreen flex gap-3 items-center py-2 px-4 text-sm bg-black rounded-md cursor-pointer hover:bg-black/80 transition-colors">
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
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between text-gray-300 bg-black/20 p-2 rounded">
                  <span className="truncate max-w-xs" title={file.name}>
                    {truncateFileName(file.name)}
                  </span>
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