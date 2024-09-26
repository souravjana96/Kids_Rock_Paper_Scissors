import { Button } from "@mui/material";
import React from "react";

const NextButton = ({ isDisabled = false, ...props }) => {
  return (
    <Button
      disabled={isDisabled}
      sx={{
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        letterSpacing: "1px",
        borderRadius: "50px",
        px: 2,
        transition: "background 0.3s, transform 0.2s",
        background: !isDisabled
          ? "linear-gradient(to right, #5170FF, #FF66C4)"
          : "#B2BABB",
        cursor: isDisabled ? "not-allowed" : "pointer",

        "&:hover": {
          background: "linear-gradient(to right,#d9297c, #aa53f1)",
          transform: "scale(1.05)",
        },
      }}
      {...props}
    >
      Next
    </Button>
  );
};

export default NextButton;
