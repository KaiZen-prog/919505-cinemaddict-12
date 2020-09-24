import moment from "moment";
import {ProfileRating} from "../const";

// С помощью moment.js проверям, сколько фильмов
// попадают в диапазон дат
export const getWatchedFilmsInDateRange = (films, dateFrom, dateTo) => {
  const watchedFilms = [];

  films.forEach((film) => {
    if (
      moment(film.watchingDate).isSame(dateFrom) ||
      moment(film.watchingDate).isBetween(dateFrom, dateTo) ||
      moment(film.watchingDate).isSame(dateTo)
    ) {
      watchedFilms.push(film);
    }
  });

  return watchedFilms;
};

export const setProfileRank = (filmsCount) => {
  let rank = ``;

  if (filmsCount <= 10) {
    rank = ProfileRating.NOVICE;
  } else if (filmsCount <= 20) {
    rank = ProfileRating.FAN;
  } else {
    rank = ProfileRating.MOVIE_BUFF;
  }

  return rank;
};
