import React, { useState, useRef, useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const initBadges = [
  {
    id: 1,
    name: "Ethics",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fethics.png?alt=media&token=f458c815-38f4-4be8-8da6-b291279f056b",
    color: "#97375d",
  },
  {
    id: 2,
    name: "Intelligence",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fintelligence.png?alt=media&token=4fe74703-b3b5-4e8b-83de-324ca4670684",
    color: "#5271ff",
  },
  {
    id: 3,
    name: "SDG Goals",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fsdg.png?alt=media&token=88680c7e-aa1f-40ef-ba09-ef220b67d602",
    color: "#00bf63",
  },
  {
    id: 4,
    name: "Life Skills",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Flifeskills.png?alt=media&token=dabf57b4-3d71-46ee-986e-6ea9846fe249",
    color: "#cb6ce6",
  },
  {
    id: 5,
    name: "Creativity",
    image:
      "https://firebasestorage.googleapis.com/v0/b/vizuaradelta.appspot.com/o/AI%20Labs%2Fnetflix%20kids%2FBadges%2Fcreativity.png?alt=media&token=452d5f47-4d2b-4c3c-bf82-1d1e23bc4bcf",
    color: "#5ce1e6",
  },
];

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  padding: 5px;
  box-shadow: -1px 2px 5px #a6acaf;
`;

const BadgeImage = styled(motion.img)`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  cursor: pointer;
  filter: ${({ active }) => (active ? "none" : "grayscale(100%)")};
`;

const BadgeModal = ({ badge }) => (
  <Box
    sx={{
      bgcolor: "background.paper",
      borderRadius: "10px",
      borderColor: badge.color,
      borderWidth: "10px",
      borderStyle: "solid",
      width: "500px",
      height: "300px",
      position: "fixed",
      top: "30%",
      left: "25%",
      transform: "translate(-50%, -50%)",
      p: 4,
      zIndex: 1000,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", color: badge.color }}>
      {badge.name}
    </Typography>
    <Typography
      variant="body1"
      sx={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
    >
      Information about {badge.name} related to the current project.
    </Typography>
  </Box>
);

const BadgeDisplay = ({ activeBadges = [] }) => {
  const [badges, setBadges] = useState([]);
  const [hoveredBadgeId, setHoveredBadgeId] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (badgeId) => {
    if (activeBadges.includes(badgeId)) {
      clearTimeout(timeoutRef.current);
      setHoveredBadgeId(badgeId);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredBadgeId(null);
    }, 50); // Small delay to prevent flickering
  };
  useEffect(() => {
    const formattedBadges = initBadges.filter(({ id }) => activeBadges.includes(id));
    setBadges([
      ...formattedBadges,
      ...initBadges.filter(({ id }) => !activeBadges.includes(id)),
    ]);
  }, []);
  return (
    <BadgeContainer>
      {badges.map((badge) => (
        <div
          key={badge.id}
          onMouseEnter={() => handleMouseEnter(badge.id)}
          onMouseLeave={handleMouseLeave}
        >
          <BadgeImage
            src={badge.image}
            alt={badge.name}
            active={activeBadges.includes(badge.id)}
            animate={{ scale: hoveredBadgeId === badge.id ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
      ))}
      <AnimatePresence>
        {hoveredBadgeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BadgeModal badge={badges.find((b) => b.id === hoveredBadgeId)} />
          </motion.div>
        )}
      </AnimatePresence>
    </BadgeContainer>
  );
};

export default BadgeDisplay;
