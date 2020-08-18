import {FILTER_ENTRIES} from '../const.js';
import {createElement} from "../utils.js";

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

const createFilterTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${generateFilterElements(filters)}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
