import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval.js";
import {
  // CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Swal from "sweetalert2";
import { KeyboardBackspace } from "@mui/icons-material";
const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return (
      <Typography variant="h5" color="#CCD1D1" align="center">
        {`Time's Up`}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" color="#CCD1D1" align="center">
        Remaining
      </Typography>
      <Typography
        variant="h2"
        color="#F9E79F"
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        {remainingTime}
      </Typography>
      <Typography variant="h5" color="#CCD1D1" align="center">
        seconds
      </Typography>
    </Box>
  );
};

const GameCanvas = ({
  keyCode,
  paused,
  setPaused,
  CANVAS_SIZE,
  gameOver,
  setGameover,
  goToPreviousPage,
  goToNextPage,
  setEnableGame,
}) => {
  const canvasRef = useRef();
  const moveAudioRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const foodAudioRef = useRef(null);
  const snakeAudioRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0); // Track the score

  // const [gameOver, setGameover] = useState(false);

  const togglePause = () => {
    setPaused((prevPaused) => !prevPaused);
  };
  const startGame = () => {
    snakeAudioRef?.current?.play();
    setStarted(true);
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameover(false);
    setPaused(true);
    setRound((prev) => prev + 1);
    setScore(0); // Reset score when starting a new game
  };

  const endGame = () => {
    snakeAudioRef?.current?.pause();
    gameOverAudioRef.current.play();
    setSpeed(null);
    setGameover(true);
    setPaused(false);
    // setStarted(false);
  };

  const moveSnake = (keyCode) => {
    moveAudioRef.current.play();
    setDir((prev) => {
      if (
        prev[0] === -DIRECTIONS[keyCode][0] ||
        prev[1] === -DIRECTIONS[keyCode][1]
      ) {
        return prev;
      } else {
        return DIRECTIONS[keyCode];
      }
    });
  };

  const createApple = () =>
    apple.map((_, i) => Math.floor((Math.random() * CANVAS_SIZE[i]) / SCALE));

  const checkCollision = (piece, snk = snake) => {
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      foodAudioRef.current.play();
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      setScore((prevScore) => prevScore + 5);

      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const limit = CANVAS_SIZE[0] / SCALE;
    const newSnakeHead = [
      (snakeCopy[0][0] + dir[0] + limit) % limit,
      (snakeCopy[0][1] + dir[1] + limit) % limit,
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  useEffect(() => {
    if (paused) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "green";
    // snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    snake.forEach(([x, y], index) => {
      context.fillStyle = index === 0 ? "#E74C3C" : "yellow";

      // If it's the 0th index, draw a rounded shape
      if (index === 0) {
        const headSize = 0.6; // Adjust the size as needed
        context.beginPath();
        context.arc(x + 0.5, y + 0.5, headSize, 0, 2 * Math.PI);
        context.fill();

        // Draw the face in the direction specified by the dir state
        const [dirX, dirY] = dir;
        const faceX = x + 0.5 + (headSize / 2) * dirX;
        const faceY = y + 0.5 + (headSize / 2) * dirY;
        context.fillStyle = "white";
        context.beginPath();
        context.arc(faceX, faceY, 0.1, 0, 2 * Math.PI);
        context.fill();
      } else {
        context.fillRect(x, y, 1, 1);
      }
    });
    context.fillStyle = "#58D68D";
    const appleSize = 0.9; // Adjust the size of the apple as needed
    context.beginPath();
    context.arc(apple[0] + 0.5, apple[1] + 0.5, appleSize, 0, 2 * Math.PI);
    context.fill();
  }, [snake, apple, gameOver]);

  useInterval(() => {
    if (!paused && started) {
      gameLoop();
    }
  }, speed);

  useEffect(() => {
    moveSnake(keyCode);
  }, [keyCode]);

  useEffect(() => {
    Swal.fire({
      title: "So, are you ready?",
      confirmButtonText: "Yes",
      allowOutsideClick: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        startGame();
      }
    });
  }, []);

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <IconButton
        aria-label=""
        onClick={() => setEnableGame(false)}
        sx={{ ml: 1, color: "#fff" }}
      >
        <KeyboardBackspace fontSize="large" color="#000" />
      </IconButton>
      {started && (
        <Box
          sx={{
            position: "absolute",
            left: "50px",
            top: "90px",
            zIndex: 50,
            transform: {
              xs: "scale(0.5)",
              md: "scale(0.9)",
              lg: "scale(1)",
            },
          }}
        >
          <CountdownCircleTimer
            key={round}
            isPlaying
            duration={60}
            size={220}
            strokeWidth={10}
            colors={["#00ff00", "#F1C40F", "#FF0000"]}
            colorsTime={[30, 15, 0]}
            onComplete={() => {
              endGame();
              return { shouldRepeat: false, delay: 1.5 }; // repeat animation in 1.5 seconds
            }}
          >
            {renderTime}
          </CountdownCircleTimer>
        </Box>
      )}
      {started && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "140px",
          }}
        >
          <Typography variant="h5" color="#3498db" sx={{ fontWeight: "bold" }}>
            Round: {round}
          </Typography>
          <Typography variant="h3" color="#fff" sx={{ fontWeight: "bold" }}>
            Score: {score}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 5,
          py: 2,
        }}
      >
        {gameOver && (
          <Button
            onClick={startGame}
            sx={{
              color: "white",
              background: "#3498db",
              fontWeight: "bold",
              textTransform: "none",
              letterSpacing: "1px",
              borderRadius: "20px",
              border: "2px solid #3498db",
              boxShadow: "1px 1px 10px #000",
              px: 5,
              py: 2,
              my: 1,
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
          >
            Play Again
          </Button>
        )}
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          role="button"
          tabIndex="0"
          style={{
            position: "relative",
          }}
        >
          <canvas
            style={{
              // border: "1px solid #fff",
              boxShadow: "1px 2px 10px #000",
              borderRadius: "20px",
              background: "#212F3D",
            }}
            ref={canvasRef}
            width={`${CANVAS_SIZE[0]}px`}
            height={`${CANVAS_SIZE[1]}px`}
          />

          {gameOver && (
            <div>
              <img
                style={{
                  width: `${CANVAS_SIZE[0]}px`,
                  height: `${CANVAS_SIZE[1]}px`,
                  objectFit: "cover",
                  position: "absolute",
                  top: "0px",
                  borderRadius: "10px",
                }}
                src="https://media.tenor.com/JQrmlsnouqMAAAAC/snake-game-over.gif"
                alt="game-over"
              />
            </div>
          )}

          <audio ref={moveAudioRef} src="/music/move.mp3" />
          <audio ref={gameOverAudioRef} src="/music/gameover.mp3" />
          <audio ref={foodAudioRef} src="/music/food.mp3" />
          <audio ref={snakeAudioRef} src="/music/snake_rattling.mp3" loop />
        </div>
      </div>
    </Box>
  );
};

export default GameCanvas;
