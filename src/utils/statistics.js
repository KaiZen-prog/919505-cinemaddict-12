import moment from "moment";

// С помощью moment.js проверям, сколько фильмов
// попадают в диапазон дат
export const countWatchedFilmsInDateRange = (films, dateFrom, dateTo) => {
  return films.reduce((counter, film) => {
    if (
      moment(film.watchingDate).isSame(dateFrom) ||
      moment(film.watchingDate).isBetween(dateFrom, dateTo) ||
      moment(film.watchingDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);
};
