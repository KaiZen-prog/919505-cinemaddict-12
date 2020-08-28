import Abstract from "./abstract";

const createShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends Abstract {
  getTemplate() {
    return createShowMoreButton();
  }
}
