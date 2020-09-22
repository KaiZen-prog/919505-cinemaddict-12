import Abstract from "./abstract";

const createCardsContainer = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class CardContainer extends Abstract {
  getTemplate() {
    return createCardsContainer();
  }
}
