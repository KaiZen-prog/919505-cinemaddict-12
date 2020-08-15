const toggleClassName = (string) =>
  string === `Sort by default`
    ? ` main-navigation__item--active`
    : ``;
/*
const getFilmNumbers = (string, filter) => {
  let number;
  switch (string) {
    case `All movies`:
      number = filter.count;
      break;

    case `Watchlist`:
      number = 1;
      break;

    case `History`:
      number = 2;
      break;

    case `Favorites`:
      number = 3;
      break;
  }

  return number;
};
*/

const generateFilterElements = (filters) => {
  let filtersList = ``;

  for (let filter in filters) {
    let isActive = toggleClassName(filter.name);

    filtersList +=
      `<a href="#${filter.name}"
            class="main-navigation__item${isActive}">${filter.name}
        <span class="main-navigation__item-count">${filter.count}</span>
      </a>`;
  }

  return filtersList;
};

export const createFilterTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${generateFilterElements(filters)}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
