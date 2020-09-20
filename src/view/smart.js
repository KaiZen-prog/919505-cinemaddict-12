import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, dataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (dataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
  }

  updateComments(update) {
    if (!update) {
      return;
    }
    this._data.comments.push(update);
    this.updateElement();
  }

  deleteComment(number) {
    const index = number.split(`-`)[1];
    this._data.comments.splice(index, 1);
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
