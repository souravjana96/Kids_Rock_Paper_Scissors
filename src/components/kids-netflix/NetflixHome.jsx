import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import GestureSampleCollectCard from "../HandGesturesKids/GestureSampleCollectCard";
import { useRouter } from "next/router";
import * as tf from "@tensorflow/tfjs";
import PreviousButton from "../buttons/PreviousButton";
import NextButton from "../buttons/NextButton";
import TrainModel from "../HandGesturesKids/TrainModel";
import ControlVideoPlayerWithHandGesture from "./ControlVideoPlayerWithHandGesture";
import Preview from "../HandGesturesKids/Preview";
import { WaveSvg } from "./SVG";
import { KeyboardBackspace } from "@mui/icons-material";
import Image from "next/image";
import FramerMotionAnimatedContainer from "../common/FramerMotionAnimatedContainer";
// import AnimatedContainer from "../plant-disease/AnimatedContainer";
// import { Tooltip } from "react-tooltip";

const DataCollection = ({
  samples,
  setSamples,
  activeCard,
  setActiveCard,
  tf,
  model,
  mobileNet,
  setTrainingDataInputs,
  setTrainingDataOutputs,
  isReadyToTrain,
  goToPreviousPage,
  goToNextPage,
  isModelLoading,
}) => {
  return (
    <div>
      {/* <AnimatedContainer> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1,
          p: 2,
        }}
      >
        {samples.map(({ name, image }, i) => {
          return (
            <Box key={i}>
              <GestureSampleCollectCard
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                samples={samples}
                setSamples={setSamples}
                index={i}
                setTrainingDataInputs={setTrainingDataInputs}
                setTrainingDataOutputs={setTrainingDataOutputs}
                tf={tf}
                model={model}
                mobileNet={mobileNet}
                isModelLoading={isModelLoading}
              />
            </Box>
          );
        })}
      </Box>
      {/* </AnimatedContainer> */}
    </div>
  );
};
const TrainPoseModel = ({
  tf,
  model,
  mobileNet,
  trainingDataInputs,
  trainingDataOutputs,
  samples,
  setIsModelTrained,
  isModelTrained,
  goToPreviousPage,
  goToNextPage,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "300px" }}>
      <TrainModel
        tf={tf}
        model={model}
        mobileNet={mobileNet}
        trainingDataInputs={trainingDataInputs}
        trainingDataOutputs={trainingDataOutputs}
        samples={samples}
        setIsModelTrained={setIsModelTrained}
        goToNextPage={goToNextPage}
      />
    </Box>
  );
};

