import {SORTING_ENTRIES} from "../const.js";
import Abstract from "./abstract";


const toggleClassName = (string, currentSort) =>
  string === currentSort
    ? ` sort__button--active`
    : ``;

const generateSortingList = (currentSortType) => {
  let sortingList = ``;

  for (let entry in SORTING_ENTRIES) {
    if ({}.hasOwnProperty.call(SORTING_ENTRIES, entry)) {
      let isActive = toggleClassName(SORTING_ENTRIES[entry], currentSortType);

      sortingList +=
        `<li>
        <a href="#" class="sort__button${isActive}" data-sort-type="${SORTING_ENTRIES[entry]}">${SORTING_ENTRIES[entry]}</a>
      </li>`;
    }
  }

  return sortingList;
};

const createSortTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
        ${generateSortingList(currentSortType)}
    </ul>`
  );
};

export default class Sort extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingTypeChange(evt.target.dataset.sortType);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sortingTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

