import AbstractView from "./abstract";
import {SORTING_ENTRIES, CLICKABLE_HTML_ELEMENTS, SORTING_OPTION_CLASSES} from "../const";

const createMainSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="${SORTING_OPTION_CLASSES.DEFAULT}" data-sort-type="${SORTING_ENTRIES.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="${SORTING_OPTION_CLASSES.DEFAULT}" data-sort-type="${SORTING_ENTRIES.DATE}">Sort by date</a></li>
      <li><a href="#" class="${SORTING_OPTION_CLASSES.DEFAULT}" data-sort-type="${SORTING_ENTRIES.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortView extends AbstractView {
  constructor() {
    super();
    this._callback = {};
    this._sortTypeHandler = this._sortTypeHandler.bind(this);
  }
  getTemplate() {
    return createMainSortTemplate();
  }

  _sortTypeHandler(evt) {
    if (evt.target.tagName !== CLICKABLE_HTML_ELEMENTS.A) {
      return;
    }
    evt.preventDefault();
    this._callback.sort(evt.target.dataset.sortType);

    const sortButtonsElements = this.getElement().querySelectorAll(`.sort__button`);
    sortButtonsElements.forEach((currentElement) => {
      if (currentElement.classList.contains(`sort__button--active`)) {
        currentElement.classList.remove(`sort__button--active`);
      }
    });
    evt.target.classList.add(`sort__button--active`);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sort = callback;
    this.getElement().addEventListener(`click`, this._sortTypeHandler);
  }
}
