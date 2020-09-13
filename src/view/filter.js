import {FILTER_ENTRIES} from '../const.js';
import Abstract from "./abstract";

const toggleClassName = (string, currentFilter) =>
  string === currentFilter
    ? ` main-navigation__item--active`
    : ``;

const toggleFilmsQuantity = (filters, filter) =>
  filter === FILTER_ENTRIES.ALL
    ? ``
    : `<span class="main-navigation__item-count">${filters[filter].length}</span>`;


const generateFilterElements = (filters, currentFilter) => {
  let filtersList = ``;

  for (let filter in filters) {
    if (filters.hasOwnProperty(filter)) {
      let isActive = toggleClassName(filter, currentFilter);

      filtersList +=
        `<a href="#${filter}" class="main-navigation__item${isActive}" data-filter="${filter}">
            ${filter}${toggleFilmsQuantity(filters, filter)}
        </a>`;
    }
  }

  return filtersList;
};

const createFilterTemplate = (filters, currentFilter) => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${generateFilterElements(filters, currentFilter)}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends Abstract {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
