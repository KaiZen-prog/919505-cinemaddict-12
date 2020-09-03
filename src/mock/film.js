import {
  getRandomArrayElement,
  getRandomBool,
  getRandomInteger,
  getRandomSet,
  addSpaceToStrings,
  getRandomDate
} from "../utils/common.js";

import {FILMS_QUANTITY} from "../const";

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
  let hours = Math.floor(duration / 60) + `h`;
  let minutes = duration % 60 + `m`;

  if (Math.floor(duration / 60) === 0) {
    hours = ``;
  }

  if (duration % 60 === 0) {
    minutes = ``;
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
  text: getRandomArrayElement(description),
  author: getRandomArrayElement(CREATORS),
  date: Date.now() - getRandomInteger(0, 30 * 24 * 60 * 60 * 1000),
});

const getComments = (num) => Array.from({length: num}, generateComment);

const generateFilm = () => ({
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
  description: description.split(`.`, getRandomInteger(1, 5)),
  inWatchlist: getRandomBool(),
  isWatched: getRandomBool(),
  isFavorite: getRandomBool(),
  comments: getComments(getRandomInteger(0, 5)),
  id: ``
});

export const getFilms = () => {
  const films = [];
  for (let i = 0; i < FILMS_QUANTITY; i++) {
    let newFilm = generateFilm();
    newFilm.id = `film-` + i;
    films.push(newFilm);
  }

  return films;
};
