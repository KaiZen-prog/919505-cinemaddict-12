import {SORTING_ENTRIES} from "../const.js";
import {createElement} from "../utils.js";

const generateSortingElements = () => {
  let sortingList = ``;

  for (let i = 0; i < SORTING_ENTRIES.length; i++) {
    const isActive = SORTING_ENTRIES[i] === `Sort by default`
      ? ` sort__button--active`
      : ``;

    sortingList +=
      `<li>
        <a href="#" class="sort__button${isActive}">${SORTING_ENTRIES[i]}</a>
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

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
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

