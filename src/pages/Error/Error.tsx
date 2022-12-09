import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const preTitle = document.title;
    document.title = "Page not found";

    return () => {
      document.title = preTitle;
    };
  }, []);

  return (
    <div style={{ height: "80vh" }}>
      <div style={{ textAlign: "center", paddingTop: "10rem" }}>
        <h1 style={{ fontSize: "5rem" }}>
          <span style={{ color: "var(--primary-color)" }}>4</span>04
        </h1>
        <h3>Sorry, page not found. </h3>
        <span>
          The link you followed may be broken or the page may have been removed.
        </span>
        <div className="mt-3">
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
