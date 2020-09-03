import {FILTER_ENTRIES} from '../const.js';

export const generateFilter = (films) => {
  let filters = {};
  filters[FILTER_ENTRIES.ALL] = films;
  filters[FILTER_ENTRIES.WATCHLIST] = films.filter((film) => film.inWatchlist);
  filters[FILTER_ENTRIES.HISTORY] = films.filter((film) => film.isWatched);
  filters[FILTER_ENTRIES.FAVORITES] = films.filter((film) => film.isFavorite);

  return filters;
};
