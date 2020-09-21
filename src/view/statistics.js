import Abstract from "./abstract";

const createStatisticsTemplate = () => {
  return (`<h2 class="films-list__title">
    Здесь будет статистика
  </h2>`);
};

export default class Statistics extends Abstract {
  constructor() {
    super();

  }

  getTemplate() {
    return createStatisticsTemplate();
  }
}
