import Abstract from "./abstract";
import Api from "../api.js";
import {BackendValues} from "../const";

const SHAKE_ANIMATION_TIMEOUT = 600;

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
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

    api.updateComments(this._data.id, update)
      .then((comments) => {
        delete this._data.comments;
        this._data.comments = comments;
      })
      .then(() => this.updateElement())
      .catch(() => {
        this.shake(this.updateElement.bind(this));
      });
  }

  deleteComment(number) {
    const id = number.split(`-`)[0];
    const index = number.split(`-`)[1];
    api.deleteComment(id)
      .then(() => this._data.comments.splice(index, 1))
      .then(() => this.updateElement())
      .catch(() => {
        this.shake(this.updateElement.bind(this));
      });
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
