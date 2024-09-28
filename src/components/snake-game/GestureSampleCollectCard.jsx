import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { IoMdMore } from "react-icons/io";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { BiFolderPlus } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineVideoCamera } from "react-icons/ai";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, boxClasses, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

const WebCam = ({
  tf,
  model,
  mobileNet,
  setTrainingDataInputs,
  setTrainingDataOutputs,
  name,
  activeCard,
  index,
  samples,
  setSamples,
  isModelLoading,
}) => {
  const videoPlayer = useRef(null);
  const streamRef = useRef(null);

  const [isClicked, setIsClicked] = useState(false);

  const dataGatherLoop = () => {
    if (videoPlayer.current && mobileNet) {
      const imageCapture = new ImageCapture(
        streamRef.current.getVideoTracks()[0]
      );

      imageCapture
        .grabFrame()
        .then((imageBitmap) => {
          const canvas = document.createElement("canvas");
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          const context = canvas.getContext("2d");
          context.drawImage(imageBitmap, 0, 0);

          const imageDataUrl = canvas.toDataURL("image/jpeg");
          const imageDataTensor = tf.browser.fromPixels(canvas);
          const resizedTensorFrame = tf.image.resizeBilinear(
            imageDataTensor,
            [224, 224],
            true
          );
          const normalizedTensorFrame = resizedTensorFrame.div(255);
          const imageFeatures = mobileNet
            .predict(normalizedTensorFrame.expandDims())
            .squeeze();

          setTrainingDataInputs((prev) => [...prev, imageFeatures]);
          setTrainingDataOutputs((prev) => [...prev, index]);
          setSamples((prev) => {
            let newArr = [...prev];
            newArr[index].images.push(imageDataUrl);
            return newArr;
          });
        })
        .catch((error) => {
          console.error("Error grabbing frame:", error);
        });
    }
  };

  const enableCam = async () => {
    try {
      const stream = await navigator?.mediaDevices?.getUserMedia({
        video: true,
        width: 240,
        height: 300,
      });

      if (videoPlayer.current && stream) {
        videoPlayer.current.srcObject = stream;
        videoPlayer.current.onloadedmetadata = () => {
          videoPlayer.current.play();
        };
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };
  const disableCam = () => {
    if (streamRef.current) {
      const stream = streamRef.current;

      if (stream.getTracks) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } else {
        stream.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }

      // videoPlayer.current.srcObject = null;
      // streamRef.current = null;
    }
  };

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
  };

  useEffect(() => {
    if (name === activeCard) {
      enableCam();
    } else {
      disableCam();
    }

    return () => {
      disableCam();
    };
  }, []);

  useEffect(() => {
    let intervalId;

    if (isClicked) {
      intervalId = setInterval(dataGatherLoop, 100); // Call the function every second
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
    };
  }, [isClicked]);

  return (
    <Box sx={{ textAlign: "center", margin: "auto" }}>
      <video
        style={{
          clear: "both",
          display: "block",
          background: "black",
          width: "100%",
          aspectRatio: "1/1",
          // height: "100%",
          margin: "8px auto",
          objectFit: "cover",
          transform: "scaleX(-1)",
          borderRadius: "50%",
        }}
        autoPlay
        muted
        ref={videoPlayer}
      ></video>
      <Button
        className="capture-button"
        disabled={isModelLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        sx={{
          color: "white",
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "20px",
          borderRadius: "10px",
          px: 3,
          py: 1,
          my: 1,
          transition: "background 0.3s, transform 0.3s",
          background: !isModelLoading ? "#3B82F6" : "#B2BABB",
          cursor: isModelLoading ? "not-allowed" : "pointer",

          "&:hover": {
            background: "#2272F5",
            transform: "scale(1.05)",
          },
        }}
      >
        {isModelLoading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          "Press and Hold To Capture"
        )}
      </Button>
    </Box>
  );
};

