import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ placeholder, description, setDescription }) => {
  const theme = "snow";
  //   const handleChange = (html) => {
  //     if (onChange) {
  //       onChange(html);
  //     }
  //   };

  return (
    <div>
      <ReactQuill
        theme={theme}
        value={description}
        onChange={setDescription}
        style={{ color: "black", height: "190px" }}
        modules={TextEditor.modules}
        formats={TextEditor.formats}
        bounds={".app"}
        placeholder={placeholder}
      />
    </div>
  );
};

TextEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

TextEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

TextEditor.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default TextEditor;
