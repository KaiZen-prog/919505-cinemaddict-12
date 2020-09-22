const KEY_CODE_ESCAPE = 27;

const CHAR_BAR_HEIGHT = 50;

const CARDS_QUANTITY = 5;
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
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
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

export {
  KEY_CODE_ESCAPE,
  CHAR_BAR_HEIGHT,
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
  ProfileRating
};
