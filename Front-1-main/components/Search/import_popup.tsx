import { FC, useState, useEffect } from "react";
import "../styles/srch_components.css";
import { Import } from "@/app/api/search_utils/literature_utils";

interface props {
  onExit: (e: boolean) => void;
  onSend: (e: string) => void;
  onSetTitle: (e: string) => void;
  setProjectName: (e: string) => void;
  hasImported: (e: boolean) => void;
  type: string;
}

const ImportPopup: FC<props> = ({
  onExit,
  onSend,
  onSetTitle,
  hasImported,
  setProjectName,
  type,
}) => {
  const [collectedItems, setCollectedItems] = useState<any>([]);
  function handleExitBtn(e: any) {
    onExit(false);
  }
  useEffect(() => {
    const Fetch = async () => {
      const resp = await Import(type);
      console.log(resp.data.imports);
      setCollectedItems(resp.data.imports);
    };
    Fetch();
  }, [type]);
  function handleSelect(project: string) {
    const selected: any = collectedItems.filter(
      (item: any) => item.project === project
    );
    onSetTitle(selected[0].title);
    onSend(selected[0].content);
    setProjectName(selected[0].project);
    hasImported(true);
    onExit(false);
  }
  function handleSelectRef(project: string) {
    const selected: any = collectedItems.filter(
      (item: any) => item.project === project
    );
    onSend(selected[0].list);
    hasImported(true);
    setProjectName(selected[0].project);
    onExit(false);
  }
  return (
    <section className="custom-lr">
      <section className="imp">
        <h1>Saved works</h1>
        <div>
          {collectedItems.map((e: any, i: number) => (
            <>
              {e.project && e.content ? (
                <button onClick={() => handleSelect(e.project)} key={i}>
                  <>
                    <p>{e.project}</p>{" "}
                    <p className="content">Content:{e.content || e.list}</p>{" "}
                  </>
                </button>
              ) : (
                <button onClick={() => handleSelectRef(e.project)} key={i}>
                  <p>{e.project}</p> <p className="content">{e.list}</p>
                </button>
              )}
            </>
          ))}
        </div>
        <button onClick={handleExitBtn} className="exit-lr-btn">
          EXIT
        </button>
      </section>
    </section>
  );
};

export default ImportPopup;
