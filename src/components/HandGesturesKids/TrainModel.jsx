import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import loading_cat_animation from "../../../public/lotties/common/loading_cat.json";
import Lottie from "lottie-react";

const TrainModel = ({
  tf,
  model,
  mobileNet,
  trainingDataInputs,
  trainingDataOutputs,
  samples,
  setIsModelTrained,
  goToNextPage,
}) => {
  const [open, setOpen] = useState(0);
  const [totalEpoch, setTotalEpoch] = useState(20);
  const [batchSize, setBatchSize] = useState(16);
  const [completedEpoch, setCompletedEpoch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToTrain, setIsReadyToTrain] = useState(false);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  function logProgress(epoch, logs) {
    setCompletedEpoch(epoch + 1);
  }

  const trainModel = async () => {
    // let predict = false;
    try {
      tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);

      let outputsAsTensor = tf.tensor1d(trainingDataOutputs, "int32");
      let oneHotOutputs = tf.oneHot(outputsAsTensor, samples.length);
      let inputsAsTensor = tf.stack(trainingDataInputs);

      let results = await model.fit(inputsAsTensor, oneHotOutputs, {
        shuffle: true,
        batchSize,
        epochs: totalEpoch,
        callbacks: { onEpochEnd: logProgress },
      });

      outputsAsTensor.dispose();
      oneHotOutputs.dispose();
      inputsAsTensor.dispose();

      // predict = true;
      console.log("Training complete", results);
      setIsModelTrained(true);
      setIsLoading(false);
      goToNextPage();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleTrainModel = () => {
    setIsLoading(true);
    trainModel();
  };
  useEffect(() => {
    let flag = true;
    samples.map(({ images }) => {
      if (images.length === 0) flag = false;
    });
    setIsReadyToTrain(flag && samples.length > 1);
  }, [samples]);
  return (
    <Box
      sx={{
        width: "350px",
        minHeight: "300px",
        maxWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
      }}
    >
      {!isLoading ? (
        <Box>
          <Button
            disabled={isLoading || !isReadyToTrain}
            onClick={handleTrainModel}
            sx={{
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              letterSpacing: "1px",
              borderRadius: "20px",
              border: "2px solid #f34c89",
              boxShadow: "1px 1px 10px #f34c89",
              px: 5,
              py: 2,
              my: 1,
              fontSize: "20px",
              transition: "background 0.2s, transform 0.2s",
              background: isLoading || !isReadyToTrain ? "#B2BABB" : "#f34c89",
              cursor: isLoading || !isReadyToTrain ? "not-allowed" : "pointer",

              "&:hover": {
                background: "#fff",
                color: "#f34c89",
                transform: "scale(1.05)",
                boxShadow: "1px 1px 10px #000",
              },
            }}
          >
            {isLoading ? "Wait..." : "Next"}
          </Button>
        </Box>
      ) : (
        <Lottie
          animationData={loading_cat_animation}
          loop={true}
          style={{
            width: "200px",
            margin: "auto",
            maxWidth: "100%",
          }}
        />
      )}
    </Box>
  );
};

export default TrainModel;
