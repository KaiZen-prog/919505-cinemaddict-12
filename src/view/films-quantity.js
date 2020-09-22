import Abstract from "./abstract";

const createStatistics = (filmsQuantity) => {
  return (
    `<p>${filmsQuantity} movies inside</p>`
  );
};

export default class StatisticsSection extends Abstract {
  constructor(filmsQuantity) {
    super();
    this._filmsQuantity = filmsQuantity;
  }

  getTemplate() {
    return createStatistics(this._filmsQuantity);
  }
}
