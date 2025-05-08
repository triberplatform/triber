"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useField } from 'formik';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="border rounded h-40"></div>,
});

// Note: CSS should be imported elsewhere (see solutions above)

interface fields {
  name: string,
  label: string,
  placeholder: string
}

const QuillEditor = ({ name, label, placeholder }: fields) => {
  const [field, meta, helpers] = useField(name);
  
  return (
    <div className="mb-4 text-white">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <ReactQuill
        value={field.value}
        onChange={(content) => helpers.setValue(content)}
        onBlur={() => helpers.setTouched(true)}
        placeholder={placeholder}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
          ]
        }}
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default QuillEditor;