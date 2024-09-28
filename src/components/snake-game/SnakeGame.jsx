import { useEffect, useRef, useState } from "react";
import GameCanvas from "./GameCanvas";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Preview from "../HandGesturesKids/Preview";
import Image from "next/image";
import PreviousButton from "../buttons/PreviousButton";
import NextButton from "../buttons/NextButton";
import { KeyboardBackspace } from "@mui/icons-material";

const SnakeGame = ({
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
  const [enableGame, setEnableGame] = useState(false);
  const [gameOver, setGameover] = useState(false);
  const [CANVAS_SIZE, setCanvasSize] = useState([300, 300]);
  const canvasWidthRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const [animation, setAnimation] = useState("bounce");

  useEffect(() => {
    if (!enableGame) {
      backgroundAudioRef?.current?.play();
    } else {
      backgroundAudioRef?.current?.pause();
    }
  }, [enableGame]);

  // Switch from bounce to pulse animation after the first render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimation("pulse");
    }, 1000); // Duration of bounce animation before switching

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasWidthRef.current) {
        const width = canvasWidthRef.current.offsetWidth;
        const height = window.innerHeight * 0.6; // 60% of viewport height
        const finalWidth = Math.min(width, 600);
        const finalHeight = Math.min(finalWidth, height);
        setCanvasSize([finalWidth - 20, finalHeight]);
      }
    };

    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Box
      ref={canvasWidthRef}
      sx={{
        //   backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/ai-courses-cc7f0.appspot.com/o/images%2Fcodioful-formerly-gradienta-G084bO4wGDA-unsplash.jpg?alt=media&token=fcf31e03-5a9b-49bb-b404-ba80eab63ed6')`,
        //   backgroundPosition: "center",
        //   backgroundSize: "cover",
        //   backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {enableGame ? (
        <Box
          sx={{
            // display: "flex",
            // justifyContent: "center",
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2FYour%20paragraph%20text%20(20).png?alt=media&token=60ab13a5-0001-488b-a14c-f68b908b70fc')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          }}
        >
          <GameCanvas
            keyCode={highestIndex}
            paused={!paused}
            setPaused={setPaused}
            CANVAS_SIZE={CANVAS_SIZE}
            gameOver={gameOver}
            setGameover={setGameover}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
            setEnableGame={setEnableGame}
          />

          <Box
            sx={{
              position: "fixed",
              right: "50px",
              top: "50px",
              zIndex: 50,
              transform: {
                xs: "scale(0.6)",
                md: "scale(0.9)",
                lg: "scale(1)",
              },
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
          {gameOver && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: 5,
                gap: 3,
                paddingBottom: "40px",
                background: "transparent",
              }}
            >
              <PreviousButton onClick={goToPreviousPage} />
              <NextButton onClick={goToNextPage} />
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2FSnake%20Game%20kids%2FYour%20paragraph%20text%20(19).png?alt=media&token=7ca6aa8a-f8df-47a1-98a3-0f5ab083c1e1')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <IconButton
              aria-label=""
              onClick={goToPreviousPage}
              sx={{ ml: 1, color: "#fff" }}
            >
              <KeyboardBackspace fontSize="large" color="#000" />
            </IconButton>
          </Box>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              pt: "10px",
              color: "#fff",
              fontWeight: "bold !important",
              textShadow: "2px 2px 10px #000",
              fontSize: { xs: "20px", sm: "32px", md: "50px", lg: "80px" },
            }}
          >
            Play Snake Game
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "70vh",
            }}
          >
            <Button
              sx={{
                background: "#fff",
                color: "#f34c89",
                fontWeight: "bold",
                textTransform: "none",
                letterSpacing: "1px",
                borderRadius: "20px",
                border: "2px solid #f34c89",
                boxShadow: "1px 1px 10px #f34c89",
                px: 5,
                py: 2,
                my: 1,
                fontSize: "32px",
                transition: "background 0.2s, transform 0.2s",

                cursor: "pointer",
                "@keyframes bounce": {
                  "0%": { transform: "translateY(-300px)" },
                  "20%": { transform: "translateY(0)" },
                  "30%": { transform: "translateY(-30px)" },
                  "40%": { transform: "translateY(0px)" },
                  "100%": { transform: "translateY(0)" },
                },

                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.05)" },
                  "100%": { transform: "scale(1)" },
                },

                // Apply dynamic animations based on state
                animation: `${
                  animation === "bounce" ? "bounce" : "pulse"
                } 1s ease infinite`,

                "&:hover": {
                  color: "white",
                  background: "#f34c89",
                  transform: "scale(1.05)",
                  boxShadow: "1px 1px 10px #000",
                  animation: "none",
                },
              }}
              onClick={() => {
                setEnableGame(true);
              }}
            >
              Start Game
            </Button>
          </Box>
          snake_game_background
          <audio
            ref={backgroundAudioRef}
            src="/music/snake_game_background.mp3"
            loop
          />
        </Box>
      )}
    </Box>
  );
};

export default SnakeGame;
