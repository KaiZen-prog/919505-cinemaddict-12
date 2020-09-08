import CardView from "../view/card.js";
import {render, RenderPosition} from "../utils/render.js";
import {CLICKABLE_CARD_ELEMENTS} from "../const";
import FilmPopupPresenter from "./film-popup";

export default class FilmCard {
  constructor(cardContainer, changeData) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;

    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._cardComponent = new CardView(this._film, this._film.id);
    render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);

    // Обработчик клика по карточке
    const onCardClick = (evt) => {
      if (CLICKABLE_CARD_ELEMENTS.hasOwnProperty(evt.target.tagName)) {
        this._popup = new FilmPopupPresenter(this._film);
        this._popup.init();
      }
    };

    this._cardComponent.setClickHandler((evt) => {
      onCardClick(evt);
    });

    this._cardComponent.setWatchListHandler(this._handleAddToWatchListClick);
  }

  _handleAddToWatchListClick() {
    this._changeData(Object.assign({}, this._film, {inWatchlist: !this._film.inWatchlist}));
  }
}
