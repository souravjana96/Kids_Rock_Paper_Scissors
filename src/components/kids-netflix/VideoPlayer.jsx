import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Swal from "sweetalert2";

const VideoPlayer = ({
  url,
  index,
  hoveredElement,
  keyCode,
  genre,
  gamePlay,
  gameRound,
  handleSubmitGameResult,
}) => {
  const wrongAudioRef = useRef(null);
  const successAudioRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  useEffect(() => {
    if (hoveredElement === index) {
      if (keyCode === 4) {
        if (!isVideoPlaying) {
          if (gamePlay[gameRound]?.genre === genre) {
            successAudioRef?.current?.play();
            Swal.fire({
              icon: "success",
              title: "Correct",
              text: "Played the right movie",
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Wrong",
              text: "You have played wrong",
              timer: 1500,
            });
            wrongAudioRef?.current?.play();
          }

          handleSubmitGameResult(gamePlay[gameRound]?.genre === genre);
          console.log("Resture comp called", gamePlay[gameRound]?.genre, genre);
        }
        setIsVideoPlaying((prev) => !prev);
      }
    } else {
      setIsVideoPlaying(false);
    }
    // setIsVideoPlaying(hoveredElement === index);
  }, [hoveredElement, keyCode]);

  return (
    <Box
      component="div"
      data-key={index}
      sx={{
        width: "100%",
        aspectRatio: "16/9",
        overflow: "hidden",
        border: "1px solid #515A5A",
        backgroundColor: "black",
        borderRadius: { xs: "5px", md: "14px" },
        boxShadow: "-6px 4px 9px 0px #515A5A",
        transition: "transform 300ms ease-in-out",
        transform: hoveredElement === index ? "scale(1.25)" : "scale(1)",
        zIndex: hoveredElement === index ? 10 : 1,
        "&:hover": {
          transform: hoveredElement === index ? "scale(1.25)" : "scale(1)",
        },
      }}
    >
      <ReactPlayer
        url={url}
        height="100%"
        width="100%"
        controls={false}
        playing={isVideoPlaying}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />
      
      <audio ref={wrongAudioRef} src="/music/wrong_answer.mp3" />
      <audio ref={successAudioRef} src="/music/success.mp3" />
    </Box>
  );
};

export default VideoPlayer;
