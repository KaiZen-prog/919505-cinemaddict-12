import {createElement} from "../utils.js";

const createSpecialSection = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class SpecialSection {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createSpecialSection(this._title);
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
