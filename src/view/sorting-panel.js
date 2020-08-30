import {SORTING_ENTRIES} from "../const.js";
import Abstract from "./abstract";

const generateSortingElements = () => {
  let sortingList = ``;

  for (let i = 0; i < SORTING_ENTRIES.length; i++) {
    const isActive = SORTING_ENTRIES[i] === `Sort by default`
      ? ` sort__button--active`
      : ``;

    sortingList +=
      `<li>
        <a href="#" class="sort__button${isActive}" data-sort="${SORTING_ENTRIES[i]}">${SORTING_ENTRIES[i]}</a>
      </li>`;
  }

  return sortingList;
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
        ${generateSortingElements()}
    </ul>`
  );
};

export default class Sort extends Abstract {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
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

