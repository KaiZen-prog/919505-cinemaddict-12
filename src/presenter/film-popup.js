import FilmPopupView from "../view/film-popup.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {isEscapeDown} from "../utils/common";

import {
  USER_ACTION,
  UPDATE_TYPE
} from "../const.js";

const INDEX_BODY = document.querySelector(`body`);

export default class FilmPopup {
  constructor(film, changeData) {
    this._film = film;
    this._changeData = changeData;

    this._closePopup = this._closePopup.bind(this);
    this._onPopupCloseKeyDown = this._onPopupCloseKeyDown.bind(this);

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleAddToHistoryClick = this._handleAddToHistoryClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
  }

  init() {
    this._popupComponent = new FilmPopupView(this._film, this._changeData);
    render(INDEX_BODY, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickHandler(this._closePopup);
    this._popupComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
    this._popupComponent.setAddToHistoryHandler(this._handleAddToHistoryClick);
    this._popupComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    document.addEventListener(`keydown`, this._onPopupCloseKeyDown);
  }

  // Обработчики закрытия попапа
  _closePopup() {
    let popup = document.querySelector(`.film-details`);
    popup.remove();
    document.removeEventListener(`keydown`, this._onPopupCloseKeyDown);
  }

  _handleAddToWatchListClick(evt) {
    evt.preventDefault();
    this._changeData(
        USER_ACTION.UPDATE_FILM,
        UPDATE_TYPE.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              inWatchlist: !this._film.inWatchlist
            }
        )
    );
    this._resetPopup();
  }

  _handleAddToHistoryClick(evt) {
    evt.preventDefault();
    this._changeData(
        USER_ACTION.UPDATE_FILM,
        UPDATE_TYPE.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
    this._resetPopup();
  }

  _handleAddToFavoritesClick(evt) {
    evt.preventDefault();
    this._changeData(
        USER_ACTION.UPDATE_FILM,
        UPDATE_TYPE.MAJOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
    this._resetPopup();
  }

  _resetPopup() {
    remove(this._popupComponent);
    this.init();
  }

  _onPopupCloseKeyDown(evt) {
    if (isEscapeDown(evt)) {
      this._closePopup();
    }
  }
}

