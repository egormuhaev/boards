const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomColor = (colors: string[]) => {
  return "#" + colors[getRandomInt(0, colors.length - 1)];
};
