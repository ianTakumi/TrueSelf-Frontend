export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }], // Header sizes
    ["bold", "italic", "underline", "strike"], // Text styles
    [{ color: [] }, { background: [] }], // Text color & background
    [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ indent: "-1" }, { indent: "+1" }], // Indentation
    [{ align: [] }], // Text Alignment (left, center, right, justify)
    ["blockquote", "code-block"], // Block styles
    ["link"], // Media options
    ["clean"], // Remove formatting
  ],
};
