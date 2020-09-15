const KEY_CODE_ESCAPE = 27;

const FILMS_QUANTITY = 20;
const FILMS_COUNT_PER_STEP = 5;
const SPECIAL_CARDS_COUNT = 2;
const MAX_DESCRIPTION_LENGTH = 140;

const CLICKABLE_CARD_ELEMENTS = {
  IMG: `IMG`,
  H3: `H3`,
  A: `A`
};

const SORTING_OPTION_CLASSES = {
  DEFAULT: `sort__button`,
  ACTIVE: `sort__button--active`,
};

const FILTER_OPTION_CLASSES = {
  ACTIVE: `main-navigation__item--active`
};

const FILTER_ENTRIES = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

const SORTING_ENTRIES = {
  DEFAULT: `Sort by default`,
  DATE: `Sort by date`,
  RATING: `Sort by rating`,
};

const EXTRA_SECTIONS = {
  top: `Top rated`,
  commented: `Most commented`
};

export {
  KEY_CODE_ESCAPE,
  FILMS_QUANTITY,
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  CLICKABLE_CARD_ELEMENTS,
  SORTING_OPTION_CLASSES,
  FILTER_OPTION_CLASSES,
  FILTER_ENTRIES,
  SORTING_ENTRIES,
  EXTRA_SECTIONS
};
