import {FILTER_ENTRIES} from '../const.js';
import Abstract from "./abstract";

const toggleClassName = (string, currentFilter) =>
  string === currentFilter
    ? ` main-navigation__item--active`
    : ``;

const toggleFilmsQuantity = (count, filter) =>
  filter === FILTER_ENTRIES.ALL
    ? ``
    : `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, count} = filter;

  let isActive = toggleClassName(type, currentFilter);
  return (
    `<a href="#${filter}" class="main-navigation__item${isActive}" data-filter="${type}">
            ${type}${toggleFilmsQuantity(count, type)}
        </a>`
  );
};

const generateFilterElements = (filters, currentFilter) => {
  return filters
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join(``);
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

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
