import Abstract from "./abstract.js";

export default class Loading extends Abstract {
  getTemplate() {
    return `<h2 class="films-list__title">
    Loading...
  </h2>`;
  }
}
