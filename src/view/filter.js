import {FILTER_ENTRIES} from '../const.js';
import Abstract from "./abstract";

const toggleClassName = (string) =>
  string === FILTER_ENTRIES.ALL
    ? ` main-navigation__item--active`
    : ``;


const generateFilterElements = (filters) => {
  let filtersList = ``;

  for (let filter in filters) {
    if (filters.hasOwnProperty(filter)) {
      let isActive = toggleClassName(filter);

      filtersList +=
        `<a href="#${filter}" class="main-navigation__item${isActive}" data-filter="${filter}">
            ${filter}<span class="main-navigation__item-count">${filters[filter].length}</span>
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

export default class Filter extends Abstract {
  constructor(filters) {
    super();
    this._filters = filters;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
