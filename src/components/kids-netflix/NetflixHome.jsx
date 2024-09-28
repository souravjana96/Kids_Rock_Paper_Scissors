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
import GestureSampleCollectCard from "../HandGesturesKids/GestureSampleCollectCard";
import { useRouter } from "next/router";
import * as tf from "@tensorflow/tfjs";
import PreviousButton from "../buttons/PreviousButton";
import NextButton from "../buttons/NextButton";
import TrainModel from "../HandGesturesKids/TrainModel";
import ControlVideoPlayerWithHandGesture from "./ControlVideoPlayerWithHandGesture";
import Preview from "../HandGesturesKids/Preview";
import { WaveSvg } from "./SVG";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardBackspace,
} from "@mui/icons-material";
import Image from "next/image";
import FramerMotionAnimatedContainer from "../common/FramerMotionAnimatedContainer";
import Intro from "../common/Intro";
import BadgeDisplay from "../common/BadgeDisplay";
import Outro from "../common/Outro";
import Lottie from "lottie-react";
import animated_ai_bot from "../../../public/lotties/netflix/game_over.json";
import BackArrowButton from "../buttons/BackArrowButton";
import CommonButton from "../buttons/CommonButton";

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
    message: `Students will understand how important it is to take precise hand gesture samples in front of the camera to improve the AI model’s accuracy, learning how small details can make a big difference in machine learning.`,
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
    message: `By playing a simple game, students will develop the ability to focus and learn patience as they figure out what gestures to show, how to position their hands correctly in front of the webcam, and stay engaged with the game.`,
  },
  {
    id: 5,
    name: "Creativity",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fcreativity.png?alt=media&token=452d5f47-4d2b-4c3c-bf82-1d1e23bc4bcf",
    color: "#5ce1e6",
    enabled: true,
    message: `This app will inspire students to think creatively about how gestures can be used to control things without traditional remotes. It encourages them to imagine controlling devices like TVs, lights, or other gadgets at home through gestures, voice commands, or even other innovative ideas like facial expressions.`,
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
  const [message, setMessage] = useState("");
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  useEffect(() => {
    const MESSAGES = ["Great, Left video playing!", "Right video playing!"];
    setMessage(MESSAGES[highestIndex] || "");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [highestIndex]);

  return (
    <>
      {isGameCompleted ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            backgroundImage:
              "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
          }}
        >
          <BackArrowButton handleBack={goToPreviousPage} customColor="#000" />
          <Typography
            variant="h2"
            color="initial"
            align="center"
            sx={{
              fontWeight: "bold",
            }}
          >
            Game Over
          </Typography>
          <Box
            sx={{
              display: "Flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              flexWrap: "wrap",
              p: 2,
            }}
          >
            <Lottie
              animationData={animated_ai_bot}
              loop={true}
              style={{
                width: "400px",
                margin: "auto",
                maxWidth: "100%",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 5,
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  background: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  textTransform: "none",
                  letterSpacing: "2px",
                  borderRadius: "20px",
                  border: "2px solid #239b56",
                  boxShadow: "1px 1px 10px #000",
                  px: 5,
                  py: 1,
                  //   my: 1,
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
                onClick={goToPreviousPage}
              >
                <KeyboardArrowLeft /> Go Back
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: "#fff",
                  color: "#000",
                  fontWeight: "bold",
                  textTransform: "none",
                  letterSpacing: "2px",
                  borderRadius: "20px",
                  border: "2px solid #239b56",
                  boxShadow: "1px 1px 10px #000",
                  px: 5,
                  py: 1,
                  //   my: 1,
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
                onClick={goToNextPage}
              >
                Next <KeyboardArrowRight />
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundImage: `
  url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2F4.png?alt=media&token=1a8e9d71-7e45-448d-b64f-f86cf8662988"
  )`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            positon: "relative",
          }}
        >
          <BackArrowButton handleBack={goToPreviousPage} customColor="#fff" />
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
            Finish Left, Finish Right!
          </Typography>
          <ControlVideoPlayerWithHandGesture
            keyCode={+highestIndex}
            paused={!paused}
            setPaused={setPaused}
            setIsGameCompleted={setIsGameCompleted}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              alignItems: "flex-end",
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
      )}
    </>
  );
};

const NetflixHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentPage, setCurrentPage] = useState(0);

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
  const waterDropAudioRef = useRef();

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
  return (
    <Box>
      {currentPage === 0 && (
        <Intro
          projectName={"Play Videos with Your Hands"}
          handleOpenProject={goToNextPage}
        />
      )}
      {currentPage > 0 && (
        <Box sx={{ position: "fixed", top: "10%", left: "20px", zIndex: 1000 }}>
          <BadgeDisplay activeBadges={[2, 4, 5]} initBadges={initBadges} />
        </Box>
      )}
      {currentPage == 1 && (
        <Box sx={{}}>
          <Box
            sx={{
              backgroundImage: `
        url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FYour%20paragraph%20text%20(21).png?alt=media&token=3be0dd9a-b61d-40ae-841a-530f50a654e7"
        )`,

              backgroundPosition: "center",
              backgroundSize: "cover",
              width: "100%",
              aspectRatio: "16/8",
              positon: "relative",
              padding: 5,
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
                ml: 4,
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
              aspectRatio: "16/8",
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
      {currentPage == 2 && isModelTrained && (
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
      )}
      {currentPage === 3 && (
        <Outro
          content={[
            "In this project, we learned how we can replace our traditional remote with cool hand gestures.",
            "We saw how different gestures can be used for different tasks, showing us new ways to control things like videos or other devices.",
          ]}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      <audio ref={waterDropAudioRef} src="/music/waterdrop.mp3" />
    </Box>
  );
};

export default NetflixHome;
