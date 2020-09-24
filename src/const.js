const KEY_CODE_ESCAPE = 27;

const CARDS_QUANTITY = 25;
const CARDS_COUNT_PER_STEP = 5;
const SPECIAL_CARDS_COUNT = 2;
const MAX_DESCRIPTION_LENGTH = 140;

const ClickableHTMLElements = {
  IMG: `IMG`,
  H3: `H3`,
  A: `A`
};

const SortingEntries = {
  DEFAULT: `Sort by default`,
  DATE: `Sort by date`,
  RATING: `Sort by rating`,
};

const CardMode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

const ExtraSections = {
  top: `Top rated`,
  commented: `Most commented`
};

const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`
};

const UpdateType = {
  INIT: `INIT`,
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const MenuItem = {
  FILMS: `FILMS`,
  STATISTICS: `STATISTICS`
};

const ProfileRating = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const StatisticsFilters = {
  ALL_TIME: `statistic-all-time`,
  TODAY: `statistic-today`,
  WEEK: `statistic-week`,
  MONTH: `statistic-month`,
  YEAR: `statistic-year`
};

const StatisticsValues = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const StatisticsLabels = {
  ALL_TIME: `All time`,
  TODAY: `Today`,
  WEEK: `Week`,
  MONTH: `Month`,
  YEAR: `Year`
};


export {
  KEY_CODE_ESCAPE,
  CARDS_QUANTITY,
  CARDS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  ClickableHTMLElements,
  CardMode,
  FilterType,
  SortingEntries,
  ExtraSections,
  UserAction,
  UpdateType,
  ProfileRating,
  StatisticsFilters,
  StatisticsValues,
  StatisticsLabels
};
