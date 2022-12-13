import { Zoom } from "@mui/material";
import { BsCheck2Circle } from "react-icons/bs";
import { useEffect, useState } from "react";
import style from "./AlertSuccess.module.css";

const AlertSuccess = ({
  content,
  setIsSending,
}: {
  content: string;
  setIsSending: () => void;
}) => {
  const [mount, setMount] = useState<boolean>(true);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    let timer = setTimeout(() => {
      setMount(false);
      document.body.style.overflow = "auto";
      setIsSending();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <div className={style.container}>
        <Zoom in={mount}>
          <div className={style.popUp}>
            <div>
              <p style={{ fontSize: 24 }}>{content}</p>
              <BsCheck2Circle fontSize={40} color="green" />
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
};

export default AlertSuccess;
