import {createElement} from "../utils.js";

const createMainSection = () => {
  return (
    `<section class="films">
        <section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        </section>
    </section>`
  );
};

export default class MainSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainSection();
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
