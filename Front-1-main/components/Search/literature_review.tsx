import { FC, useState, useEffect } from "react";
import {
  searchAndProcess,
  save,
  updateImport,
} from "@/app/api/search_utils/literature_utils";
import "../styles/srch_components.css";
import Savemodal from "./savemodal";
import Notify from "../Management/notification";
interface props {
  query: string;
  value: string;
  hasImported: boolean;
  projectName: string;
  setHasImport: (e: boolean) => void;
  isImport: (e: boolean) => void;
  importType: (e: string) => void;
  setOutput: (e: string) => void;
}

const LiteratureReview: FC<props> = ({
  query,
  value,
  setOutput,
  isImport,
  importType,
  setHasImport,
  projectName,
  hasImported = false,
}) => {
  const [liter, setliter] = useState("");
  const [style, setStyle] = useState("apa");
  const [generating, setGenerateState] = useState<boolean>(false);
  const [saving, setSaveState] = useState<boolean>(false);
  const [content, setcontent] = useState<boolean>(false);
  const [outTriggr, setOutTrigger] = useState(false);
  const [statusText, setStatus] = useState("Generate");
  const [saveText, setSave] = useState("save");
  const [saveM, setSaveM] = useState<boolean>(false);
  const [saveName, setSaveName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isNotif, setIsNotif] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const handleGenerateButton = () => {
    setOutput("");
    setcontent(false);
    setGenerateState(true);
  };
  const handleSaveButton = () => {
    setliter(value);
    setSaveState(true);
  };

  const handleUpdateButton = async () => {
    const resp = await updateImport(projectName, liter, "lr");
    if (resp.data.message ==='updated') {
    setIsNotif(true);
    setVerifyMessage(`${projectName} updated successfuly`)}
    else {  setIsNotif(true);
      setVerifyMessage(`error while updating ${projectName}`)}

    console.log(resp);
  };
  function handleImportButton(t: string) {
    importType(t);
    isImport(true);
    setOutTrigger(true);
    setcontent(true);
  }
  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleEditorChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    console.log(`query:${query}`);
    const value = event.target.textContent || " ";
    setliter(value);
    if (outTriggr && content) {
      if (liter != "") {
        setliter(value);
      }
      setcontent(true);
    }
  };
  useEffect(() => {
    try {
      if (generating) {
        const fetchLR = async () => {
          if (query.length === 0) {
            setOutput("Please write a topic in Search bar of search tools!");
            setcontent(false);
          } else {
            const button: any = document.querySelector(".gener-lr");
            button.disabled = true;

            setStatus("Generating...");
            setOutput(
              `Writing a literature review about the topic ${query} ...`
            );
            setcontent(false);
            try {
              const response = await searchAndProcess(query, style);
              setOutput(response.data);
              setliter(response.data);
              setOutTrigger(true);
              setcontent(true);
            } catch (err) {
              setOutput(
                "We're facing some traffic problems, please try again later"
              );
              setGenerateState(false);
              setcontent(false);
            }
            setHasImport(false);
            setStatus("Generate");
            button.disabled = false;
            //setcontent(false);
          }
        };

        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput(error.message);
        setcontent(false);
      } else {
        setOutput("An unknown error occurred");
        setcontent(false);
      }
    } finally {
      setGenerateState(false);
    }
  }, [generating, value, query, style, setOutput, setHasImport]);
  useEffect(() => {
    try {
      if (saving) {
        const fetchSR = async () => {
          if (!content) {
            setIsNotif(true);
            setVerifyMessage(`please generate som work before saving`);
            setcontent(false);
          } else {
            const button: any = document.querySelector(".save-lr");
            button.disabled = true;
            setSave("saving...");
            //setOutput(`Writing a literature review about the topic ${query} ...`);
            try {
              //console.log(value);
              console.log(style);
              console.log(`lr to send:\n ${liter}`);
              console.log(`query:${query}`);
              const response = await save(
                saveName,
                "lr",
                query,
                liter,
                style,
                "null"
              );
              console.log(response.data);
              if (response.data.error) {
                setErrMsg(response.data.error);
                setIsNotif(true);
                setVerifyMessage(response.data.error);
              } else {
                setErrMsg("");
                setIsNotif(true);
                setVerifyMessage(`saved successfully as ${saveName}`);
              }
              //setOutput('');
            } catch (err) {
              setIsNotif(true);
              setVerifyMessage(`failed try again later`);
              setcontent(false);
              setSaveState(false);
            }
            setSave("Save");
            setSaveM(false);
            button.disabled = false;
          }
        };

        fetchSR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true);
        setVerifyMessage(error.message);
        setcontent(false);
      } else {
        setIsNotif(true);
        setVerifyMessage(`error occured`);
        setcontent(false);
      }
    } finally {
      setSaveState(false);
    }
  }, [saving, value, query, style, content, setOutput, liter, saveName]);
  return (
    <>
      <h1>Literature Review</h1>
      {isNotif && <Notify message={verifyMessage} dur={30} display={setIsNotif} />}
      {saveM && (
        <Savemodal onClose={() => setSaveM(false)}>
          <p className="err-lr-save">{errMsg}</p>
          <label htmlFor="name">Save as:</label>
          <input
            name="name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            required
          />
          <button className="save-lr" onClick={handleSaveButton}>
            {saveText}
          </button>
        </Savemodal>
      )}
      <section>
        <select
          onChange={handleSelectedStyle}
          value={style}
          className="cite-lr"
        >
          <option value="" disabled>
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
        <button className="gener-lr" onClick={handleGenerateButton}>
          {statusText}
        </button>
        {hasImported ? (
          <button className="save-lr" onClick={handleUpdateButton}>
            update
          </button>
        ) : (
          <button className="save-lr" onClick={() => setSaveM(true)}>
            Save as
          </button>
        )}

        <button onClick={() => handleImportButton("lr")}>Import</button>
      </section>
      <div
        className="output-lr"
        onInput={handleEditorChange}
        contentEditable="true"
        suppressContentEditableWarning
      >
        {value}
      </div>
    </>
  );
};

export default LiteratureReview;
