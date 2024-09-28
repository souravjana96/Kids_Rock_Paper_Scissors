import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as tf from "@tensorflow/tfjs";
import PreviousButton from "../buttons/PreviousButton";
import NextButton from "../buttons/NextButton";
import TrainModel from "../HandGesturesKids/TrainModel";
import { KeyboardBackspace } from "@mui/icons-material";
import Image from "next/image";
import { WaveSvg } from "./SVG";

import animated_snake from "../../../public/lotties/snake-game/snake.json";
import Lottie from "lottie-react";
import GestureSampleCollectCard from "./GestureSampleCollectCard";
import SnakeGame from "./SnakeGame";
import Intro from "../common/Intro";
import BadgeDisplay from "../common/BadgeDisplay";
import Outro from "../common/Outro";

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
      <Grid container spacing={3} justify="center">
        {samples.map(({ name, image }, i) => {
          return (
            <Grid item xs={12} md={6} xl={3} key={i}>
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
            </Grid>
          );
        })}
      </Grid>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 10,
          p: 2,
        }}
      >
        {samples.map(({ name, image }, i) => {
          return (
            <Box key={i} className={name}>
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
      </Box> */}
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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
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
    </Box>
  );
};

const SnakeGameHomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //   const [pages, setPages] = useState(JSON.parse(JSON.stringify(initPages)));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const [keyCode, setKeyCode] = useState(38);

  const [samples, setSamples] = useState([
    {
      name: "Left",
      images: [],
      description: "Left",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2F8.png?alt=media&token=08751779-d698-41a5-9046-24f42cce8525",
    },
    {
      name: "Right",
      images: [],
      description: "Right",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2F9.png?alt=media&token=b9eddc15-78eb-4155-8313-903874e1f781",
    },
    {
      name: "Up",
      images: [],
      description: "Up",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2F10.png?alt=media&token=45f86b72-5b3c-4085-a1ce-507cd5a7d621",
    },
    {
      name: "Down",
      images: [],
      description: "Down",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2F11.png?alt=media&token=f6606293-a902-458e-b4a7-bf0b844768f4",
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
  const waterDropAudioRef = useRef(null);
  const jungleAudioRef = useRef(null);

  const goToPreviousPage = () => {
    waterDropAudioRef?.current?.play();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    waterDropAudioRef?.current?.play();
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

  useEffect(() => {
    if (currentPage === 1) {
      jungleAudioRef?.current?.play();
    } else {
      jungleAudioRef?.current?.pause();
    }
  }, [currentPage]);
  return (
    <Box>
      {currentPage > 0 && (
        <Box sx={{ position: "fixed", top: "10%", left: "20px", zIndex: 1000 }}>
          <BadgeDisplay activeBadges={[1, 3, 5]} />
        </Box>
      )}
      {currentPage === 0 && (
        <Intro projectName={"Snake Game"} handleOpenProject={goToNextPage} />
      )}

      {currentPage == 1 && (
        <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2FYour%20paragraph%20text%20(17).png?alt=media&token=97e07164-e937-4080-9e36-51c5eb233b2a')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          }}
          onClick={() => {
            jungleAudioRef?.current?.play();
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              flexWrap: "wrap",
              //   gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                flexWrap: "wrap",
                overFlow: "hidden",
                maxWidth: "1000px",
                mt: 2,
              }}
            >
              <Typography
                variant="h2"
                align="center"
                gutterBottom
                sx={{
                  padding: "0px 30px 0px 0px",
                  color: "#e5e7e9",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "20px", sm: "32px", md: "50px", lg: "80px" },
                }}
              >
                Snake Game
              </Typography>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  //   padding: "0px 30px",
                  maxWidth: "600px",
                  color: "#f34c89",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 6px #000",
                  //   fontSize: { xs: "10px", sm: "14px", md: "20px", lg: "50px" },
                  fontFamily: "'Sofadi One', system-ui",
                }}
              >
                Move the Snake with Your Hand and Help It Eat the Food!
              </Typography>
            </Box>
            <Box sx={{ width: "50%" }}>
              <Box
                sx={{
                  backgroundImage: `
          url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2FUntitled%20design%20(5).png?alt=media&token=3505076c-d410-43be-b048-0484f4a406a6"
          )`,

                  backgroundPosition: "center",
                  backgroundSize: "cover",

                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  mx: "auto",
                  overflow: "hidden",
                }}
              >
                <Lottie
                  animationData={animated_snake}
                  loop={true}
                  style={{
                    width: "80%",
                    margin: "auto",
                    maxWidth: "100%",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{}}>
            <Box sx={{ py: 5 }}>
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
      )}

      {currentPage === 2 && (
        <SnakeGame
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
      )}
      {currentPage === 3 && (
        <Outro
          content={[
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero quae ad nemo similique veniam vel veritatis suscipit deserunt dolor, quas, excepturi, deleniti placeat nihil exercitationem alias animi cupiditate! In odio iste rem nulla quos veniam",
            " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero quae ad nemo similique veniam vel veritatis suscipit deserunt dolor, quas, excepturi, deleniti placeat nihil exercitationem alias animi cupiditate! In odio iste rem nulla quos veniam.",
          ]}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      <audio ref={waterDropAudioRef} src="/music/waterdrop.mp3" />
      <audio ref={jungleAudioRef} src="/music/jungle-sound-effect.mp3" loop />
    </Box>
  );
};

export default SnakeGameHomePage;
