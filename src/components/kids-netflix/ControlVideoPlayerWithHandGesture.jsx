import React, { useEffect, useRef, useState } from "react";
// import VideoPlayer from "./VideoPlayer";
import { GiArrowCursor } from "react-icons/gi";
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ReactPlayer from "react-player";
import { TvIcon } from "./SVG";
import Image from "next/image";
import Swal from "sweetalert2";

const VideoPlayer = ({
  keyCode,
  position,
  url,
  index,
  title,
  handleCompleted,
  completedVideos,
}) => {
  const [playedPercentage, setPlayedPercentage] = useState(0);

  const handleProgress = (state) => {
    setPlayedPercentage(Math.floor(state.played * 100)); // Calculate the percentage played
  };

  const handleEnded = () => {
    handleCompleted(title);
  };
  // completedVideos?.title

  return (
    <Box sx={{ width: "30%" }}>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TvIcon width={"100%"} />
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            border: "1px solid #515A5A",
            backgroundColor: "black",
            transition: "transform 300ms ease-in-out",
            // zIndex: keyCode == position ? 1 : 1,
            position: "absolute",
            top: "8%",
          }}
        >
          <ReactPlayer
            url={url}
            height="100%"
            width="100%"
            controls={false}
            playing={keyCode === position && !completedVideos?.[title]}
            onProgress={handleProgress}
            onEnded={handleEnded}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
          />
        </Box>
        <Box
          sx={{
            height: "2%",
            width: "2%",
            borderRadius: "50%",
            background: keyCode == position ? "#f00" : "#000",
            position: "absolute",
            bottom: "31%",
            boxShadow: keyCode == position ? "0px 0px 0px #f00" : "none",
            animation: keyCode == position ? "pulse 1.5s infinite" : "none",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0px 0px 0px #f00",
              },
              "50%": {
                boxShadow: "0px 0px 20px #f00",
              },
              "100%": {
                boxShadow: "0px 0px 0px #f00",
              },
            },
          }}
        ></Box>
      </Box>
      <Box>
        <Typography variant="h5" color="#fff">
          {playedPercentage}%
        </Typography>
        <Box
          bgcolor="#CBD5E0"
          sx={{
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <Box
            bgcolor="#41ab5c"
            color="white"
            textAlign="center"
            padding={"7px"}
            sx={{
              width: `${playedPercentage}%`,
              borderRadius: "10px",
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
};

const ControlVideoPlayerWithHandGesture = ({
  keyCode,
  paused,
  setPaused,
  setIsGameCompleted,
}) => {
  const videoSRC = [
    {
      url: "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBaby%20Tiger%20Friend_%20%F0%9F%90%AFMighty%20Little_clipped%20Bheem%20_%20Netflix%20Jr.mp4?alt=media&token=4e00759f-627f-427c-b5a7-3e35b56527b1",

      title: "left",
      position: 0,
    },

    {
      url: "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2Fangry_bird2.mp4?alt=media&token=11432fdc-edbf-4cdd-a07e-b1c62e842e22",
      title: "right",
      position: 1,
    },
  ];
  const winAudioRef = useRef(null);
  const [completedVideos, setCompletedVideos] = useState({
    left: false,
    right: false,
  });
  const handleCompleted = (title) => {
    setCompletedVideos({ ...completedVideos, [title]: true });
  };

  useEffect(() => {
    if (completedVideos?.left && completedVideos?.right) {
      winAudioRef?.current?.play();

      Swal.fire({
        icon: "success",
        title: "Great Job",
        timer: 1000,
      }).then((result) => {
        setIsGameCompleted(true);
      });
    }
  }, [completedVideos]);
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "-100px",
        }}
      >
        {videoSRC.map(({ url, position, title }, i) => {
          return (
            <VideoPlayer
              key={i}
              index={i}
              keyCode={keyCode}
              position={position}
              url={url}
              title={title}
              handleCompleted={handleCompleted}
              completedVideos={completedVideos}
            />
          );
        })}
      </Box>
      <audio ref={winAudioRef} src="/music/win.mp3" />
    </div>
  );
};

export default ControlVideoPlayerWithHandGesture;
