import Abstract from "./abstract";

const createMainSection = (filmsQuantity) => {
  return (
    `<section class="films">
        <section class="films-list">
            ${filmsQuantity > 0
      ? `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
      : `<h2 class="films-list__title">There are no movies in our database</h2>`}
        </section>
    </section>`
  );
};

export default class FilmsListSection extends Abstract {
  constructor(filmsQuantity) {
    super();
    this._filmsQuantity = filmsQuantity;
  }

  getTemplate() {
    return createMainSection(this._filmsQuantity);
  }
}
