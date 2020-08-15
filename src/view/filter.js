import {FILTER_ENTRIES} from '../const.js';

const toggleClassName = (string) =>
  string === FILTER_ENTRIES[0]
    ? ` main-navigation__item--active`
    : ``;


const generateFilterElements = (filters) => {
  let filtersList = ``;

  for (let filter in filters) {
    if (filters.hasOwnProperty(filter)) {
      let isActive = toggleClassName(filter);

      filtersList +=
        `<a href="#${filter}"
            class="main-navigation__item${isActive}">${filter}
        <span class="main-navigation__item-count">${filters[filter].length}</span>
      </a>`;
    }
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
