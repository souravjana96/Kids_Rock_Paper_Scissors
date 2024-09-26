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
            <Box sx={{ pb: 5 }}>
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

      {currentPage === 1 && (
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
    </Box>
  );
};

export default RPCHomePage;
