const KEY_CODE_ESCAPE = 27;

const FILMS_QUANTITY = 20;
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;
const MAX_DESCRIPTION_LENGTH = 140;

const CLICKABLE_CARD_ELEMENTS = [
  `IMG`,
  `H3`,
  `A`
];

const MONTHS = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

const FILTER_ENTRIES = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`
];

const SORTING_ENTRIES = [
  `Sort by default`,
  `Sort by date`,
  `Sort by rating`,
];

const EXTRA_SECTIONS = {
  top: `Top rated`,
  commented: `Most commented`
};

export {
  KEY_CODE_ESCAPE,
  FILMS_QUANTITY,
  FILMS_COUNT_PER_STEP,
  EXTRA_CARDS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  CLICKABLE_CARD_ELEMENTS,
  MONTHS,
  FILTER_ENTRIES,
  SORTING_ENTRIES,
  EXTRA_SECTIONS
};
