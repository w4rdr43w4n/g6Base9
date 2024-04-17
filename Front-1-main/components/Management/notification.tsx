"use client";

import axios from "axios";
import "../styles/mgmt_components.css";
import { FC, useState } from "react";

interface url {
  name: string;
  link: string;
  data: Object;
}

interface props {
  message: string;
  dur: number;
  actionUrls?: url[];
  display: (state: boolean) => void;
}

const Notify: FC<props> = ({ message, dur, display, actionUrls = [] }) => {
  const [notifMessage, setMessage] = useState(message);
  setTimeout(() => display(false), dur * 1000);
  function handleClose() {
    display(false);
  }
  async function handleUrlBtn(link: string, data: any) {
    const resp = await axios.post(link, { email:data.email });
    if (resp.status === 200) {
      setMessage(
        "We have reset your token and send another verification email to you"
      );
    } else {
      setMessage("Something went wrong, try refereshing the page");
    }
  }

  return (
    <div className="notification">
      <div>
        <p>{notifMessage}</p>
        {actionUrls && (
          <div>
            {actionUrls.map((e, i) => (
              <button key={i} onClick={() => handleUrlBtn(e.link, e.data)}>
                {e.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleClose}>x</button>
    </div>
  );
};

export default Notify;
