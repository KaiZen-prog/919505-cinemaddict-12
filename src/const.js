import {nanoid} from "nanoid";

export const BackendValues = {
  AUTHORIZATION: `Basic ` + nanoid(),
  END_POINT: `https://12.ecmascript.pages.academy/cinemaddict`
};

export const StoreValues = {
  STORE_PREFIX: `cinemaddict-localstorage`,
  STORE_VER: `v12`,
  STORE_NAME: `${StoreValues.STORE_PREFIX}-${StoreValues.STORE_VER}`
};

export const KEY_CODE_ESCAPE = 27;
export const KEY_CODE_CTRL = 13;
export const KEY_CODE_ENTER = 10;

export const CARDS_COUNT_PER_STEP = 5;
export const SPECIAL_CARDS_COUNT = 2;
export const MAX_DESCRIPTION_LENGTH = 140;

export const ClickableHTMLElements = {
  IMG: `IMG`,
  H3: `H3`,
  A: `A`
};

export const DeleteCommentButtonLabels = {
  DEFAULT: `Delete`,
  ONCLICK: `Deleting...`
};

export const SortingEntries = {
  DEFAULT: `Sort by default`,
  DATE: `Sort by date`,
  RATING: `Sort by rating`,
};

export const CardMode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

export const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

export const ExtraSections = {
  top: `Top rated`,
  commented: `Most commented`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`
};

export const UpdateType = {
  INIT: `INIT`,
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const MenuItem = {
  FILMS: `FILMS`,
  STATISTICS: `STATISTICS`
};

export const ProfileRating = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const StatisticsFilters = {
  ALL_TIME: `statistic-all-time`,
  TODAY: `statistic-today`,
  WEEK: `statistic-week`,
  MONTH: `statistic-month`,
  YEAR: `statistic-year`
};

export const StatisticsValues = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const StatisticsLabels = {
  ALL_TIME: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};
