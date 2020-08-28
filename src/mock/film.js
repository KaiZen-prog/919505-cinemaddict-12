import {
  getRandomArrayElement,
  getRandomBool,
  getRandomInteger,
  getRandomSet,
  addSpaceToStrings,
  getRandomDate
} from "../utils/common.js";

const titles = [
  `Made for each other`,
  `Popeye meets Sinbad`,
  `Sagebrush trail`,
  `Santa Claus conquers the martians`,
  `The dance of life`,
  `The great flamarion`,
  `The man with the golden arm`
];

const posters = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`,
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const EMOJIS = [
  `/images/emoji/angry.png`,
  `/images/emoji/puke.png`,
  `/images/emoji/sleeping.png`,
  `/images/emoji/smile.png`
];

const GENRES = [
  `Cartoon`,
  `Comedy`,
  `Drama`,
  `Film-Noir`,
  `Musical`,
  `Mystery`,
  `Western`,
];

const CREATORS = [
  `Anthony Mann`,
  `Anne Wigton`,
  `Heinz Herald`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`
];

const COUNTRIES = [
  `USA`,
  `Italy`,
  `Russia`,
  `India`,
  `Spain`,
  `France`,
];

const AGE_LIMITS = [6, 12, 16, 18, 21];

const getRandomDuration = function () {
  const duration = getRandomInteger(10, 180);
  let hours;
  let minutes;

  if (Math.floor(duration / 60) === 0) {
    hours = ``;
  } else {
    hours = Math.floor(duration / 60) + `h`;
  }

  if (duration % 60 === 0) {
    minutes = ``;
  } else {
    minutes = duration % 60 + `m`;
  }

  return hours + ` ` + minutes;
};

const setWriters = function () {
  const writers = getRandomSet(CREATORS, getRandomInteger(1, 2));

  return addSpaceToStrings(writers);
};

const setActors = function () {
  const actors = getRandomSet(CREATORS, getRandomInteger(1, 5));

  return addSpaceToStrings(actors);
};

const setGenres = function () {
  const genres = getRandomSet(GENRES, getRandomInteger(1, GENRES.length));

  return addSpaceToStrings(genres);
};

const generateComment = () => ({
  emotion: getRandomArrayElement(EMOJIS),
  text: getRandomArrayElement(descriptions),
  author: getRandomArrayElement(CREATORS),
  date: Date.now() - getRandomInteger(0, 30 * 24 * 60 * 60 * 1000),
});

const getComments = (num) => Array.from({length: num}, generateComment);

export const generateFilm = () => ({
  title: getRandomArrayElement(titles),
  director: getRandomArrayElement(CREATORS),
  writers: setWriters(),
  actors: setActors(),
  poster: getRandomArrayElement(posters),
  rating: getRandomInteger(10, 100) / 10,
  releaseDate: getRandomDate(new Date(1930, 1, 1), new Date(2019, 12, 31)),
  country: getRandomArrayElement(COUNTRIES),
  duration: getRandomDuration(),
  genres: setGenres(),
  ageLimit: getRandomArrayElement(AGE_LIMITS),
  description: getRandomSet(descriptions, getRandomInteger(1, 5)).join(` `),
  inWatchlist: getRandomBool(),
  isWatched: getRandomBool(),
  isFavorite: getRandomBool(),
  comments: getComments(getRandomInteger(0, 5)),
});
