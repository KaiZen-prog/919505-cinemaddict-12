import Abstract from "./abstract";

const createMainSection = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmListSection extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createMainSection(this._filmsQuantity);
  }
}
