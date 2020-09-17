import {FILTER_ENTRIES} from '../const.js';

export const filter = {
  [FILTER_ENTRIES.ALL]: (films) => films,
  [FILTER_ENTRIES.WATCHLIST]: (films) => films.filter((film) => film.inWatchlist),
  [FILTER_ENTRIES.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FILTER_ENTRIES.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};
