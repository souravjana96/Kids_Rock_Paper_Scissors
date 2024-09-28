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
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardBackspace,
} from "@mui/icons-material";
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
    const headX = newSnake[0][0];
    const headY = newSnake[0][1];
    const appleX = apple[0];
    const appleY = apple[1];

    const distanceX = Math.abs(headX - appleX);
    const distanceY = Math.abs(headY - appleY);

    const collisionDistance = 1.5; // Set tolerance for eating the apple
    if (distanceX < collisionDistance && distanceY < collisionDistance) {
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
    // Loop through each part of the snake body
    snake.forEach(([x, y], index) => {
      // Adjust head size (bigger for the head)
      const headSize = index === 0 ? 1.0 : 0.9; // Head is bigger

      // Different color for head and body
      context.fillStyle = index === 0 ? "#E74C3C" : "yellow"; // Red for head, yellow for body

      // Draw the head of the snake
      if (index === 0) {
        // Center the head properly
        context.beginPath();
        context.arc(x + 0.5, y + 0.5, headSize, 0, 2 * Math.PI);
        context.fill();

        // Draw eyes based on the current direction
        const [dirX, dirY] = dir;

        // Adjust eye positions based on the direction (this fixes tilt)
        let eyeOffsetX1, eyeOffsetY1, eyeOffsetX2, eyeOffsetY2;

        if (dirX === 1) {
          // Moving right
          eyeOffsetX1 = 0.3;
          eyeOffsetY1 = 0.2;
          eyeOffsetX2 = 0.3;
          eyeOffsetY2 = -0.2;
        } else if (dirX === -1) {
          // Moving left
          eyeOffsetX1 = -0.3;
          eyeOffsetY1 = 0.2;
          eyeOffsetX2 = -0.3;
          eyeOffsetY2 = -0.2;
        } else if (dirY === 1) {
          // Moving down
          eyeOffsetX1 = 0.2;
          eyeOffsetY1 = 0.3;
          eyeOffsetX2 = -0.2;
          eyeOffsetY2 = 0.3;
        } else {
          // Moving up
          eyeOffsetX1 = 0.2;
          eyeOffsetY1 = -0.3;
          eyeOffsetX2 = -0.2;
          eyeOffsetY2 = -0.3;
        }

        // Draw the two eyes on the head
        context.fillStyle = "white";
        context.beginPath();
        context.arc(
          x + 0.5 + eyeOffsetX1,
          y + 0.5 + eyeOffsetY1,
          0.15,
          0,
          2 * Math.PI
        ); // First eye
        context.arc(
          x + 0.5 + eyeOffsetX2,
          y + 0.5 + eyeOffsetY2,
          0.15,
          0,
          2 * Math.PI
        ); // Second eye
        context.fill();
      } else if (index === snake.length - 1) {
        // Draw the tail (triangular shape and thinner)
        context.fillStyle = "yellow"; // Tail color is yellow

        // Tail shape as a triangle
        context.beginPath();
        const [prevX, prevY] = snake[index - 1]; // Previous segment coordinates

        // Calculate direction from second last to tail segment
        const tailDirX = x - prevX;
        const tailDirY = y - prevY;

        // Define the points for the triangle (tail)
        let tailTipX, tailTipY, baseLeftX, baseLeftY, baseRightX, baseRightY;

        if (tailDirX === 1) {
          // Tail going right
          tailTipX = x + 1;
          tailTipY = y + 0.5; // Triangle tip
          baseLeftX = x;
          baseLeftY = y + 0.3; // Triangle base left
          baseRightX = x;
          baseRightY = y + 0.7; // Triangle base right
        } else if (tailDirX === -1) {
          // Tail going left
          tailTipX = x;
          tailTipY = y + 0.5; // Triangle tip
          baseLeftX = x + 1;
          baseLeftY = y + 0.3; // Triangle base left
          baseRightX = x + 1;
          baseRightY = y + 0.7; // Triangle base right
        } else if (tailDirY === 1) {
          // Tail going down
          tailTipX = x + 0.5;
          tailTipY = y + 1; // Triangle tip
          baseLeftX = x + 0.3;
          baseLeftY = y; // Triangle base left
          baseRightX = x + 0.7;
          baseRightY = y; // Triangle base right
        } else {
          // Tail going up
          tailTipX = x + 0.5;
          tailTipY = y; // Triangle tip
          baseLeftX = x + 0.3;
          baseLeftY = y + 1; // Triangle base left
          baseRightX = x + 0.7;
          baseRightY = y + 1; // Triangle base right
        }

        // Draw the triangle
        context.moveTo(tailTipX, tailTipY); // Tip of the triangle
        context.lineTo(baseLeftX, baseLeftY); // Left corner of the base
        context.lineTo(baseRightX, baseRightY); // Right corner of the base
        context.closePath();
        context.fill();
      } else {
        // Draw the body normally
        context.fillRect(x, y, 1, 1);
      }
    });

    context.fillStyle = "#58D68D";
    const appleSize = 1.5; // Adjust the size of the apple as needed
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

      {gameOver && (
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
              py: 1,
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
      )}

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
