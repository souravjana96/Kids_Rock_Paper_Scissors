import { KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Typewriter from "typewriter-effect";

const Intro = ({ projectName, handleOpenProject }) => {
  const [showInstructions, setShowInstructions] = useState([]);
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "#00f",
        backgroundImage: "linear-gradient(to top, #50cc7f 0%, #f5d100 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100px",
            aspectRatio: "1/1",
            mx: "auto",
            overflow: "hidden",
            marginTop: 5,
          }}
        >
          <Image
            src={
              "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/Images%2Fvizuara_logo.png?alt=media&token=cc9671f4-a02d-49ca-a7c7-0df23a92ba30"
            }
            alt={"Animated RPC"}
            fill={true}
            loading="lazy"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{
            padding: "0px 30px",
            color: "#004d4d",
            fontWeight: "bold !important",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
            textTransform: "uppercase",
          }}
        >
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString(`IB PYP AI Literacy Programme`)
                .callFunction(() => {
                  setShowInstructions((prev) => [...prev, 1]);
                })
                .start();
            }}
            options={{
              cursor: "",
            }}
          />
        </Typography>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            padding: "0px 30px",
            width: '100%',
            color: "#000",
            fontWeight: "bold !important",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",

            display: "flex",
            justifyContent: 'center',
            gap: 1,

          }}
        >
          {showInstructions.includes(1) && (
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(`Activity - `)
                  .callFunction(() => {
                    setShowInstructions((prev) => [...prev, 2]);
                  })
                  .start();
              }}
              options={{
                cursor: "",
              }}
            />
          )}

          <span style={{ color: "#f34c89", textTransform: "uppercase", display: 'inline-block' }}>
            {showInstructions.includes(2) && (
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(`${projectName || ""}`)
                    .callFunction(() => {})
                    .start();
                }}
                options={{
                  cursor: "",
                }}
              />
            )}
          </span>
        </Typography>
        <Button
          onClick={handleOpenProject}
          sx={{
            marginTop: "100px",
            color: "#fff",
            background: "#2a78fe",
            fontWeight: "bold",
            textTransform: "none",
            letterSpacing: "1px",
            borderRadius: "20px",
            border: "2px solid #fff",
            boxShadow: "1px 1px 10px #000",
            px: 5,
            py: 2,
            // my: 5,
            fontSize: "20px",
            transition: "background 0.2s, transform 0.2s",

            cursor: "pointer",

            "&:hover": {
              background: "#fff",
              color: "#f34c89",
              transform: "scale(1.05)",
              boxShadow: "1px 1px 10px #000",
            },
          }}
        >
          Open <KeyboardArrowRight />
        </Button>
      </Box>
    </Box>
  );
};

export default Intro;
