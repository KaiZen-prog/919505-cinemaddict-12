import Abstract from "./abstract";

const createMainSection = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class MainFilmList extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createMainSection(this._filmsQuantity);
  }
}
