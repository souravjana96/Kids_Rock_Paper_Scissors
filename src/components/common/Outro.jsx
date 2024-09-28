import { Box, List, Typography } from "@mui/material";
import React from "react";
import BackArrowButton from "../buttons/BackArrowButton";

const Outro = ({ content, goToPreviousPage }) => {
  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
      }}
    >
      <Box>
        <BackArrowButton customColor="#000" handleBack={goToPreviousPage} />
      </Box>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          padding: "0px 30px",
          color: "#ac00ff",
          fontWeight: "bold !important",
          textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        What We Learned ?
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContext: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 4,
          gap: 3,
          m: "auto",
          minHeight: "300px",
          minWidth: "300px",
          maxWidth: "800px",
          boxShadow: "1px 1px 20px #d5d5d5",
          borderRadius: "20px",
        }}
      >
        {content?.map((text, i) => {
          return (
            <Typography variant="h4" key={i} sx={{}}>
              {" "}
              {text}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

export default Outro;
