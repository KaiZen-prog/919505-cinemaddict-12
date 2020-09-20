const KEY_CODE_ESCAPE = 27;

const CARDS_QUANTITY = 25;
const CARDS_COUNT_PER_STEP = 5;
const SPECIAL_CARDS_COUNT = 2;
const MAX_DESCRIPTION_LENGTH = 140;

const CLICKABLE_HTML_ELEMENTS = {
  IMG: `IMG`,
  H3: `H3`,
  A: `A`
};

const SORTING_ENTRIES = {
  DEFAULT: `Sort by default`,
  DATE: `Sort by date`,
  RATING: `Sort by rating`,
};

const CARD_MODE = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const FILTER_ENTRIES = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

const EXTRA_SECTIONS = {
  top: `Top rated`,
  commented: `Most commented`
};

const USER_ACTION = {
  UPDATE_FILM: `UPDATE_FILM`
};

const UPDATE_TYPE = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

const PROFILE_RATING = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export {
  KEY_CODE_ESCAPE,
  CARDS_QUANTITY,
  CARDS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  CLICKABLE_HTML_ELEMENTS,
  CARD_MODE,
  FILTER_ENTRIES,
  SORTING_ENTRIES,
  EXTRA_SECTIONS,
  USER_ACTION,
  UPDATE_TYPE,
  PROFILE_RATING
};
