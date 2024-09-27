/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Lottie from "lottie-react";
import animated_ai_bot from "../../../public/lotties/kids-rps/bot.json";
import loading_cat_animation from "../../../public/lotties/common/loading_cat.json";

import animated_boy from "../../../public/lotties/kids-rps/boy.json";
import happy_boy from "../../../public/lotties/kids-rps/happy_boy.json";
import draw from "../../../public/lotties/kids-rps/draw.json";
import confidentbot from "../../../public/lotties/kids-rps/confidentbot.json";
import confidentplayer from "../../../public/lotties/kids-rps/confidentplayer.json";
import winnerbot from "../../../public/lotties/kids-rps/winnerbot.json";
import winnerplayer from "../../../public/lotties/kids-rps/winnerplayer.json";

import Image from "next/image";
import NextButton from "../buttons/NextButton";
import { KeyboardBackspace } from "@mui/icons-material";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 5) {
  }

  if (remainingTime === 0) {
    return <div className="text-gray-500"></div>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "16px", margin: 0, padding: 0, color: "#fff" }}>
        You have
      </p>
      <p
        style={{
          fontSize: "32px",
          margin: 0,
          padding: 0,
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        {remainingTime}
      </p>
      <p style={{ fontSize: "14px", margin: 0, padding: 0, color: "#fff" }}>
        seconds
      </p>
    </div>
  );
};

const CountDown = () => {
  return (
    <>
      <CountdownCircleTimer
        isPlaying
        duration={4.7}
        size={180}
        colors={["#28B463", "#F1C40F", "#E74C3C"]}
        colorsTime={[5, 3, 0]}
        onComplete={() => ({ shouldRepeat: false, delay: 3 })}
      >
        {renderTime}
      </CountdownCircleTimer>
    </>
  );
};

