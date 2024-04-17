import { useState } from "react";
import { documentation } from "@/app/api/search_utils/literature_utils";
type Item = {
  title: string;
  authors: string;
  published: string;
  pdf_url: string;
};
// Define the prop types for the Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [references, setReferences] = useState<Item[]>([]);
  const [currentReference, setCurrentReference] = useState({
    title: "",
    authors: "",
    pdf_url: "",
    published: "",
  });
  const [result, setResult] = useState("");
  const [style, setStyle] = useState("apa");
  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentReference((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission if this is part of a form
    setReferences([...references, currentReference]);
    setCurrentReference({ title: "", authors: "", pdf_url: "", published: "" });
    const nonEmptyReferences = references.filter(
      (ref) =>
        ref.title.trim() !== "" ||
        ref.authors.trim() !== "" || // Check if authors array is not empty
        ref.pdf_url.trim() !== "" ||
        ref.published.trim() !== ""
    );
    // Create a new list of references with authors as arrays
    const referencesWithArrayAuthors = nonEmptyReferences.map((ref) => ({
      ...ref,
      authors: ref.authors.includes(",")
        ? ref.authors.split(",").map((author) => author.trim())
        : [ref.authors.trim()],
    }));

    const result = await documentation(referencesWithArrayAuthors, style);
    if (result.status === 201) {
      // Assuming you want to filter references based on the new criteria

      setResult(result.data);
    }
    setReferences([]); // Clear the references state
  };

  const handleSave = () => {
    setReferences([...references, currentReference]);
    setCurrentReference({ title: "", authors: "", pdf_url: "", published: "" });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Reference</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={currentReference.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="authors"
          placeholder="Author"
          value={currentReference.authors}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="pdf_url"
          placeholder="URL"
          value={currentReference.pdf_url}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="published"
          placeholder="Published"
          value={currentReference.published}
          onChange={handleInputChange}
          required
        />
        <select
          onChange={handleSelectedStyle}
          value={style}
          className="cite-lr"
        >
          <option value="" disabled selected>
            Citation Type
          </option>
          <option value="apa">APA</option>
          <option value="ieee">IEEE</option>
          <option value="mla">MLA</option>
          <option value="ama">AMA</option>
          <option value="asa">ASA</option>
          <option value="aaa">AAA</option>
          <option value="apsa">APSA</option>
          <option value="mhra">MHRA</option>
          <option value="oscola">OSCOLA</option>
        </select>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <textarea value={result} readOnly />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
