import { FC, useState, useEffect } from "react";
import {
  article,
  outline,
  save,
  updateImport,
} from "@/app/api/search_utils/literature_utils";
import "../styles/srch_components.css";
import Savemodal from "./savemodal";
import Notify from "../Management/notification";

interface props {
  query: string;
  value: string;
  hasImportedArt: boolean;
  hasImportedOut: boolean;
  projectName: string;
  setHasImport: (e: boolean) => void;
  isImport: (e: boolean) => void;
  importType: (e: string) => void;
  setOutput: (e: string) => void;
}

const Article: FC<props> = ({
  query,
  value,
  isImport,
  importType,
  setOutput,
  setHasImport,
  projectName,
  hasImportedArt = false,
  hasImportedOut = false,
}) => {
  const [generating, setGenerateState] = useState<boolean>(false);
  const [statusText1, setStatus1] = useState("Generate");
  const [statusText2, setStatus2] = useState("Generate Outline");
  const [saveText, setSave] = useState("save");
  const [saveText2, setSave2] = useState("save");

  //const [statusText4, setStatus4] = useState("Save Outline");
  const [saving, setSaveState] = useState<boolean>(false);
  const [saving2, setSaveState2] = useState<boolean>(false);

  const [content, setcontent] = useState<boolean>(false);
  const [outTriggr, setOutTrigger] = useState(false);
  const [outlinee, setGenerateoutline] = useState<boolean>(false);
  const [outline_o, setOut] = useState("null");
  const [articlee, setart] = useState("");
  const [isarxiv, setIsarxiv] = useState<boolean>(false);
  const [refs, setRefs] = useState([]);
  const [saveM, setSaveM] = useState<boolean>(false);
  const [saveName, setSaveName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errMsg2, setErrMsg2] = useState("");
  const [saveM2, setSaveM2] = useState(false);
  const [isNotif, setIsNotif] = useState(false);
  const [type, settype] = useState('');
  const [verifyMessage, setVerifyMessage] = useState("");
  const handleGenerateButton = () => {
    setOutput("");
    setGenerateState(true);
  };
  const handleGenerateoutlie = () => {
    setOutput("");
    setGenerateoutline(true);
  };
  const handleSaveButton = () => {
    //setart(value);
    setSaveState(true);
  };

  const handleUpdateButton = async () => {
    const resp = await updateImport(projectName, articlee, "art");
    console.log(projectName)
    console.log(resp);
    if (resp.data.message === "updated") {
      setIsNotif(true);
      setVerifyMessage(`${projectName} updated successfully`);
    } else {
      setIsNotif(true);
      setVerifyMessage(`error while updating ${projectName},it is outline not article`);
    }
    setHasImport(false);
   // setart("");
  };
  const handleUpdateButton2 = async () => {
    const resp = await updateImport(projectName, outline_o, "out");
    if (resp.data.message === "updated") {
      setIsNotif(true);
      setVerifyMessage(`${projectName} updated successfully`);
    } else {
      setIsNotif(true);
      setVerifyMessage(`error while updating ${projectName},it is article not outline`);
    }
    console.log(resp.data);
    setHasImport(false);
    //setOut("");
  };
  const handleRefreshButton = () => {
    setOut("null");
    setart("");
    setOutput("");
    setSaveState(false);
    setcontent(false);
    setGenerateState(false);
    setOutTrigger(false);
    setRefs([]);
    setIsarxiv(false);
    setStatus1("Generate");
    setStatus2("Generate Outline");
    setSave("save");
    setHasImport(false);
  };
  const handleEditorChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    const value = event.target.textContent || "";
    if (hasImportedArt) {
      setart(value);
    } else if (hasImportedOut) {
      setOut(value);
    }

    if (outTriggr && content) {
      if (articlee != "") {
        setart(value);
      } else {
        setOut(value);
      }
      setcontent(true);
    }
  };
  function handleImportButton(t: string) {
    importType(t);
    settype(t);
    isImport(true);
    setOutTrigger(true);
    setcontent(true);
  }
  function handleSaveButton2() {
    setSaveState2(true);
  }
  useEffect(() => {
    console.log('value is'+value)
    console.log('outline is'+outline_o)
    console.log('article is'+articlee)
    console.log('savename is'+saveName)
    console.log('query is'+query)
    },[articlee, outline_o, query, saveName, value])
    useEffect(() => {
    if(value && type === 'art') {
      setart(value);
    } else if (value && type === 'out') {setOut(value);}
      },[type, value])
  useEffect(() => {
    try {
      if (generating) {
        const fetchLR = async () => {
          if (query.length === 0) {
            setOutput("Please write a topic in search bar of search tools!");
            settype('');
            setcontent(false);
          } else {
            setStatus1("Generating...");
            setOutput(`Writing an article about the topic ${query} ...`);
            settype('');
            setcontent(false);
            const button: any = document.querySelector(".art-btn");
            button.disabled = true;
            try {
              const response = await article(query, refs, outline_o, isarxiv);
              setOutput(response.data);
              setcontent(true);
              //setOut('');
              setart(response.data);
              settype('art')
              setOutTrigger(true);
            } catch (err) {
              setIsNotif(true)
              setVerifyMessage("try again")
              settype('');
              setcontent(false);
              setGenerateState(false);
            }
            button.disabled = false;
            setStatus1("Generate");
            //setOut("");
            setIsarxiv(false);
          }
        };
        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true)
        setVerifyMessage("try again")
        setcontent(false);
      } else {
        setIsNotif(true)
        setVerifyMessage("try again")
        setcontent(false);
      }
    } finally {
      setGenerateState(false);
    }
  }, [generating, query, refs, outline_o, isarxiv, value, setOutput]);
  useEffect(() => {
    try {
      if (outlinee) {
        const fetchLR = async () => {
          if (query.length === 0) {
            setOutput("Please write a topic in Search bar of search tools!")
            settype('')
            setcontent(false);
          } else {
            const button: any = document.querySelector(".out-btn");
            button.disabled = true;
            setStatus2("Generating...");
            setOutput(`Creating an outline for the topic ${query} ...`);
            settype('')
            setcontent(false);

            try {
              const response = await outline(query);
              //setOutput(response.data);
              setOutput(response.data.outline);
              setcontent(true);
              setOut(response.data.outline);
              settype('out')
              setart("");
              setRefs(response.data.refs);
              setIsarxiv(response.data.arxiv);
              setOutTrigger(true);
            } catch (err) {
              setIsNotif(true)
              setVerifyMessage("try again")
              setcontent(false);
              setGenerateState(false);
            }
            setStatus2("Generate Outline");
            button.disabled = false;
          }
        };
        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true)
        setVerifyMessage("try again")
        setcontent(false);
      } else {
        setIsNotif(true)
        setVerifyMessage("try again")
        setcontent(false);
      }
    } finally {
      setGenerateoutline(false);
    }
  }, [outlinee, query, refs, isarxiv, setOutput]);
  useEffect(() => {
    try {
      if (saving) {
        console.log(content);
        const fetchSR = async () => {
          if (!content) {
            setOutput("Please generate some work before saving");
            settype('')
            setcontent(false);
          } else {
            const button: any = document.querySelector(".save-btn");
            button.disabled = true;
            setSave("saving...");
            //setOutput(`Writing a literature review about the topic ${query} ...`);
            try {
              console.log(outline_o);
              if (articlee != "") {
                console.log("pro:" + projectName);
                console.log(outline_o)
                const response = await save(
                  saveName,
                  "ar",
                  query,
                  articlee,
                  "ieee",
                  outline_o
                );
                if (response.data.error) {
                  setErrMsg(response.data.error);
                  setIsNotif(true);
                  setVerifyMessage(`Error while saving ${saveName}`);
                } else {
                  setErrMsg("");
                  setIsNotif(true);
                  setVerifyMessage(`${saveName} saved successfully`);
                }
              } else {
                setIsNotif(true);
                setVerifyMessage(`Provide an Article before saving`);
                setSave("Provide an Article before saving");
              }
              //setOutput('');
            } catch (err) {
              setIsNotif(true);
                setVerifyMessage(`try again later`);
              setcontent(false);
              setSaveState(false);
            }
            setSave("save");
            button.disabled = false;
            setSaveM(false);
            //setcontent(false);
          }
        };

        fetchSR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true);
        setVerifyMessage(`error occured,try again`);
        setcontent(false);
      } else {
        setIsNotif(true);
        setVerifyMessage(`error occured,try agin`);
        setcontent(false);
      }
    } finally {
      setSaveState(false);
    }
  }, [
    saving,
    value,
    query,
    content,
    setOutput,
    outline_o,
    articlee,
    projectName,
    saveName,
  ]);
  useEffect(() => {
    try {
      if (saving2) {
        console.log(content);
        const fetchSR = async () => {
          if (!content) {
            setIsNotif(true);
            setVerifyMessage("Please generate some work before saving");
            setcontent(false);
          } else {
            const button: any = document.querySelector(".save-btn");
            button.disabled = true;
            setSave2("saving...");
            //setOutput(`Writing a literature review about the topic ${query} ...`);
            try {
              console.log(outline_o);
              if (outline_o != "") {
                console.log("pro:" + projectName);
                const response = await save(
                  saveName,
                  "out",
                  query,
                  outline_o,
                  "null",
                  "null"
                );
                if (response.data.error) {
                  setErrMsg(response.data.error);
                  setIsNotif(true);
                  setVerifyMessage("Try again later");
                } else {
                  setErrMsg("");
                  setIsNotif(true);
                  setVerifyMessage(`${saveName} saved successfully`);
                }
              } else {
                setIsNotif(true);
                setVerifyMessage("Provide an outline before saving");
                setSave2("Provide an outline before saving");
              }
              //setOutput('');
            } catch (err) {
              setIsNotif(true);
              setVerifyMessage("try again later");
              setcontent(false);
              setSaveState2(false);
            }
            setSave2("save");
            button.disabled = false;
            setSaveM2(false);
            //setcontent(false);
          }
        };

        fetchSR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true);
        setVerifyMessage("error occured");
        setcontent(false);
      } else {
        setIsNotif(true);
        setVerifyMessage("error occured");
        setcontent(false);
      }
    } finally {
      setSaveState2(false);
    }
  }, [
    saving2,
    value,
    query,
    content,
    setOutput,
    outline_o,
    articlee,
    projectName,
    saveName,
  ]);
  return (
    <>
      <h1>Article</h1>
      {isNotif && (
        <Notify message={verifyMessage} dur={30} display={setIsNotif} />
      )}
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
          <button className="save-btn" onClick={handleSaveButton}>
            {saveText}
          </button>
        </Savemodal>
      )}
      {saveM2 && (
        <Savemodal onClose={() => setSaveM2(false)}>
          <p className="err-lr-save">{errMsg}</p>
          <label htmlFor="name">Save as:</label>
          <input
            name="name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            required
          />
          <button className="save-btn" onClick={handleSaveButton2}>
            {saveText2}
          </button>
        </Savemodal>
      )}
      <section>
        <button className="rf-btn" onClick={handleRefreshButton}>
          Refresh
        </button>
        <button className="art-btn" onClick={handleGenerateButton}>
          {statusText1}
        </button>
        <button className="out-btn" onClick={handleGenerateoutlie}>
          {statusText2}
        </button>
        {hasImportedArt ? (
          <button className="save-art" onClick={handleUpdateButton}>
            Update Article
          </button>
        ) : (
          <button className="save-art" onClick={() => setSaveM(true)}>
            Save article as
          </button>
        )}
        {hasImportedOut ? (
          <button className="save-out" onClick={handleUpdateButton2}>
            Update Outline
          </button>
        ) : (
          <button className="save-out" onClick={() => setSaveM2(true)}>
            Save outline as
          </button>
        )}
        <button onClick={() => handleImportButton("art")}>
          Import Article
        </button>
        <button onClick={() => handleImportButton("out")}>
          Import Outline
        </button>
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

export default Article;
