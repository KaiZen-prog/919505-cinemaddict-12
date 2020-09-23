import moment from "moment";

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
