import { Button } from "@mui/material";
import React from "react";

const CommonButton = ({text, customStyle, handleClick}) => {
  return (
    <Button
      variant="contained"
      sx={{
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        letterSpacing: "2px",
        borderRadius: "20px",
        border: "2px solid #239b56",
        boxShadow: "1px 1px 10px #000",
        px: 5,
        py: 1,
        fontSize: "20px",
        transition: "background 0.2s, transform 0.2s",
        background: "#239b56",
        cursor: "pointer",

        "&:hover": {
          background: "#fff",
          color: "#f34c89",
          transform: "scale(1.05)",
          boxShadow: "1px 1px 10px #000",
        },
        ...customStyle
      }}
      onClick={handleClick}
    >
      Play Again
    </Button>
  );
};

export default CommonButton;
