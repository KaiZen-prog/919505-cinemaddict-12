import CardView from "../view/card.js";
import {render, RenderPosition} from "../utils/render.js";
import {CLICKABLE_CARD_ELEMENTS} from "../const";
import FilmPopupPresenter from "./film-popup";

export default class FilmCard {
  constructor(cardContainer, changeData) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;

    this._handleClick = this._handleClick.bind(this);

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleAddToHistoryClick = this._handleAddToHistoryClick.bind(this);
    this._handleAddToFavoritesClick = this._handleAddToFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    this._cardComponent = new CardView(this._film, this._film.id);
    this._cardComponent.setClickHandler(this._handleClick);
    this._cardComponent.setWatchListHandler(this._handleAddToWatchListClick);
    this._cardComponent.setHistoryHandler(this._handleAddToHistoryClick);
    this._cardComponent.setFavoritesHandler(this._handleAddToFavoritesClick);

    render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
  }

  // Обработчик клика по карточке
  _handleClick(evt) {
    if (CLICKABLE_CARD_ELEMENTS.hasOwnProperty(evt.target.tagName)) {
      const popupPresenter = new FilmPopupPresenter(this._film, this._changeData);
      popupPresenter.init();
    }
  }

  //  Обработчик добавления в watchlist
  _handleAddToWatchListClick() {
    this._changeData(Object.assign({}, this._film, {inWatchlist: !this._film.inWatchlist}));
  }

  //  Обработчик добавления в history
  _handleAddToHistoryClick() {
    this._changeData(Object.assign({}, this._film, {isWatched: !this._film.isWatched}));
  }

  //  Обработчик добавления в favorites
  _handleAddToFavoritesClick() {
    this._changeData(Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
  }
}
