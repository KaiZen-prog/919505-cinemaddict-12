import FilmPopupView from "../view/film-popup.js";
import {render, RenderPosition} from "../utils/render.js";
import {isEscapeDown} from "../utils/common";
const INDEX_BODY = document.querySelector(`body`);

export default class FilmPopup {
  constructor(film, changeData) {
    this._film = film;
    this._changeData = changeData;

    this._closePopup = this._closePopup.bind(this);
    this._onPopupCloseKeyDown = this._onPopupCloseKeyDown.bind(this);
  }

  init() {
    this._popupComponent = new FilmPopupView(this._film);
    render(INDEX_BODY, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickHandler(this._closePopup);
    document.addEventListener(`keydown`, this._onPopupCloseKeyDown);
  }

  // Обработчики закрытия попапа
  _closePopup() {
    let popup = document.querySelector(`.film-details`);
    popup.remove();
    document.removeEventListener(`keydown`, this._onPopupCloseKeyDown);
  }

  _onPopupCloseKeyDown(evt) {
    if (isEscapeDown(evt)) {
      this._closePopup();
    }
  }
}

