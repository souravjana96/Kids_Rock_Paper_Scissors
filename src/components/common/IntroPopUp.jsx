import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import FramerMotionAnimatedContainer from "./FramerMotionAnimatedContainer";

const IntroPopUp = ({ content = "" }) => {
  const handlePopupCome = () => {
    Swal.fire({
      title: content,
      confirmButtonText: "Close",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
    });
  };

  useEffect(() => {
    handlePopupCome();
  }, []);
  return (
    <FramerMotionAnimatedContainer>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handlePopupCome}
          sx={{
            background: "#fff",
            color: "#f34c89",

            fontWeight: "bold",
            textTransform: "none",
            letterSpacing: "1px",
            borderRadius: "20px",
            border: "2px solid #f34c89",
            boxShadow: "1px 1px 10px #f34c89",
            px: 5,
            py: 1,
            my: 1,
            fontSize: "20px",
            transition: "background 0.2s, transform 0.2s",
            cursor: "pointer",

            "&:hover": {
              background: "#f34c89",
              color: "white",
              transform: "scale(1.05)",
              boxShadow: "1px 1px 10px #000",
            },
          }}
        >
          See Project Objectives
        </Button>
      </Box>
    </FramerMotionAnimatedContainer>
  );
};

export default IntroPopUp;
