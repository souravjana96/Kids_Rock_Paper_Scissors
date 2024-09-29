const CANVAS_SIZE = [300, 300];
const SNAKE_START = [
  [8, 7],
  [8, 8],
  [8, 9],
  [8, 10],
  [8, 11],
  [8, 12],
];
const APPLE_START = [8, 3];
const SCALE = 10;
const SPEED = 60;
const DIRECTIONS = {
  0: [-1, 0], // left
  1: [1, 0], // right
  2: [0, -1], // up
  3: [0, 1], // down
};

export { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS };
