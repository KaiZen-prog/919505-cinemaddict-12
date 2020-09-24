import Api from "../api.js";
import CardView from "../view/card.js";
import FilmPopupView from "../view/film-popup.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType, CardMode, BackendValues} from "../const";

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);
const INDEX_BODY = document.querySelector(`body`);

export default class Card {
  constructor(cardContainer, changeData, changeMode) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._popupComponent = null;
    this._mode = CardMode.DEFAULT;

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

    api.getComments(this._film)
      .then((result) => {
        this._popupComponent = new FilmPopupView(result);
      });

    this._cardComponent = new CardView(this._film);

    this._cardComponent.setClickHandler(this._handlePopupOpenClick);
    this._cardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._cardComponent.setAddToHistoryClickHandler(this._handleAddToHistoryClick);
    this._cardComponent.setAddToFavoritesClickHandler(this._handleAddToFavoritesClick);

    if (prevFilmComponent === null) {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === CardMode.DEFAULT) {
      replace(this._cardComponent, prevFilmComponent);
    }

    if (this._mode === CardMode.POPUP) {
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
    this._mode = CardMode.POPUP;
  }

  // Обработчики закрытия попапа
  _removePopupComponent() {
    remove(this._popupComponent);
    this._mode = CardMode.DEFAULT;
  }

  _handlePopupCloseClick(film) {
    this._removePopupComponent();
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, film, {
      currentComment: {
        emoji: null
      }
    }));
  }

  _handlePopupCloseKeyDown(evt, film) {
    this._removePopupComponent();
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, film, {
      currentComment: {
        emoji: null
      }
    }));
  }

  // контролы
  _handleAddToWatchlistClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      inWatchlist: !this._film.inWatchlist
    }));
  }

  _handleAddToHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      isWatched: !this._film.isWatched
    }));
  }

  _handleAddToFavoritesClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      isFavorite: !this._film.isFavorite
    }));
  }

  // Удаление и перезапуск
  destroy() {
    remove(this._cardComponent);

    if (this._popupComponent !== null) {
      remove(this._popupComponent);
    }
  }

  resetView() {
    if (this._mode !== CardMode.DEFAULT) {
      this._removePopupComponent();
    }
  }
}
