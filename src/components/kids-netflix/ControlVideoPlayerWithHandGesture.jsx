import React, { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
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

const ControlVideoPlayerWithHandGesture = ({ keyCode, paused, setPaused }) => {
  const videoSRC = [
    {
      url: "https://firebasestorage.googleapis.com/v0/b/videsh-47516.appspot.com/o/ai_labs%2FNetflix_videos%2FThe%20Silent%20Sea%20_%20Official%20Trailer%20_%20Netflix.mp4?alt=media&token=3d62dced-65c9-45cb-a617-cdf59776d6c4",

      title: "Avengers",
      genre: "Sci-fi",
      position: 0,
    },

    {
      url: "https://firebasestorage.googleapis.com/v0/b/ai-courses-cc7f0.appspot.com/o/videos%2Fnetflix%2FOVER%20THE%20MOON%20_%20Official%20Trailer%20%231%20_%20A%20Netflix_Pearl%20Studio%20Production.mp4?alt=media&token=1c904258-77b5-42fe-bb9f-be0062b92a94",
      title: "Avengers",
      genre: "Animation",
      position: 1,
    },
  ];

  return (
    <div
      // className="text-center font-bold text-5xl p-1"
      style={{ textAlign: "center", padding: "5px" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {videoSRC.map(({ url, position }, i) => (
          <Box key={i} sx={{ width: "30%" }}>
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
                component="div"
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
                  playing={keyCode === position}
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
                  animation:
                    keyCode == position ? "pulse 1.5s infinite" : "none",
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
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default ControlVideoPlayerWithHandGesture;
