import {createElement} from "../utils.js";

export const createStatistics = (filmsQuantity) => {
  return (
    `<p>${filmsQuantity} movies inside</p>`
  );
};

export default class StatisticsSection {
  constructor(filmsQuantity) {
    this._filmsQuantity = filmsQuantity;
    this._element = null;
  }

  getTemplate() {
    return createStatistics(this._filmsQuantity);
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
