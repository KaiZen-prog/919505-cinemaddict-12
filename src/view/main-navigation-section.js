import Abstract from "./abstract";

const createMainSection = () => {
  return (
    `<nav class="main-navigation"></nav>`
  );
};

export default class MainNavigationSection extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return createMainSection(this._filmsQuantity);
  }
}
