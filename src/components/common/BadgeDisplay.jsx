import React, { useState, useRef, useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

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
      borderColor: badge?.color,
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
    <Typography variant="h6" sx={{ fontWeight: "bold", color: badge?.color }}>
      {badge?.name}
    </Typography>
    <Typography
      variant="body1"
      sx={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }}
    >
      {badge?.message}
    </Typography>
  </Box>
);

const BadgeDisplay = ({ activeBadges = [], initBadges = [] }) => {
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
    const formattedBadges = initBadges?.filter(({ id }) =>
      activeBadges?.includes(id)
    );
    setBadges([
      ...formattedBadges,
      ...initBadges.filter(({ id }) => !activeBadges.includes(id)),
    ]);
  }, [initBadges]);
  return (
    <BadgeContainer>
      {badges.map((badge) => (
        <div
          key={badge?.id}
          onMouseEnter={() => handleMouseEnter(badge?.id)}
          onMouseLeave={handleMouseLeave}
        >
          <BadgeImage
            src={badge?.image}
            alt={badge?.name}
            active={activeBadges.includes(badge?.id)}
            animate={{ scale: hoveredBadgeId === badge?.id ? 1.2 : 1 }}
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
