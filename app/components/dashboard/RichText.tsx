import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useField } from 'formik';

interface fields{
    name:string,
    label:string,
    placeholder:string
}

    const QuillEditor = ({ name, label, placeholder }:fields) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="mb-4 text-white">
      <label className="block text-sm  font-medium mb-1">{label}</label>
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