const Preview = ({
  tf,
  model,
  mobileNet,
  trainingDataInputs,
  trainingDataOutputs,
  samples,
  isModelTrained,
  highestIndex,
  setHighestIndex,
  isChecked,
  setIsChecked,
  countDownEnabled,
}) => {
  const videoPlayer = useRef(null);
  const streamRef = useRef(null);
  const predictInterval = useRef(null);
  const [predictionOutput, setPredictionOutput] = useState([0, 0, 0]);
  //   const [isChecked, setIsChecked] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const COLORS = [
    "bg-teal-600",
    "bg-red-400",
    "bg-yellow-600",
    "bg-green-600",
    "bg-blue-600",
    "bg-sky-600",
  ];
  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
    togglePrediction();
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

      if (videoPlayer.current) {
        videoPlayer.current.srcObject = null;
      }
      streamRef.current = null;
    }
  };
  function calculateFeaturesOnCurrentFrame() {
    if (
      !videoPlayer.current ||
      !videoPlayer.current.videoWidth ||
      !videoPlayer.current.videoHeight
    ) {
      // Return null or handle the case when the video frame isn't ready.
      return null;
    }
    return tf.tidy(function () {
      let videoFrameAsTensor = tf.browser.fromPixels(videoPlayer.current);

      let resizedTensorFrame = tf.image.resizeBilinear(
        videoFrameAsTensor,
        [224, 224],
        true
      );

      let normalizedTensorFrame = resizedTensorFrame.div(255);

      return mobileNet.predict(normalizedTensorFrame.expandDims()).squeeze();
    });
  }
  function predictLoop() {
    if (isChecked && isPredicting && videoPlayer.current != null) {
      tf.tidy(function () {
        let imageFeatures = calculateFeaturesOnCurrentFrame();
        if (!imageFeatures) return;
        let prediction = model.predict(imageFeatures.expandDims()).squeeze();
        let highestIndex = prediction.argMax().arraySync();
        let predictionArray = prediction.arraySync();

        if (Math.floor(predictionArray[highestIndex] * 100) > 85) {
          setHighestIndex(highestIndex);
          setPredictionOutput(predictionArray);
        }
      });
    }
  }
  const predictData = () => {
    predictInterval.current = setInterval(() => {
      predictLoop();
    }, 200);
  };
  function stopPredictLoop() {
    clearInterval(predictInterval.current);
  }

  const togglePrediction = () => {
    if (isPredicting) {
      setIsPredicting(false);
    } else {
      setIsPredicting(true);
    }
  };
  useEffect(() => {
    isChecked ? enableCam() : disableCam();
    return () => {
      disableCam();
    };
  }, [isChecked]);

  useEffect(() => {
    if (isPredicting) {
      predictData();
    } else {
      stopPredictLoop();
    }
  }, [isPredicting]);

  useEffect(() => {
    setIsChecked(true);
    togglePrediction();
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: "20px",
      }}
    >
      <Box
        sx={{
          width: 180,
          marginBottom: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isModelTrained ? (
          <>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                borderRadius: "50%",
                width: "180px",
                height: "180px",
              }}
            >
              <video
                style={{
                  clear: "both",
                  display: "block",
                  background: "black",
                  width: "180px",
                  height: "180px",

                  margin: "auto",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                  borderRadius: "50%",
                }}
                autoPlay
                muted
                ref={videoPlayer}
              ></video>

              <Box
                sx={{
                  background: "#616A6B",
                  width: "180px",
                  height: "180px",
                  transform: countDownEnabled
                    ? `translateY(0%)`
                    : `translateY(-100%)`,
                  transition: "all 0.5s linear",
                  position: "absolute",
                  //   borderRadius: ,
                }}
              ></Box>
            </Box>
            <Box sx={{ minHeight: "40px" }}>
              {!countDownEnabled && (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold !important",
                    color: "#fff",
                    // pb: 1,
                  }}
                >
                  {samples[highestIndex]?.name}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ padding: 5 }}>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "black" }}
            >
              You must train a model before you can preview it here.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const gestures = [
  "/images/rock.jpg",
  "/images/rock.jpg",
  "/images/paper.jpg",
  "/images/scissor.jpg",
];
const HumanGestures = [
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fhuman_rock.png?alt=media&token=b78b8fc9-c058-47d4-b54b-0bd3e5379755",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fhuman_rock.png?alt=media&token=b78b8fc9-c058-47d4-b54b-0bd3e5379755",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fhuman_paper.png?alt=media&token=07f6f7f2-cced-4b3a-bb6a-e0dcb35fd4a4",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fhuman_scissors.png?alt=media&token=5a823ee6-fc64-4898-b87e-1fcfe15d1ee6",
];
const AiGestures = [
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fai_rock.png?alt=media&token=7ae63130-e733-48e2-8356-c73ffd47ddbb",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fai_rock.png?alt=media&token=7ae63130-e733-48e2-8356-c73ffd47ddbb",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fai_paper.png?alt=media&token=51dafad7-f671-4d45-9770-0733fde32f23",
  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2Fai_scissors.png?alt=media&token=1c29263a-488e-42a1-812c-1b08b220b097",
];
const MainActivity = ({
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
  gameResult,
  setGameResult,
  playResultSound,
}) => {
  const [scoreHuman, setScoreHuman] = useState(0);
  const [scoreAI, setScoreAI] = useState(0);
  const [chosenByHuman, setChosenByHuman] = useState(0);
  const [chosenByAI, setChosenByAI] = useState(0);
  const [winner, setWinner] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [countDownEnabled, setCountDownEnabled] = useState(true);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);
  const tieAudioRef = useRef(null);
  const timer5secAudioRef = useRef(null);

  const runTheGame = () => {
    setCountDownEnabled(true);
    timer5secAudioRef?.current?.play();
    setTimeout(() => {
      setCountDownEnabled(false);
    }, 5000);
  };

  const handleStartTheGame = () => {
    setIsGameActive(true);
    runTheGame();
  };
  const handlePauseTheGame = () => {
    setIsGameActive(false);
  };
  const handleResumeTheGame = () => {
    setIsGameActive(true);
  };
  const handleRestartTheGame = () => {
    setScoreHuman(0);
    setScoreAI(0);
    setChosenByHuman(0);
    setChosenByAI(0);
    setWinner("");
    setGameCount(0);
    setCountDownEnabled(false);

    setIsGameActive(false);
  };
  const stringOf = (integer) => {
    switch (integer) {
      case 1:
        return "Rock";
      case 2:
        return "Paper";
      case 3:
        return "Scissors";
      default:
        return "";
    }
  };

  const whoIsTheWinner = ({ human, ai }) => {
    setChosenByHuman(human);
    setChosenByAI(ai);
    if (human === ai) {
      tieAudioRef?.current?.play();
      setWinner("draw");
    } else if (
      (human === 1 && ai === 3) ||
      (human === 3 && ai === 2) ||
      (human === 2 && ai === 1)
    ) {
      winAudioRef?.current?.play();
      setWinner("human");
      setScoreHuman(scoreHuman + 1);
    } else {
      loseAudioRef?.current?.play();
      setWinner("AI");
      setScoreAI(scoreAI + 1);
    }
    setTimeout(() => {
      runTheGame();
    }, 5000);
  };

  const takeHumanInput = (rockOrPaperOrScissors) => {
    setIsGameLoading(true);
    setTimeout(() => {
      setGameCount(gameCount + 1);
      whoIsTheWinner({
        human: rockOrPaperOrScissors,
        ai: Math.floor(Math.random() * 3) + 1,
      });
      setIsGameLoading(false);
    }, 1000);
  };

  const handleSetGameResult = () => {
    const winner_here =
      scoreAI === scoreHuman ? "Tie" : scoreHuman > scoreAI ? "You" : "Bot";
    setGameResult({
      isGameOver: true,
      winner: winner_here,
    });
    playResultSound(winner_here);
  };

  useEffect(() => {
    if (!countDownEnabled) {
      takeHumanInput(((highestIndex || 0) % 3) + 1);
    }
  }, [countDownEnabled]);

  useEffect(() => {
    handleStartTheGame();
  }, []);

  useEffect(() => {
    if (gameCount >= 4) {
      handlePauseTheGame();
      setTimeout(() => {
        handleSetGameResult();
      }, 5000);
    }
  }, [gameCount, scoreAI, scoreHuman]);

  return (
    <Box
      sx={{
        // background: "#000",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover", // To make sure the video covers the background
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2FUntitled%20design%20(2).mp4?alt=media&token=b0038f78-6802-4707-9e75-8fb0c13bc01b"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <Box sx={{ zIndex: 1, position: "relative" }}>
        <Box sx={{ p: 0 }}>
          <Typography
            variant="h5"
            align="center"
            color="#fff"
            sx={{
              // fontWeight: "800",
              pb: 2,
            }}
          >
            Remaining Rounds: {4 - gameCount}
          </Typography>

          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              mx: "auto",
              position: "relative",
            }}
          >
            <Box
              sx={{
                border: "4px solid white",
                display: "flex",
                justifyContent: "center",
                width: "220px",
                mx: "auto",
                p: 2,
              }}
            >
              <Typography
                variant="h4"
                align="center"
                sx={{ fontSize: { xs: "30px", md: "36px" }, fontWeight: "900" }}
                ml={1}
                color="#fff"
              >
                {scoreHuman} : {scoreAI}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                fontSize: { xs: "18px", md: "20px" },
                background: "#cbd5e1",
                position: "absolute",
                top: "27px",
                left: "36px",
                borderRadius: "5px",
                textAlign: "center",
                fontWeight: "800",
                px: { xs: 1, md: 2 },
              }}
            >
              Human
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "18px", md: "20px" },
                background: "#cbd5e1",
                position: "absolute",
                top: "27px",
                right: "56px",
                borderRadius: "5px",
                textAlign: "center",
                fontWeight: "800",
                px: { xs: 1, md: 2 },
              }}
            >
              Bot
            </Typography>
          </Box>
          <Box
            sx={{
              minHeight: "200px",
              maxWidth: "800px",
              mx: "auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                countDownEnabled={countDownEnabled}
              />
            </Box>
            <Box
              sx={{
                width: "220px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!isGameLoading && !countDownEnabled && (
                <>
                  {winner === "human" && (
                    <>
                      {/* <audio autoPlay src="/music/win.mp3" /> */}

                      <Typography
                        variant="h2"
                        align="center"
                        sx={{
                          color: "#41ab5c",
                          textAlign: "center",
                          fontWeight: "800",

                          zIndex: 10,
                        }}
                      >
                        You Win
                      </Typography>
                    </>
                  )}
                  {winner === "AI" && (
                    <>
                      {/* <audio autoPlay src="/music/lose.mp3" /> */}

                      <Typography
                        variant="h2"
                        align="center"
                        sx={{
                          color: "#ff0044",
                          textAlign: "center",
                          fontWeight: "800",

                          zIndex: 10,
                        }}
                      >
                        Bot Win
                      </Typography>
                    </>
                  )}
                  {winner === "draw" && (
                    <Typography
                      variant="h2"
                      align="center"
                      sx={{
                        color: "#fdc005",
                        textAlign: "center",
                        fontWeight: "800",
                      }}
                    >
                      Tie
                    </Typography>
                  )}
                </>
              )}
            </Box>
            <Box>
              <Box sx={{}}>
                <Lottie
                  animationData={animated_ai_bot}
                  loop={true}
                  style={{
                    width: "200px",
                    margin: "auto",
                    maxWidth: "100%",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Count Down */}

          <Box
            sx={{
              maxWidth: "800px",
              margin: "auto",
              //   background: "white",
              //   boxShadow: 3,
              //   borderRadius: "10px",
              minHeight: "350px",
              overflow: "hidden",
            }}
          >
            {countDownEnabled && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "350px",
                  my: "auto",
                }}
              >
                <Typography
                  variant="h5"
                  color="#fff"
                  sx={{ fontWeight: "bold" }}
                >
                  Camera is on!
                </Typography>
                <Typography variant="h6" color="#fff" sx={{ pb: 2 }}>
                  Make your move in front of the camera
                </Typography>
                <CountDown />
              </Box>
            )}

            {!countDownEnabled && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    minHeight: "80px",
                    py: 3,
                    gap: { xs: "48px", lg: "120px" },
                    zIndex: 10,
                  }}
                >
                  {!isGameLoading &&
                    stringOf(chosenByHuman) &&
                    stringOf(chosenByAI) && (
                      <>
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          {stringOf(chosenByHuman)}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                          }}
                        >
                          {stringOf(chosenByAI)}
                        </Typography>
                      </>
                    )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: { xs: 3, lg: 3 },
                    // background: "white",

                    padding: 3,
                    height: "250px",
                    width: "100%",
                    maxWidth: "1600px",
                    margin: "auto",
                    borderRadius: "10px",
                    px: 2,
                    zIndex: 10,
                  }}
                >
                  {isGameLoading ? (
                    <>
                      <Box
                        sx={{
                          width: "48%",
                          aspectRatio: "1/1",
                          // height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          transformOrigin: "left center",
                          animation: "shake 0.5s infinite",
                          "@keyframes shake": {
                            "0%": { transform: "rotate(30deg)" },
                            "50%": { transform: "rotate(-30deg)" },
                            "100%": { transform: "rotate(30deg)" },
                          },
                        }}
                      >
                        <Image
                          src={HumanGestures[0]}
                          fill={true}
                          loading="lazy"
                          alt="leaf image"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "48%",
                          aspectRatio: "1/1",
                          position: "relative",
                          overflow: "hidden",
                          transformOrigin: "right center",
                          animation: "aishake 0.5s infinite",
                          "@keyframes aishake": {
                            "0%": { transform: "rotate(-30deg)" },
                            "50%": { transform: "rotate(30deg)" },
                            "100%": { transform: "rotate(-30deg)" },
                          },
                        }}
                      >
                        <Image
                          src={AiGestures[0]}
                          fill={true}
                          loading="lazy"
                          alt="leaf image"
                          style={{
                            objectFit: "cover",
                            // transform: "scaleX(-1)",
                          }}
                        />
                      </Box>{" "}
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: "48%",
                          aspectRatio: "1/1",
                          // height: "100%",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={HumanGestures[chosenByHuman]}
                          fill={true}
                          loading="lazy"
                          alt="leaf image"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          width: "48%",
                          aspectRatio: "1/1",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={AiGestures[chosenByAI]}
                          fill={true}
                          loading="lazy"
                          alt="leaf image"
                          style={{
                            objectFit: "cover",
                            // transform: "scaleX(-1)",
                          }}
                        />
                      </Box>{" "}
                    </>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ py: 3, pb: 5, display: "flex", justifyContent: "center" }}>
          <Button
            type="button"
            variant="outlined"
            sx={{
              background: "white",
              fontWeight: "bold",
              textTransform: "none",
              letterSpacing: "1px",
              borderRadius: "50px",
              px: 3,
              py: 1,
              transition: "background 0.3s, transform 0.2s",
              color: "black",
              border: "none",
              "&:hover": {
                color: "#aa53f1",
                background: "white",
                border: "none",
              },
            }}
            onClick={goToPreviousPage}
          >
            Exit
          </Button>
        </Box>
      </Box>

      <audio ref={winAudioRef} src="/music/win.mp3" />
      <audio ref={loseAudioRef} src="/music/lose.mp3" />
      <audio ref={tieAudioRef} src="/music/tie.mp3" />
      <audio ref={timer5secAudioRef} src="/music/5sectimer.mp3" />
    </Box>
  );
};

