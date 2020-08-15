import {FILMS_QUANTITY, FILTER_ENTRIES} from "../const.js";
import {getRandomBool} from "../utils";

const toggleClassName = (string) =>
  string === `Sort by default`
    ? ` main-navigation__item--active`
    : ``;

const getFilmNumbers = (string, films) => {
  let number;
  switch (string) {
    case `All movies`:
      number = films.length;
      break;

    case `Watchlist`:
      number = films.filter((film) => !film.inWatchlist).length;
      break;

    case `History`:
      number = films.filter((film) => !film.isWatched).length;
      break;

    case `Favorites`:
      number = films.filter((film) => !film.isFavorite).length;
      break;
  }

  return number;
};

const generateFilterElements = (films) => {
  let filtersList = ``;

  for (let i = 0; i < FILTER_ENTRIES.length; i ++) {
    let isActive = toggleClassName(FILTER_ENTRIES[i]);
    let quantity = getFilmNumbers(FILTER_ENTRIES[i], films);

    filtersList +=
      `<a href="#${FILTER_ENTRIES[i]}"
            class="main-navigation__item${isActive}">${FILTER_ENTRIES[i]}
        <span class="main-navigation__item-count">${quantity}</span>
      </a>`;
  }

  return filtersList;
};

export const createMainMenuTemplate = (films) => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${generateFilterElements(films)}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

//  inWatchlist: getRandomBool(),
//  isWatched: getRandomBool(),
//  isFavorite: getRandomBool(),

