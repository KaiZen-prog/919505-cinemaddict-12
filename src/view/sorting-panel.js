import {SORTING_ENTRIES} from "../const.js";
import Abstract from "./abstract";

const generateSortingList = () => {
  let sortingList = ``;

  for (let entry in SORTING_ENTRIES) {
    if ({}.hasOwnProperty.call(SORTING_ENTRIES, entry)) {
      const isActive = SORTING_ENTRIES[entry] === `Sort by default`
        ? ` sort__button--active`
        : ``;

      sortingList +=
        `<li>
        <a href="#" class="sort__button${isActive}" data-sort-btn="${SORTING_ENTRIES[entry]}">${SORTING_ENTRIES[entry]}</a>
      </li>`;
    }
  }

  return sortingList;
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
        ${generateSortingList()}
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