const GestureSampleCollectCard = ({
  samples,
  setSamples,
  activeCard,
  setActiveCard,
  index,
  tf,
  model,
  mobileNet,
  setTrainingDataInputs,
  setTrainingDataOutputs,
  isModelLoading,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const chickAudioRef = useRef(null);

  return (
    <Box
      className={`card-${index}`}
      sx={{
        width: "400px",
        maxWidth: "100%",
        marginY: 3,
        marginX: "auto",
        borderRadius: "16px",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: "#fff",
          fontWeight: "bold !important",
          textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
          fontFamily: "'Sofadi One', system-ui",
        }}
      >
        {samples[index].description}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      ></Box>
      {!showPreview || activeCard !== samples[index]?.name ? (
        <Box sx={{ padding: "16px", paddingTop: "40px" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1/1",
              mx: "auto",
              overflow: "hidden",
              borderRadius: "50%",
              border: "5px solid #138d75",
              boxShadow: "0px 0px 10px #138d75",
            }}
          >
            <Image
              src={samples[index]?.thumbnail}
              alt={samples[index]?.thumbnail}
              fill={true}
              loading="lazy"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                px: 5,
                border: "3px solid #000",

                borderRadius: "16px",
                backgroundColor: "#fea1c3",
                // backgroundColor: "#ccdefd",

                "&:hover": {
                  backgroundColor: "#ccdefd",
                  backgroundColor: "#5eb177",
                  boxShadow: "0px 0px 20px #000",
                },
              }}
              onClick={() => {
                setShowPreview(true);
                setActiveCard(samples[index]?.name);
                chickAudioRef?.current?.play();
              }}
            >
              <Box
                className="webcam"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#1b68d2",
                }}
              >
                <AiOutlineVideoCamera
                  style={{
                    margin: "auto",
                    fontWeight: "extrabold",
                    color: "#000",
                  }}
                  size={24}
                />
                <Typography
                  variant="h6"
                  color="#000"
                  sx={{ fontWeight: "bold" }}
                >
                  Click Here
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              transition: "all 1000ms",
              maxWidth: "500px !important",
            }}
          >
            <Box
              sx={{
                width: "100%",
                // background: "#e8f0fe",
                color: "#1b68d2",
                padding: "16px",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  <AiOutlineClose onClick={() => setShowPreview(false)} />
                </Box>
                <WebCam
                  name={samples[index].name}
                  activeCard={activeCard}
                  samples={samples}
                  setSamples={setSamples}
                  index={index}
                  setTrainingDataInputs={setTrainingDataInputs}
                  setTrainingDataOutputs={setTrainingDataOutputs}
                  tf={tf}
                  model={model}
                  mobileNet={mobileNet}
                  isModelLoading={isModelLoading}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Box
        sx={{
          padding: "1px",
          maxHeight: "90px",
          overflow: "hidden",
          height: "80px",
        }}
      >
        <PerfectScrollbar>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              padding: "8px",
              marginLeft: "4px",
              minWidth: "50%",
              maxWidth: "100% !important",
              width: "300px",
              marginBottom: "12px",
            }}
          >
            {samples[index]?.images?.map((imageUrl, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: "48px",
                  maxWidth: "49px",
                  borderRadius: "24px",
                  overflow: "hidden !important",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: "24px",
                    mx: "auto",
                    overflow: "hidden",
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={`Image ${i + 1}`}
                    fill={true}
                    loading="lazy"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    className="hoveredDeletedButton"
                    sx={{
                      position: "absolute",
                      top: 0,
                      zIndex: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease-in-out",
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setSamples((prev) => {
                          let newArr = [...prev];
                          newArr[index].images.splice(i, 1);
                          return newArr;
                        });
                      }}
                    >
                      <DeleteIcon sx={{ color: "#FA3C29" }} fontSize="large" />
                    </IconButton>
                  </Box>
                </Box>
              </div>
            ))}
          </Box>
        </PerfectScrollbar>
      </Box>
      <audio ref={chickAudioRef} src="/music/waterdrop.mp3" />
    </Box>
  );
};

export default GestureSampleCollectCard;
