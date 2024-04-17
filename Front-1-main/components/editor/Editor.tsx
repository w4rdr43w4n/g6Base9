"use client";
// import dynamic from 'next/dynamic';
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
// import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";
import { Sapling } from "@saplingai/sapling-js/observer";
import { useEffect,useState } from 'react';
import { ModeToggle } from "./ModeToggle";



export const Editor = () => {
  const [value, setValue] = React.useState('');
  const handleChange = (value:string) => {
    setValue(value);
  };
  const quillRef = React.useRef<any>();
  useEffect(() => {
    Sapling.init({
      key: '2J7D6F5JDX3HBH5UJB3CS0UA9W0HZORO',
      endpointHostname: 'https://api.sapling.ai',
      editPathname: '/api/v1/edits',
      advancedEdits: {
        advance_edits: true,
    },
      statusBadge: true,
      mode: 'dev',
    });

    // Ensure the Quill instance is initialized before observing
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      //console.log('editor :',quillInstance);
      const contentEditable = quillInstance.root
    // console.log(contentEditable);
      Sapling.observe(contentEditable);
        }
  });
   const handleKeyDown = (event:React.KeyboardEvent) => {
       if (event.key === "Tab") {
           event.preventDefault()
           setValue(value); 
       }
   };

   const handleEditorChange = (value:string) => {
       setValue(value);
   };

  return (
    <div>
    <div className="relative mx-auto max-w-5xl mt-10" >
      
      <ModeToggle/>
        <EditorToolbar />
      <ReactQuill
				value={value}
				onChange={handleEditorChange}
				modules={modules}
				onKeyDown={handleKeyDown}
				formats={formats}
			// Assign the quill ref to the ReactQuill component
        ref={quillRef}
			/>
   </div>
   </div>
  );
};

export default Editor;
