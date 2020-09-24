import {
  getRandomArrayElement,
  getRandomBool,
  getRandomInteger,
  getRandomSet,
  addSpaceToStrings,
  getRandomDate,
  generateId
} from "../utils/common.js";

import {CARDS_QUANTITY} from "../const";
import moment from "moment";

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
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const EMOJIS = [
  `angry`,
  `puke`,
  `sleeping`,
  `smile`
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

const CURRENT_DATE = new Date();
const TWO_YEARS_BEFORE = moment(CURRENT_DATE).subtract(2, `years`).toDate();

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
  id: generateId(),
  filmId: null,
  emoji: getRandomArrayElement(EMOJIS),
  text: description.split(`.`, getRandomInteger(1, 5)).toString(),
  author: getRandomArrayElement(CREATORS),
  date: Date.now() - getRandomInteger(0, 30 * 24 * 60 * 60 * 1000),
});

const getComments = (num) => Array.from({length: num}, generateComment);

const generateCurrentComment = () => {
  return {
    text: null,
    emoji: null,
    author: null,
    date: null
  };
};

const generateFilm = () => ({
  title: getRandomArrayElement(titles),
  director: getRandomArrayElement(CREATORS),
  writers: setWriters(),
  actors: setActors(),
  poster: getRandomArrayElement(posters),
  rating: getRandomInteger(10, 100) / 10,
  releaseDate: getRandomDate(new Date(1930, 1, 1), new Date(2019, 12, 31)),
  country: getRandomArrayElement(COUNTRIES),
  duration: getRandomInteger(10, 180),
  genres: setGenres(),
  ageLimit: getRandomArrayElement(AGE_LIMITS),
  description: description.split(`.`, getRandomInteger(1, 5)).toString(),
  inWatchlist: getRandomBool(),
  isWatched: getRandomBool(),
  isFavorite: getRandomBool(),
  comments: getComments(getRandomInteger(0, 5)),
  currentComment: generateCurrentComment(),
  watchingDate: getRandomDate(CURRENT_DATE, TWO_YEARS_BEFORE),
  emojiSrc: ``,
  id: ``
});

export const getFilms = () => {
  const films = [];
  for (let i = 0; i < CARDS_QUANTITY; i++) {
    let newFilm = generateFilm();
    let id = i + 1;
    newFilm.id = `film-` + id;
    films.push(newFilm);
  }

  return films;
};