const PreviewPose = ({
  tf,
  model,
  mobileNet,
  trainingDataInputs,
  trainingDataOutputs,
  samples,
  isModelTrained,
  highestIndex,
  setHighestIndex,
  goToPreviousPage,
  goToNextPage,
}) => {
  const [paused, setPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(
    "Are you ready to help me find the perfect movie?"
  );
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameRound, setGameRound] = useState(0);

  const [gamePlay, setGamePlay] = useState([
    {
      round: 1,
      genre: "Action",
      message: "Can you find an Action Movie for me?",
    },
    {
      round: 2,
      genre: "Animation",
      message: "Can you pick out a Animation film?",
    },
    {
      round: 3,
      genre: "Sci-fi",
      message: "Find a gripping Sci-fi movie",
    },
    {
      round: 4,
      genre: "Comedy",
      message:
        "I'm looking for a comedy to tickle my funny bone. Can you locate one?",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleStartTimer = () => {
    setTime(0);
    setIsRunning(true);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    // setTime(0);
  };
  const handleStartGame = () => {
    Swal.fire({
      title: "Are you ready to play?",
      text: "Use hand-gestures. But remember, time's ticking! You'll only have 30 seconds for each round to find the movie and play!",
      confirmButtonText: "Start",
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentMessage(gamePlay[0]?.message);
        setIsGameStarted(true);
      }
    });

    // setTimeout(() => {
    //   setIsGameStarted(true);
    //   // handleStartTimer();
    // }, 10000);
  };
  const goToNextRound = () => {
    setGameRound((prev) => prev + 1);
    handleResetTimer();
  };
  const handleSubmitGameResult = (result = false) => {
    console.log("Res fun called", result);
    setCurrentMessage(gamePlay[gameRound + 1]?.message || "Well Done!");

    setGamePlay((prev) => {
      const curr = JSON.parse(JSON.stringify(prev));
      (curr[gameRound].isCompleted = true),
        (curr[gameRound].isCorrect = result);
      return curr;
    });
    if (gameRound < 3) {
      setTimeout(() => {
        goToNextRound();
        // handleStartTimer();
      }, 100);
    } else {
      setIsGameCompleted(true);
    }
  };
  const findTotalCorrectPick = () => {
    let count = 0;
    gamePlay.forEach(({ isCompleted, isCorrect }) => {
      if (isCompleted) {
        if (isCorrect) {
          count++;
        }
      }
    });
    return count;
  };

  useEffect(() => {
    const MESSAGES = ["Great, Left video playing!", "Right video playing!"];
    setMessage(MESSAGES[highestIndex] || "");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [highestIndex]);

  return (
    <Box style={{ padding: "20px" }}>
      <Box>
        <ControlVideoPlayerWithHandGesture
          keyCode={+highestIndex}
          paused={!paused}
          setPaused={setPaused}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            alignItems: "flex-end",
            marginTop: "-50px",
          }}
        >
          <Preview
            tf={tf}
            model={model}
            mobileNet={mobileNet}
            trainingDataInputs={trainingDataInputs}
            trainingDataOutputs={trainingDataOutputs}
            samples={samples}
            isModelTrained={isModelTrained}
            highestIndex={highestIndex}
            setHighestIndex={setHighestIndex}
            isChecked={paused}
            setIsChecked={setPaused}
          />
        </Box>

        {message && (
          <Box sx={{ position: "fixed", bottom: "20px", right: "20px" }}>
            <Box
              sx={{
                position: "relative",
                width: "400px",
                maxWidth: "90%",
                aspectRatio: "1/1",
                mx: "auto",
                // overflow: "hidden",
              }}
              data-tooltip-id="my-tooltip-inline"
              data-tooltip-content="Hello world!"
            >
              <Image
                src={
                  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBig_O__5_-removebg.png?alt=media&token=6dc42e7d-40c3-4acc-b1e7-3717b717d241"
                }
                alt={"scooby doo"}
                fill={true}
                loading="lazy"
                style={{
                  objectFit: "cover",
                }}
              />
              {message && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "280px",
                    right: "280px",
                    width: "15px",
                    height: "15px",
                    background: "#f34c89",
                    boxShadow: "-2px -2px 12px #fff",
                    borderRadius: "20px",
                    zIndex: 1,
                  }}
                ></Box>
              )}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "300px",
                  right: "300px",
                  padding: message ? "15px 20px" : "0",
                  minWidth: "300px",
                  minHeight: "100px",
                  color: "white",
                  borderRadius: "20px",
                  background: "#f34c89",
                  boxShadow: "-2px -2px 12px #fff",
                  zIndex: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  animation: `${message ? "popupIn" : "popupOut"} 0.5s ease`,
                  "@keyframes popupIn": {
                    from: {
                      opacity: 0,
                      transform: "scale(0.5)",
                    },
                    to: {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                  },
                  "@keyframes popupOut": {
                    from: {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                    to: {
                      opacity: 0,
                      transform: "scale(0.5)",
                    },
                  },
                }}
              >
                <Typography variant="h6" color="#fff" align="center">
                  {message}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const NetflixHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const [keyCode, setKeyCode] = useState(38);

  const [samples, setSamples] = useState([
    {
      name: "Left",
      images: [],
      description: "Raise your Left hand",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBig%20O%20(4).png?alt=media&token=bf404e90-f6d1-414a-9d5e-23f26bf3dd45",
    },
    {
      name: "Right",
      images: [],
      description: "Raise your Right hand",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBig%20O%20(3).png?alt=media&token=d69a5f33-ea6a-473b-8492-075d863acb78",
    },
  ]);
  const [mobileNet, setMobileNet] = useState(null);
  const [model, setModel] = useState(null);
  const [activeCard, setActiveCard] = useState("0");
  const [isReadyToTrain, setIsReadyToTrain] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [trainingDataInputs, setTrainingDataInputs] = useState([]);
  const [trainingDataOutputs, setTrainingDataOutputs] = useState([]);
  const [highestIndex, setHighestIndex] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
    }
  };

  const defineModel = () => {
    let model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [1024], units: 128, activation: "relu" })
    );
    model.add(
      tf.layers.dense({ units: samples.length, activation: "softmax" })
    );
    setModel(model);

    model.summary();
    model.compile({
      optimizer: "adam",
      loss:
        samples.length === 2 ? "binaryCrossentropy" : "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  };

  const loadMobileNetFeatureModel = async () => {
    const URL =
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
    setIsModelLoading(true);

    try {
      const mobilenet = await tf.loadGraphModel(URL, { fromTFHub: true });
      setMobileNet(mobilenet);

      tf.tidy(() => {
        let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
        defineModel();
      });
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  useEffect(() => {
    loadMobileNetFeatureModel();
  }, []);

  useEffect(() => {
    let flag = true;
    samples.map(({ images }) => {
      if (images.length === 0) flag = false;
    });
    setIsReadyToTrain(flag && samples.length > 1);
  }, [samples]);
  return (
    <Box>
      {currentPage == 0 && (
        <Box sx={{}}>
          <Box
            sx={{
              backgroundImage: `
        url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FYour%20paragraph%20text%20(2).png?alt=media&token=4b29415f-7f2b-4c4e-a872-96dc9b9bf538"
        )`,

              backgroundPosition: "center",
              backgroundSize: "cover",

              width: "100%",
              aspectRatio: "16/8",
              positon: "relative",
            }}
          >
            <Box
              sx={{
                width: "50%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                flexWrap: "wrap",
                overFlow: "hidden",
              }}
            >
              <Typography
                variant="h2"
                align="left"
                gutterBottom
                // className="sofadi-one-font"
                sx={{
                  padding: "0px 30px",
                  color: "#e5e7e9",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "20px", sm: "32px", md: "50px", lg: "80px" },
                  fontFamily: "'Sofadi One', system-ui",
                  fontStyle: "normal",
                }}
              >
                Play Videos with Your Hands
              </Typography>
              <Typography
                variant="h5"
                align="left"
                gutterBottom
                sx={{
                  padding: "0px 30px",
                  color: "#34495",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "10px", sm: "14px", md: "20px", lg: "40px" },
                  fontFamily: "'Sofadi One', system-ui",
                }}
              >
                Raise Your Hand to Play the Right or Left Video! – It's Easy and
                Fun!
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              background: "#f34c89",
              marginTop: "-60px",
              marginBottom: "-10px",
            }}
          >
            <WaveSvg />
          </Box>

          <Box
            sx={{
              backgroundImage: `
        url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FYour%20paragraph%20text%20(11).png?alt=media&token=eab5b03a-6c28-4572-a626-d93952956e37"
        )`,

              backgroundPosition: "center",
              backgroundSize: "cover",
              width: "100%",
              // aspectRatio: "16/8",
              padding: "20px",
            }}
          >
            <Box sx={{ pb: 5 }}>
              <FramerMotionAnimatedContainer>
                <DataCollection
                  activeCard={activeCard}
                  setActiveCard={setActiveCard}
                  samples={samples}
                  setSamples={setSamples}
                  setTrainingDataInputs={setTrainingDataInputs}
                  setTrainingDataOutputs={setTrainingDataOutputs}
                  tf={tf}
                  model={model}
                  mobileNet={mobileNet}
                  isReadyToTrain={isReadyToTrain}
                  goToPreviousPage={goToPreviousPage}
                  goToNextPage={goToNextPage}
                  isModelLoading={isModelLoading}
                />
              </FramerMotionAnimatedContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "300px",
                }}
              >
                {isReadyToTrain && (
                  <TrainPoseModel
                    tf={tf}
                    model={model}
                    mobileNet={mobileNet}
                    trainingDataInputs={trainingDataInputs}
                    trainingDataOutputs={trainingDataOutputs}
                    samples={samples}
                    setIsModelTrained={setIsModelTrained}
                    isModelTrained={isModelTrained}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {currentPage == 1 && (
        <Box>
          {isModelTrained && (
            <Box
              sx={{
                backgroundImage: `
          url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2F4.png?alt=media&token=1a8e9d71-7e45-448d-b64f-f86cf8662988"
          )`,

                backgroundPosition: "center",
                backgroundSize: "cover",

                width: "100%",
                aspectRatio: "16/8",
                positon: "relative",
              }}
            >
              <IconButton
                aria-label=""
                onClick={goToPreviousPage}
                sx={{ mt: 1, ml: 1, color: "#fff" }}
              >
                <KeyboardBackspace fontSize="large" color="#000" />
              </IconButton>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  // padding: "0px 30px",
                  color: "#e5e7e9",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "20px", sm: "32px", md: "60px", lg: "50px" },
                  fontFamily: "'Sofadi One', system-ui",
                  fontStyle: "normal",
                }}
              >
                Choose a Video!
              </Typography>
              <PreviewPose
                tf={tf}
                model={model}
                mobileNet={mobileNet}
                trainingDataInputs={trainingDataInputs}
                trainingDataOutputs={trainingDataOutputs}
                samples={samples}
                isModelTrained={isModelTrained}
                highestIndex={highestIndex}
                setHighestIndex={setHighestIndex}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NetflixHome;
