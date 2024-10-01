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
import Game from "./Game";
import { WaveSvg } from "./SVG";
import GestureSampleCollectCard from "./GestureSampleCollectCard";
import FramerMotionAnimatedContainer from "../common/FramerMotionAnimatedContainer";
import BadgeDisplay from "../common/BadgeDisplay";
import Intro from "../common/Intro";
import Outro from "../common/Outro";
import IntroPopUp from "../common/IntroPopUp";

const initBadges = [
  {
    id: 1,
    name: "Ethics",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fethics.png?alt=media&token=f458c815-38f4-4be8-8da6-b291279f056b",
    color: "#97375d",
    enabled: false,
    message: ``,
  },
  {
    id: 2,
    name: "Intelligence",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fintelligence.png?alt=media&token=4fe74703-b3b5-4e8b-83de-324ca4670684",
    color: "#5271ff",
    enabled: true,
    message: `Students will learn to use their hands to play rock-paper-scissors. They will see how the AI bot understands their gestures and how it can guess what they will do next. This helps them think more and change their plans to win against the bot.`,
  },
  {
    id: 3,
    name: "SDG Goals",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fsdg.png?alt=media&token=88680c7e-aa1f-40ef-ba09-ef220b67d602",
    color: "#00bf63",
    enabled: false,
    message: ``,
  },
  {
    id: 4,
    name: "Life Skills",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Flifeskills.png?alt=media&token=dabf57b4-3d71-46ee-986e-6ea9846fe249",
    color: "#cb6ce6",
    enabled: true,
    message: `By playing many rounds, students will learn to focus and pay attention. They will practice changing their strategies and staying alert while playing against a smart bot that watches their moves.`,
  },
  {
    id: 5,
    name: "Creativity",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fcreativity.png?alt=media&token=452d5f47-4d2b-4c3c-bf82-1d1e23bc4bcf",
    color: "#5ce1e6",
    enabled: true,
    message: `The game makes students think of smart ways to beat the bot. It also helps them imagine how technology can guess what people do and how we can use AI in real life to solve problems.`,
  },
];

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
          //   gap: 10,
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

const RPCHomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //   const [pages, setPages] = useState(JSON.parse(JSON.stringify(initPages)));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const [keyCode, setKeyCode] = useState(38);

  const [samples, setSamples] = useState([
    {
      name: "Rock",
      images: [],
      description: "Rock",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fsrock.png?alt=media&token=b5ef216c-84e8-4ef1-b24f-12a2012558d3",
    },
    {
      name: "Paper",
      images: [],
      description: "Paper",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fspaper.png?alt=media&token=9bbcc19e-ccbb-4f83-b671-a6c221bea3be",
    },
    {
      name: "Scissors",
      images: [],
      description: "Scissors",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fssci.png?alt=media&token=4d953595-a98b-48c2-bbad-c6cce4aaeba6",
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
  const chickAudioRef = useRef(null);

  const goToPreviousPage = () => {
    chickAudioRef?.current?.play();
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    chickAudioRef?.current?.play();
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
      {currentPage > 0 && (
        <Box sx={{ position: "fixed", top: "10%", left: "20px", zIndex: 1000 }}>
          <BadgeDisplay activeBadges={[2, 4, 5]} initBadges={initBadges} />
        </Box>
      )}
      {currentPage === 0 && (
        <Intro
          projectName={"Rock, Paper, Scissors Game"}
          handleOpenProject={goToNextPage}
        />
      )}
      {currentPage == 1 && (
        <Box>
          <Box
            sx={{
              background: "#000620",
              width: "100%",
              aspectRatio: "16/8",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "-110px",
            }}
          >
            <Box
              sx={{
                width: "40%",
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
                sx={{
                  padding: "0px 30px",
                  color: "#e5e7e9",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "20px", sm: "32px", md: "50px", lg: "80px" },
                }}
              >
                Rock, Paper, Scissors
              </Typography>
              <Typography
                variant="h5"
                align="left"
                gutterBottom
                sx={{
                  padding: "0px 30px",
                  color: "#aed6f1",
                  fontWeight: "bold !important",
                  textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "10px", sm: "14px", md: "20px", lg: "32px" },
                  fontFamily: "'Sofadi One', system-ui",
                }}
              >
                - Play Smart and Beat the Bot!
              </Typography>
            </Box>
            <Box sx={{ width: "40%" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "27/34",
                  mx: "auto",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={
                    "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Frockpaperscissor-ezgif.com-crop.gif?alt=media&token=8ae6d2fa-1b82-4839-b793-b0a8df92747f"
                  }
                  alt={"Animated RPC"}
                  fill={true}
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginBottom: "-8px",
              background: "#000620",
              transform: "scaleY(-1)",
            }}
          >
            <WaveSvg />
          </Box>
          <Box
            sx={{
              backgroundImage: `
        url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2FBig%20O%20(6)%20(1).png?alt=media&token=cf182423-e76c-4473-9f68-107ab7f9c9ce"
        )`,

              backgroundPosition: "center",
              backgroundSize: "cover",

              width: "100%",
              aspectRatio: "16/8",
              padding: "20px",
            }}
          >
             <Box>
              <IntroPopUp
                content={
                  "Project is fulfilling: Intelligence, Life Skills, Creativity"
                }
              />
            </Box>
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
        <Game
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
        // <Outro
        //   content={[
        //     "In this project, we learned how to use our hands to play rock-paper-scissors instead of buttons. It was fun to use gestures and see how we can control the game with our movements!",
        //     "We also saw how the smart Bot can guess what we will do next by watching our patterns. This teaches us to think carefully and change our moves to win against the Bot!",
        //   ]}
        //   goToPreviousPage={goToPreviousPage}
        // />
        <Outro
          content={[
            "We learned to use our hands to play rock-paper-scissors. We saw how the AI bot understands our gestures and can guess what we will do next. This helps us think more and change our plans to win against the bot.",
            "By playing many rounds, we learned to focus and pay attention. We practiced changing our strategies and staying alert while playing against a smart bot that watches our moves.",
            "The game made us think of smart ways to beat the bot. It also helped us imagine how technology can guess what people will do and how we can use AI in real life to solve problems.",
          ]}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      <audio ref={chickAudioRef} src="/music/chicks.mp3" />
    </Box>
  );
};

export default RPCHomePage;
