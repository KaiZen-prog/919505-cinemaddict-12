import {FILTER_ENTRIES} from '../const.js';

export const generateFilter = (films) => {
  let filters = {};
  filters[FILTER_ENTRIES[0]] = films.length;
  filters[FILTER_ENTRIES[1]] = films.filter((film) => film.inWatchlist).length;
  filters[FILTER_ENTRIES[2]] = films.filter((film) => film.isWatched).length;
  filters[FILTER_ENTRIES[3]] = films.filter((film) => film.isFavorite).length;

  return filters;
};
