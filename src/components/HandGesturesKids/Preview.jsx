import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

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
}) => {
  const videoPlayer = useRef(null);
  const streamRef = useRef(null);
  const predictInterval = useRef(null);
  const [predictionOutput, setPredictionOutput] = useState([0, 0, 0]);
  //   const [isChecked, setIsChecked] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  //   const [highestIndex, setHighestIndex] = useState(-1);
  const COLORS = [
    "#008080",
    "#F08080",
    "#58D68D",
    "#F5B041",
    "#5DADE2",
    "#BB8FCE",
  ];

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
    togglePrediction();
  };

  const enableCam = async () => {
    try {
      const stream = await navigator?.mediaDevices?.getUserMedia({
        video: true,
        width: 480,
        height: 600,
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
      // Grab pixels from current VIDEO frame.
      let videoFrameAsTensor = tf.browser.fromPixels(videoPlayer.current);
      // Resize video frame tensor to be 224 x 224 pixels which is needed by MobileNet for input.
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
        const result =
          "Prediction: " +
          highestIndex +
          " with " +
          Math.floor(predictionArray[highestIndex] * 100) +
          "% confidence";
        if (Math.floor(predictionArray[highestIndex] * 100) > 80) {
          setHighestIndex(highestIndex);
          setPredictionOutput(predictionArray);
        }
      });

      // predictInterval.current = window.requestAnimationFrame(predictLoop);
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
      // Add any other cleanup logic if needed
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
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          marginBottom: 1,
          borderRadius: 3,
        }}
      >
        {isModelTrained ? (
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: "bold !important",
                color: "#fff",
                pb: 1,
              }}
            >
              {samples[highestIndex]?.name}
            </Typography>
            <video
              style={{
                clear: "both",
                display: "block",
                background: "black",
                width: "220px",
                height: "220px",
                margin: "8px auto",
                objectFit: "cover",
                transform: "scaleX(-1)",
                borderRadius: "50%",
              }}
              autoPlay
              muted
              ref={videoPlayer}
            ></video>
          </Box>
        ) : (
          <Box sx={{ padding: 2 }}>
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

export default Preview;
