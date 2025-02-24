"use client";

import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
}

const TextArea: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  return (
    <div className="lg:mb-7 relative">
      <label
        className="block text-left text-sm font-medium"
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        className={`mt-1 block w-full bg-mainBlack placeholder:text-gray-500 text-white p-2 border ${
          error && touched ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y`}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={5}
      />
      {error && touched && (
        <div className="text-red-500 text-sm mt-1 absolute mx-auto italic">
          {error}
        </div>
      )}
    </div>
  );
};

export default TextArea;