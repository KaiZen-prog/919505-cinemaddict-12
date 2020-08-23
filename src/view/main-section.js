import {createElement} from "../utils.js";

const toggleTitle = (filmsQuantity) =>
  filmsQuantity > 0
    ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
    : `<h2 class="films-list__title">There are no movies in our database</h2>`;

const createMainSection = (filmsQuantity) => {
  return (
    `<section class="films">
        <section class="films-list">
            ${toggleTitle(filmsQuantity)}
        </section>
    </section>`
  );
};

export default class MainSection {
  constructor(filmsQuantity) {
    this._filmsQuantity = filmsQuantity;
    this._element = null;
  }

  getTemplate() {
    return createMainSection(this._filmsQuantity);
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
