import Abstract from "./abstract";

const createSpecialSection = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
    </section>`
  );
};

export default class FilmListSectionExtra extends Abstract {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createSpecialSection(this._title);
  }
}
