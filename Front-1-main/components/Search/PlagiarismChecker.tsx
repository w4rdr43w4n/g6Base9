import { FC, useEffect, useState } from "react";
import { plagiarism } from "@/app/api/search_utils/literature_utils";

const PlagiarismChecker: FC = () => {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [checking, setCheckingState] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState("check");
  const handleCheckButton = () => {
    setCheckingState(true);
  };
  const handlePlgTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setOutput("");
  };
  useEffect(() => {
    try {
      if (checking) {
        if (text.length === 0) {
          setOutput("Enter some text please");
        } else {
          setButtonText("checking..");
          const button: any = document.querySelector(".plg-check-button");
          button.disabled = true;
          const plgFetch = async () => {
            const response = await plagiarism(text);
            setOutput(response?.data.message);
            setButtonText("check");
            button.disabled = false;
          };
          plgFetch();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(error.message);
      } else {
        setOutput("An unknown error occurred");
      }
    } finally {
      setCheckingState(false);
    }
  }, [text, checking, output]);

  return (
    <>
      <h1>Plagiarism Check</h1>
      <textarea
        value={text}
        onChange={handlePlgTextChange}
        className="plg-check-textarea"
        placeholder="Insert some text to check for plagiarism content"
      ></textarea>
      <button className="plg-check-button" onClick={handleCheckButton}>
        {buttonText}
      </button>
      <p>{output}</p>
    </>
  );
};

export default PlagiarismChecker;
