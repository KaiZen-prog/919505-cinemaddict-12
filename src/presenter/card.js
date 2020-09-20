import CardView from "../view/card.js";
import FilmPopupView from "../view/film-popup.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {USER_ACTION, UPDATE_TYPE} from "../const";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const INDEX_BODY = document.querySelector(`body`);

export default class Card {
  constructor(cardContainer, changeData, changeMode) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
    this._handlePopupCloseClick = this._handlePopupCloseClick.bind(this);
    this._handlePopupCloseKeyDown = this._handlePopupCloseKeyDown.bind(this);

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToHistoryClick = this._handleAddToHistoryClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._cardComponent;
    const prevFilmPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(this._film);
    this._popupComponent = new FilmPopupView(this._film);

    this._cardComponent.setClickHandler(this._handlePopupOpenClick);
    this._cardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._cardComponent.setAddToHistoryClickHandler(this._handleAddToHistoryClick);
    this._cardComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);

    if (prevFilmComponent === null) {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._popupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  _handlePopupOpenClick() {
    render(INDEX_BODY, this._popupComponent, RenderPosition.AFTERBEGIN);

    this._popupComponent.setClosePopupHandler(this._handlePopupCloseClick);
    this._popupComponent.setClosePopupKeydownHandler(this._handlePopupCloseKeyDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  // Обработчики закрытия попапа
  _removePopupComponent() {
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _handlePopupCloseClick(film) {
    this._removePopupComponent();
    this._changeData(USER_ACTION.UPDATE_FILM, UPDATE_TYPE.MINOR, Object.assign({}, film, {
      currentComment: {
        emoji: null
      }
    }));
  }

  _handlePopupCloseKeyDown(evt, film) {
    this._removePopupComponent();
    this._changeData(USER_ACTION.UPDATE_FILM, UPDATE_TYPE.MINOR, Object.assign({}, film, {
      currentComment: {
        emoji: null
      }
    }));
  }

  _handleAddToWatchlistClick() {
    this._changeData(USER_ACTION.UPDATE_FILM, UPDATE_TYPE.MINOR, Object.assign({}, this._film, {
      inWatchlist: !this._film.inWatchlist
    }));
  }

  _handleAddToHistoryClick() {
    this._changeData(USER_ACTION.UPDATE_FILM, UPDATE_TYPE.MINOR, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
    }));
  }

  _handleAddToFavoritesClick() {
    this._changeData(USER_ACTION.UPDATE_FILM, UPDATE_TYPE.MINOR, Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite
    }));
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removePopupComponent();
    }
  }
}
