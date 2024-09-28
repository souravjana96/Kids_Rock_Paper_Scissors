import { KeyboardBackspace } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const BackArrowButton = ({ customColor = "#000", handleBack }) => {
  return (
    <IconButton onClick={handleBack} sx={{ ml: 1, color: customColor }}>
      <KeyboardBackspace fontSize="large" color={customColor} />
    </IconButton>
  );
};

export default BackArrowButton;
