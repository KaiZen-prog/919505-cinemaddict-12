import AbstractView from "./abstract";
import {SORTING_ENTRIES} from "../const";

const createMainSortTemplate = (currentSortType) => {
  return (
    `<ul class="sort">
      <li>
        <a href="#"
           class="sort__button ${currentSortType === SORTING_ENTRIES.DEFAULT ? `sort__button--active` : ``}"
           data-sort-type="${SORTING_ENTRIES.DEFAULT}">
           Sort by default
        </a>
      </li>

      <li>
        <a href="#"
           class="sort__button ${currentSortType === SORTING_ENTRIES.DATE ? `sort__button--active` : ``}"
           data-sort-type="${SORTING_ENTRIES.DATE}">
           Sort by date
        </a>
      </li>

      <li>
        <a href="#"
           class="sort__button ${currentSortType === SORTING_ENTRIES.RATING ? `sort__button--active` : ``}"
           data-sort-type="${SORTING_ENTRIES.RATING}">
           Sort by rating
        </a>
      </li>
    </ul>`
  );
};

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMainSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
