import { Button } from "@mui/material";
import React from "react";

const PreviousButton = ({ ...props }) => {
  return (
    <Button
      sx={{
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        letterSpacing: "1px",
        borderRadius: "50px",
        px: 2,
        transition: "background 0.3s, transform 0.2s",
        background: "linear-gradient(to right, #aa53f1, #d9297c)",
        "&:hover": {
          background: "linear-gradient(to right,#d9297c, #aa53f1)",
          transform: "scale(1.05)",
        },
      }}
      {...props}
    >
      Previous
    </Button>
  );
};

export default PreviousButton;
