import NetflixHome from "@/components/kids-netflix/NetflixHome";
import { Box } from "@mui/material";
import React from "react";

const index = () => {
  return (
    <Box sx={{ padding: 0 }} className="netflix-kids">
      <NetflixHome />
    </Box>
  );
};

export default index;
