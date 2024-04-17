"use client";
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useContext,
  ReactNode,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./custom-quill.css";
import {
  paraphrase,
  summarize,
  advanced_check,
  pdf,
  complete,
} from "@/app/lib/helpers";
import {
  Import_editor,
  savedocs,
  uplo,
  upload,
} from "@/app/api/search_utils/literature_utils";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import "./toolbar.css";
import Savemodal from "./savemodal";
import Notify from "../Management/notification";
import { parse_date } from "@/app/lib/utils";
//import '@/components/styles/srch_components.css'
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const Customparphrase = () => (
  <svg
    viewBox="0  0  24  24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12  22c-2.206  0-4-1.794-4-4h8c0  2.206-1.794  4-4  4zm0-14c-2.206  0-4  1.794-4  4h8c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c0-2.206-1.794-4-4-4z"></path>
    <path d="M12  2c-2.206  0-4  1.794-4  4v12c0  2.206  1.794  4  4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4z"></path>
    <path d="M12  2c-2.206  0-4  1.794-4  4v12c0  2.206  1.794  4  4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4zm0  14c-2.206  0-4  1.794-4  4h8c2.206  0  4-1.794  4-4v-12c0-2.206-1.794-4-4-4z"></path>
  </svg>
);
const Customsummarize = () => (
  <svg viewBox="0  0  24  24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12  2C6.48  2  2  6.48  2  12C2  17.52  6.48  22  12  22C17.52  22  22  17.52  22  12C22  6.48  17.52  2  12  2ZM12  20C7.59  20  4  16.41  4  12C4  7.59  7.59  4  12  4C16.41  4  20  7.59  20  12C20  16.41  16.41  20  12  20ZM12  16C10.34  16  9  14.66  9  13C9  11.34  10.34  10  12  10C13.66  10  15  11.34  15  13C15  14.66  13.66  16  12  16ZM12  10C13.1  10  14  9.1  14  8C14  6.9  13.1  6  12  6C10.9  6  10  6.9  10  8C10  9.1  10.9  10  12  10ZM12  4C13.1  4  14  3.1  14  2C14  0.9  13.1  0  12  0C10.9  0  10  0.9  10  2C10  3.1  10.9  4  12  4Z"
      fill="currentColor"
    />
  </svg>
);
const DownloadPdfIcon = () => (
  <svg viewBox="0  0  24  24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12  2C6.48  2  2  6.48  2  12C2  17.52  6.48  22  12  22C17.52  22  22  17.52  22  12C22  6.48  17.52  2  12  2ZM12  18C14.3137  18  16  16.3137  16  14C16  11.6863  14.3137  10  12  10C9.6863  10  8  11.6863  8  14C8  16.3137  9.6863  18  12  18ZM12  16C13.1  16  14  14.9  14  13.5C14  12.1  13.1  11  12  11C10.9  11  10  11.9  10  13.5C10  14.9  10.9  16  12  16ZM12  14C12.5523  14  13  13.4477  13  12.9167C13  12.3853  12.5523  12  12  12C11.4477  12  11  12.3853  11  12.9167C11  13.4477  11.4477  14  12  14ZM12  12C12.5523  12  13  11.4477  13  10.9167C13  10.3853  12.5523  10  12  10C11.4477  10  11  10.3853  11  10.9167C11  11.4477  11.4477  12  12  12Z"
      fill="currentColor"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange(this: any) {
  this.quill.history.undo();
}

function redoChange(this: any) {
  this.quill.history.redo();
}
function red() {
  // Dynamically include KaTeX
  const katexStylesheet = document.createElement("link");
  katexStylesheet.href =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css";
  katexStylesheet.rel = "stylesheet";
  document.head.appendChild(katexStylesheet);

  const katexScript = document.createElement("script");
  katexScript.src =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js";
  document.head.appendChild(katexScript);
}
const complet = async function () {
  const editor = document.querySelector(".ql-editor");
  const button = document.querySelector(".ql-completebtn") as HTMLButtonElement;
  if (editor) {
    // Get the current selection
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Save the current selection range
      const range = selection.getRangeAt(0);
      // Disable the button to prevent multiple clicks
      button.disabled = true;
      // Paraphrase the selected text
      const paraphrasedContent = await complete(selection.toString());
      // Replace the selected text with the paraphrased content
      range.deleteContents(); // Remove the selected text
      const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
      range.insertNode(textNode); // Insert the new text node at the selection's position
      // Re-enable the button
      button.disabled = false;
    } else {
      const content = editor.innerHTML;
      console.log(content);
      button.disabled = true;
      const paraphrasedContent = await complete(content);
      editor.innerHTML = paraphrasedContent;
      button.disabled = false;
    }
  }
};
const paraphras = async function () {
  const editor = document.querySelector(".ql-editor");
  const button = document.querySelector(
    ".ql-paraphrasebtn"
  ) as HTMLButtonElement;
  if (editor) {
    // Get the current selection
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // Save the current selection range
      const range = selection.getRangeAt(0);
      // Disable the button to prevent multiple clicks
      button.disabled = true;
      // Paraphrase the selected text
      const paraphrasedContent = await paraphrase(selection.toString());
      // Replace the selected text with the paraphrased content
      range.deleteContents(); // Remove the selected text
      const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
      range.insertNode(textNode); // Insert the new text node at the selection's position
      // Re-enable the button
      button.disabled = false;
    } else {
      const content = editor.innerHTML;
      console.log(content);
      button.disabled = true;
      const paraphrasedContent = await paraphrase(content);
      editor.innerHTML = paraphrasedContent;
      button.disabled = false;
    }
  }
};
const summariz = async function () {
  const editor = document.querySelector(".ql-editor");
  const button = document.querySelector(
    ".ql-paraphrasebtn"
  ) as HTMLButtonElement;
  if (editor) {
    // Get the current selection
    const selection = window.getSelection();
      if (selection && selection.toString().length >  0) {
      // Save the current selection range
      const range = selection.getRangeAt(0);
      // Disable the button to prevent multiple clicks
      button.disabled = true;
      // Paraphrase the selected text
      const paraphrasedContent = await summarize(selection.toString());
      // Replace the selected text with the paraphrased content
      range.deleteContents(); // Remove the selected text
      const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
      range.insertNode(textNode); // Insert the new text node at the selection's position
      // Re-enable the button
      button.disabled = false;
    } else {
      const content = editor.innerHTML;
      console.log(content);
      button.disabled = true;
      const paraphrasedContent = await summarize(content);
      editor.innerHTML = paraphrasedContent;
      button.disabled = false;
    }
  }
  } /*
  const insert = async function (textToInsert: any) {
    const editor = document.querySelector(".ql-editor");
    const button = document.querySelector(".ql-paraphrasebtn") as HTMLButtonElement;
    if (editor) {
       const content = editor.innerHTML;
       console.log(content);
       button.disabled = true;
       // Use insertAdjacentText with 'beforeend' to append text at the end
       editor.insertAdjacentText('beforeend', textToInsert);
       button.disabled = false;
       return { success: true };
    }
   };*/
   const insert = async function (textToInsert: any) {
    const editor = document.querySelector(".ql-editor");
    const button = document.querySelector(".ql-paraphrasebtn") as HTMLButtonElement;
    if (editor) {
        const content = editor.innerHTML;
        console.log(content);
        button.disabled = true;

        // Create a new text node with the text to insert
        const textNode = document.createTextNode(textToInsert);

        // Insert the text node at the end of the editor's content
        editor.appendChild(textNode);

        button.disabled = false;
        return { success: true };
    }
};

      
   
 
const saveAspdf = async (name:string) => {
  const editor = document.querySelector(".ql-editor");
  if (editor?.innerHTML) {
    try {
      const s = await pdf(editor.innerHTML);
      console.log(s);
      const { download_url, status, total_pages } = s;
      console.log(download_url);

      // Fetch the file as a blob
      const response = await fetch(download_url);
      const blob = await response.blob();

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${name}.pdf`; // Specify the filename you want to download as

      // Append the anchor element to the body
      document.body.appendChild(a);

      // Trigger the download
      a.click();
      savedocs("pdf", download_url, status, total_pages, "now");
      // Clean up by removing the anchor element and revoking the object URL
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
};
const saveToFile = async (name: string) => {
  const content = document.querySelector(".ql-editor");
  if (content?.innerHTML) {
    if (content.innerHTML != "<p><br></p>") {
      let c = content.innerHTML;
      const blob = new Blob([c], { type: "text/html" });
      console.log(c);

      // Assuming uplo is an async function that returns a promise
      try {
        const message = await upload(blob, name); // Await the uplo function
        console.log(message.data);
        return { success: true };
      } catch (error) {
        console.error("Error uploading or retrieving HTML content:", error);
        return { success: false };
      }
    } else {
      content.innerHTML = "you can not save an empty doucument";
      return { success: false };
    }
  }
};
const getFile = async (name: string) => {
  const content = document.querySelector(".ql-editor");
  if (content?.innerHTML) {
    content.innerHTML = "loading document...";
    console.log(name);
    // Assuming uplo is an async function that returns a promise
    try {
      console.log(name);
      const message = await uplo(name); // Await the uplo function
      console.log(message.data);
      // Assuming the message contains the HTML content you want to display
      if (message.data.message) {
        content.innerHTML = message.data.message;
        return { success: true };
      } // Update the content with the received HTML
    } catch (error) {
      content.innerHTML = "Error uploading or retrieving HTML content";
      return { success: false };
      console.error("Error uploading or retrieving HTML content:", error);
    }
  }
};

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
  "Roboto",
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      paraphrasebtn: paraphras,
      summarizebtn: summariz,
      completebtn: complet,
      //savebtn: saveAspdf,
      //tab: insertTable
      //sav: saveToFile
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};
addStyles();
// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
  "paraphrasebtn",
  "summarizebtn",
  "formula",
  "font",
  "forms",
  "savebtn",
  "completebtn",
  "sav",
  "get",
];
const options = [
  { value: "f(x)=x^2", label: "Quadratic Function" },
  { value: "\\frac{1}{2}x^2 - x + 1", label: "Parabola Equation" },
  { value: "\\int_{a}^{b} f(x) , dx", label: "integration" },
  {
    value: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
    label: "Sum",
  },
  { value: "\\>", label: "greater" },
  { value: "\\<", label: "less" },
  { value: "\\geq", label: "greater or equal" },
  { value: "\\leq", label: "less or equal" },
  { value: "\\product_{n=1}^{\\infty}", label: "prpduct" },
  { value: "\\f^{-1}(x)", label: "inverse" },
  { value: "\\sqrt[n]{a}", label: "sqrt" },
  { value: "\\frac{a}{b}", label: "fraction" },
  { value: "\\log_b(x)", label: "logaritimic function" },
  { value: "\\ln(x)", label: "ln" },
];
const options2 = [
  { value: "\\alpha", label: "alpha" },
  { value: "\\omega", label: "omega" },
  { value: "\\epsilon", label: "epsilon" },
  { value: "\\beta", label: "beta" },
  { value: "\\gamma", label: "gamma" },
  { value: "\\delta", label: "delta" },
  { value: "\\sigma", label: "sigma" },
  { value: "\\theta", label: "thata" },
  { value: "\\mu", label: "mu" },
  { value: "\\nu", label: "nu" },
  { value: "\\Gamma", label: "Gamma" },
  { value: "\\phi", label: "phi" },
  { value: "\\eta", label: "etha" },
  { value: "\\tau", label: "Tau" },
  { value: "\\rho", label: "rho" },
];

// Quill Toolbar component
export const QuillToolbar = () => {
  const [tab, setTab] = useState(1);
  const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");
  const [eq, seteq] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [filename, setFilename] = useState("");
  const [filename3, setFilename3] = useState("");
  const [collectedItems, setCollectedItems] = useState<any>([]);
  const [update, updateItems] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  //const quill = useContext(QuillContext);
  const handleChange = (selectedOption: any) => {
    console.log(selectedOption.value);
    setLatex(latex + selectedOption.value);
  };
  const handlesave = () => {
    console.log("done");
    setLatex("");
    // red(); // Assuming red() is a function defined elsewhere
    setShowModal(true); // Show the modal
  };

  const handleFilenameSubmit = async () => {
    console.log("Filename submitted:", filename);
    // Here you can handle the filename, e.g., save the file to the server
    setShowModal(false); // Hide the modal
    let res;
    if (filename !== "") {
      res = await saveToFile(filename);
    } else {
      setIsNotif(true);
      setVerifyMessage(`please enter a name`);
    }
    if (res?.success) {
      setIsNotif(true);
      setVerifyMessage(`saved succesfully as ${filename}`);
      updateItems(true);
    } else {
      setIsNotif(true);
      setVerifyMessage(`error while saving ${filename}`);
    }
    setFilename(""); // Reset the filename input field
  };
  const handleFilenameSubmit3 = async () => {
    console.log("Filename submitted:", filename3);
    // Here you can handle the filename, e.g., save the file to the server
    setShowModal3(false); // Hide the modal
    let res;
    if (filename3 !== "") {
      res = await saveAspdf(filename3);
    } else {
      setIsNotif(true);
      setVerifyMessage(`please enter a name`);
    }
    if (res?.success) {
      setIsNotif(true);
      setVerifyMessage(`saved succesfully as ${filename3}`);
      updateItems(true);
    } else {
      setIsNotif(true);
      setVerifyMessage(`error while saving ${filename3}`);
    }
    setFilename3(""); // Reset the filename input field
  };
  const handleget = () => {
    console.log("done");
    setShowModal2(true); // Show the modal
  };
  const handleOptionSelect = async (option: any) => {
    //setSelectedOption(option);
    console.log("Selected option:", option);
    // Perform the action based on the selected option
    let res = await getFile(option);
    setShowModal2(false);
    if (!res?.success) {
      setIsNotif(true);
      setVerifyMessage(`error while importing ${filename}`);
    }
  };
  function handlecancel() {
    setShowModal(false);
    setFilename("");
  }
  function handlecancel2() {
    setShowModal2(false);
  }
  function handlecancel3() {
    setShowModal3(false);
  }
  function handlepdf() {
    setShowModal3(true);
  }
  let options = [
    { name: "option1", type: "Option 1", recieveDate: "" },
    { name: "option2", type: "Option 2", recieveDate: "" },
    // Add more options as needed
  ];
  options = collectedItems;
  useEffect(() => {
    const Fetch = async () => {
      const resp = await Import_editor("html");
      console.log(resp.data.imports);
      setCollectedItems(resp.data.imports);
    };
    Fetch();
  }, []);
  useEffect(() => {
    const Fetch = async () => {
      if (update) {
        const resp = await Import_editor("html");
        console.log(resp.data.imports);
        setCollectedItems(resp.data.imports);
      }
      updateItems(false);
    };
    Fetch();
  }, [update, collectedItems]);
  return (
    <div id="toolbar">
      {isNotif && (
        <Notify message={verifyMessage} dur={30} display={setIsNotif} />
      )}
      <span className="ql-formats">
        <select className="ql-font">
          <option value="arial">Arial</option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="lucida">Lucida</option>
          <option value="Roboto">Roboto</option>
        </select>
        <select className="ql-size" defaultValue="medium">
          <option value="extra-small">Size 1</option>
          <option value="small">Size 2</option>
          <option value="medium">Size 3</option>
          <option value="large">Size 4</option>
        </select>

        <select className="ql-header" defaultValue="3">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold"></button>

        <div id="container">
          <div id="menu-wrap">
            <input type="checkbox" className="toggler" />
            <div className="dots">
              <div></div>
            </div>
            <div className="menu">
              <div id="div-menu" className="div-menu">
                <ul>
                  <li>
                    <button className="ql-italic" />
                  </li>
                  <li>
                    <button className="ql-underline" />
                  </li>
                  <li>
                    <button className="ql-strike" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </span>

      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <div id="container">
          <div id="menu-wrap">
            <input type="checkbox" className="toggler" />
            <div className="dots">
              <div></div>
            </div>
            <div className="menu">
              <div id="div-menu" className="div-menu">
                <ul>
                  <li>
                    <button className="ql-list" value="bullet" />
                  </li>
                  <li>
                    <button className="ql-indent" value="-1" />
                  </li>
                  <li>
                    <button className="ql-indent" value="+1" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="super" />
        <div id="container">
          <div id="menu-wrap">
            <input type="checkbox" className="toggler" />
            <div className="dots">
              <div></div>
            </div>
            <div className="menu">
              <div id="div-menu" className="div-menu">
                <ul>
                  <li>
                    <button className="ql-script" value="sub" />
                  </li>
                  <li>
                    <button className="ql-blockquote" />
                  </li>
                  <li>
                    <button className="ql-direction" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
      </span>
      <span className="ql-formats">
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </span>

      <span className="ql-formats">
        <button className="ql-paraphrasebtn">
          <Customparphrase />
        </button>
        <button className="ql-summarizebtn">
          <Customsummarize />
        </button>
        <button className="ql-completebtn">C</button>
        <button className="ql-savebtn" onClick={handlepdf}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </span>
      <span>
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
        <div className="cont-save">
          <button className="ql-sav" onClick={handlesave}>
            S
          </button>
          {showModal && (
            <Savemodal role="saveModal">
                <div>
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Enter filename"
                  />
                  <div className="controls">
                    <button onClick={handleFilenameSubmit}>Save</button>
                    <button onClick={handlecancel}>Cancel</button>
                  </div>
                </div>{" "}
            </Savemodal>
          )}
        </div>
        <div className="cont-imp">
          <button className="ql-get" onClick={handleget}>
            G
          </button>
          {showModal2 && (
            <Savemodal role="importModal">
                <h1>Saved works</h1>
                <div className="items">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option.name)}
                    >
                      {option.name} <span>{parse_date(option.recieveDate)}</span>
                    </button>
                  ))}
                </div>
              <div className="controls">
                <button onClick={handlecancel2}>Cancel</button>
              </div>
            </Savemodal>
          )}
        </div>
      </span>

      {showModal3 && (
        <Savemodal>
          <section className="imp">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                value={filename3}
                onChange={(e) => setFilename3(e.target.value)}
                placeholder="Enter filename"
              />
              <button onClick={handleFilenameSubmit3}>Save</button>
              <button onClick={handlecancel3}>Cancel</button>
            </div>{" "}
          </section>
        </Savemodal>
      )}
      {/* <span id="math" className="ql-formats">
          <button onClick={handleqd}>  
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z" />
            </svg>
          </button>
          <EditableMathField
            className="MathField"
            latex={latex}
            onChange={(mathField) => {
              setLatex(mathField.latex())
            }}
          />
          <Select 
            id="select"
            className="ql-formula-select"
            options={options}
            onChange={handleChange}
            components={{
              Option: (props) => (
                <div {...props.innerProps}>
                  <StaticMathField>{props.data.value}</StaticMathField>
                  <div>{props.data.label}</div>
                </div>
              ),
            }}
          />
          <Select
            id="select"
            className="ql-formula-select"
            options={options2}
            onChange={handleChange}
            components={{
              Option: (props) => (
                <div {...props.innerProps}>
                  <StaticMathField>{props.data.value}</StaticMathField>
                  <div>{props.data.label}</div>
                </div>
              ),
            }}
          />
          <button className="ql-formula" onClick={handleq}/>
        </span> */}
    </div>
  );
};

export default QuillToolbar;
