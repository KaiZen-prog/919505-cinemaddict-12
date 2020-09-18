import CardView from "../view/card.js";
import {render, replaceCard, remove, RenderPosition} from "../utils/render.js";
import {CLICKABLE_HTML_ELEMENTS, USER_ACTION, UPDATE_TYPE} from "../const";
import FilmPopupView from "../view/film-popup.js";
import {isEscapeDown} from "../utils/common";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};


const INDEX_BODY = document.querySelector(`body`);

export default class FilmCard {
  constructor(cardContainer, changeData, changeMode) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._cardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleClick = this._handleClick.bind(this);

    this._handlePopupClose = this._handlePopupClose.bind(this);
    this._onPopupCloseKeyDown = this._onPopupCloseKeyDown.bind(this);

    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleAddToHistoryClick = this._handleAddToHistoryClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;
    const prevCardComponent = this._cardComponent;

    this._cardComponent = new CardView(this._film, this._changeData);

    this._cardComponent.setClickHandler(this._handleClick);
    this._cardComponent.setAddToWatchListHandler(this._handleAddToWatchlistClick);
    this._cardComponent.setAddToHistoryHandler(this._handleAddToHistoryClick);
    this._cardComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);

    if (prevCardComponent === null) {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._cardContainer.getElement().contains(prevCardComponent.getElement())) {
      replaceCard(this._cardComponent, this._film.id);
    } else {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
    }

    this.resetView();
    remove(prevCardComponent);
  }

  // Обработчики закрытия попапа
  _handlePopupClose() {
    let popup = document.querySelector(`.film-details`);
    popup.remove();
    document.removeEventListener(`keydown`, this._onPopupCloseKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onPopupCloseKeyDown(evt) {
    if (isEscapeDown(evt)) {
      this._handlePopupClose();
    }
  }

  resetView() {
    if (this._mode === Mode.EDITING) {
      remove(this._popupComponent);
      this._renderPopup();
    }
  }

  _renderPopup() {
    this._popupComponent = new FilmPopupView(this._film, this._changeData);
    render(INDEX_BODY, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setPopupCloseHandler(this._handlePopupClose);
    this._popupComponent.setAddToWatchListHandler(this._handleAddToWatchlistClick);
    this._popupComponent.setAddToHistoryHandler(this._handleAddToHistoryClick);
    this._popupComponent.setAddToFavoritesHandler(this._handleAddToFavoritesClick);
    document.addEventListener(`keydown`, this._onPopupCloseKeyDown);

    this._changeMode();
    this._mode = Mode.EDITING;
    this._prevPopupComponent = this._popupComponent;
  }

  // Обработчик клика по карточке
  _handleClick(evt) {
    if (CLICKABLE_HTML_ELEMENTS.hasOwnProperty(evt.target.tagName)) {
      this._renderPopup();
    }
  }

  _handleAddToWatchlistClick() {
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
    this.resetView();
  }

  _handleAddToHistoryClick() {
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
    this.resetView();
  }

  _handleAddToFavoritesClick() {
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
    this.resetView();
  }

  destroy() {
    remove(this._cardComponent);

    if (this._popupComponent !== null) {
      remove(this._popupComponent);
    }
  }
}
