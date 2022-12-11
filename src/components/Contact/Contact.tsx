import { Tooltip, Zoom } from "@mui/material";
import { useState } from "react";
import { BsMessenger } from "react-icons/bs";
import { HiChevronDoubleUp, HiLocationMarker, HiMail } from "react-icons/hi";
import style from "./Contact.module.css";

const Contact = () => {
  const [visible, setVisible] = useState<boolean>(false);

  window.onscroll = () => {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div style={{ zIndex: 95, position: "relative" }}>
      <Tooltip
        title="Chat with us via Facebook"
        placement="left"
        TransitionComponent={Zoom}
        arrow
      >
        <span id={style.mess}>
          <BsMessenger fontSize={26} color="fff" />
        </span>
      </Tooltip>
      <Tooltip
        title="bookabook@gmail.com"
        placement="left"
        TransitionComponent={Zoom}
        arrow
      >
        <span id={style.mail}>
          <HiMail fontSize={26} color="fff" />
        </span>
      </Tooltip>
      <Tooltip
        title="View location"
        placement="left"
        TransitionComponent={Zoom}
        arrow
      >
        <span id={style.locate}>
          <HiLocationMarker fontSize={26} color="fff" />
        </span>
      </Tooltip>
      <span
        id={style.backToTop}
        onClick={scroll}
        style={{ display: visible ? "block" : "none" }}
      >
        <HiChevronDoubleUp fontSize={26} color="fff" />
      </span>
    </div>
  );
};

export default Contact;