const Game = ({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState({
    isGameOver: true,
    winner: "",
  });
  const [gameStarted, setGameStarted] = useState(false);
  const gameStartAudioRef = useRef(null);
  const chickAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);
  const tieAudioRef = useRef(null);

  const playResultSound = (winner) => {
    if (winner === "You") {
      winAudioRef?.current?.play();
    } else if (winner === "Bot") {
      loseAudioRef?.current?.play();
    } else if (winner === "Tie") {
      tieAudioRef?.current?.play();
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2FYour%20paragraph%20text%20(10).png?alt=media&token=9a78c14a-b394-49d6-8b8a-d015cabcdc2e")`,

        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Box>
        {gameResult?.isGameOver && (
          <IconButton
            aria-label=""
            onClick={goToPreviousPage}
            sx={{ ml: 1, color: "#000" }}
          >
            <KeyboardBackspace fontSize="large" color="#000" />
          </IconButton>
        )}
        {!gameStarted && (
          <>
            {" "}
            <Typography
              variant="h2"
              align="center"
              color="#000"
              sx={{
                padding: "30px 30px",
                // textShadow: "1px 1px 5px #0f0",
                fontWeight: "bold !important",
                letterSpacing: "2px",
              }}
            >
              {"Challenge the "}
              <span style={{ color: "#0f0", textShadow: "1px 1px 5px #" }}>
                Bot
              </span>
            </Typography>
          </>
        )}
        {!isPlaying && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",

              //   height: "350px",
              width: "100%",
              maxWidth: "1200px",
              margin: "auto",
              borderRadius: "10px",
              px: 2,
              mt: 5,

              //   border: "1px solid",
            }}
          >
            <Box
              sx={{
                width: "30%",
              }}
            >
              <Lottie
                animationData={animated_boy}
                loop={true}
                style={{
                  width: "100%",
                  margin: "auto",
                  maxWidth: "100%",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "160px",
                aspectRatio: "1/1",

                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={
                  "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Frock-paper-scissors-kids%2FCopy%20of%20Copy%20of%20Yellow%20Illustrated%20Marketing%20Is%20Important%20LinkedIn%20Post.png?alt=media&token=93e07796-8993-4412-9d84-b1a524f24b2f"
                }
                fill={true}
                loading="lazy"
                alt="leaf image"
                style={{
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box
              sx={{
                width: "30%",
              }}
            >
              <Lottie
                animationData={animated_ai_bot}
                loop={true}
                style={{
                  width: "100%",
                  margin: "auto",
                  maxWidth: "100%",
                }}
              />
            </Box>
          </Box>
        )}
        {isPlaying && gameResult?.isGameOver && (
          <Box>
            <Typography
              variant="h2"
              color={
                gameResult?.winner === "You"
                  ? "#41ab5c"
                  : gameResult?.winner === "Bot"
                  ? "#ff0044"
                  : "#fdc005"
              }
              align="center"
              sx={{ fontWeight: "bold", textShadow: "1px 1px 6px #000" }}
            >
              {gameResult?.winner === "You"
                ? "You Win"
                : gameResult?.winner === "Bot"
                ? "Bot Wins"
                : "Tie"}
            </Typography>
            <Box
              sx={{
                // maxWidth: "400px",
                mx: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pr: 3,
              }}
            >
              {gameResult?.winner === "Tie" ? (
                <Box key={0}>
                  <Lottie
                    animationData={draw}
                    loop={true}
                    style={{
                      width: "500px",
                      margin: "auto",
                      maxWidth: "100%",
                    }}
                  />
                </Box>
              ) : gameResult?.winner === "Bot" ? (
                <Box key={1}>
                  <Lottie
                    animationData={winnerbot}
                    loop={true}
                    style={{
                      width: "500px",
                      margin: "auto",
                      maxWidth: "100%",
                    }}
                  />
                </Box>
              ) : (
                <Box key={2}>
                  <Lottie
                    animationData={happy_boy}
                    loop={true}
                    style={{
                      width: "500px",
                      margin: "auto",
                      maxWidth: "100%",
                    }}
                  />
                </Box>
              )}
            </Box>
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
                  color: "#fff",
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
                  background: "#239b56",
                  cursor: "pointer",

                  "&:hover": {
                    background: "#fff",
                    color: "#f34c89",
                    transform: "scale(1.05)",
                    boxShadow: "1px 1px 10px #000",
                  },
                }}
                onClick={() => {
                  chickAudioRef?.current?.play();
                  goToPreviousPage();
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                sx={{
                  color: "#fff",
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
                  background: "#239b56",
                  cursor: "pointer",

                  "&:hover": {
                    background: "#fff",
                    color: "#f34c89",
                    transform: "scale(1.05)",
                    boxShadow: "1px 1px 10px #000",
                  },
                }}
                onClick={() => {
                  gameStartAudioRef?.current?.play();
                  setGameResult({
                    isGameOver: false,
                    winner: "Bot",
                  });
                }}
              >
                Play Again
              </Button>
            </Box>
          </Box>
        )}

        {!isPlaying && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //   py: 5,
              //   border: "1px solid",
            }}
          >
            {isModelTrained ? (
              <Button
                variant="contained"
                sx={{
                  color: "#fff",
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
                  background: "#239b56",
                  cursor: "pointer",

                  "&:hover": {
                    background: "#fff",
                    color: "#f34c89",
                    transform: "scale(1.05)",
                    boxShadow: "1px 1px 10px #000",
                  },
                }}
                onClick={() => {
                  gameStartAudioRef?.current?.play();
                  setIsPlaying(true);
                  setGameResult({
                    isGameOver: false,
                    winner: "Bot",
                  });
                  setGameStarted(true);
                }}
              >
                Start
              </Button>
            ) : (
              <Typography
                variant="h6"
                color="#f00"
                align="center"
                sx={{ textShadow: "1px 1px 30px #fff" }}
              >
                *Train your model first.
              </Typography>
            )}
          </Box>
        )}
      </Box>
      {isPlaying && !gameResult?.isGameOver && (
        <MainActivity
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
          gameResult={gameResult}
          setGameResult={setGameResult}
          playResultSound={playResultSound}
        />
      )}
      <audio ref={gameStartAudioRef} src="/music/gamestart.mp3" />
      <audio ref={chickAudioRef} src="/music/chicks.mp3" />
      <audio ref={winAudioRef} src="/music/win.mp3" />
      <audio ref={loseAudioRef} src="/music/lose.mp3" />
      <audio ref={tieAudioRef} src="/music/tie.mp3" />
    </Box>
  );
};

export default Game;
