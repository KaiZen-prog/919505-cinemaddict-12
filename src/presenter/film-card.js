import CardView from "../view/card.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {CLICKABLE_CARD_ELEMENTS} from "../const";
import FilmPopupPresenter from "./film-popup";

export default class FilmCard {
  constructor(cardContainer, changeData) {
    this._cardContainer = cardContainer;
    this._changeData = changeData;
    this._cardComponent = null;

    this._handleClick = this._handleClick.bind(this);
    this._changeData = this._changeData.bind(this);
  }

  init(film) {
    this._film = film;
    const prevCardComponent = this._cardComponent;

    this._cardComponent = new CardView(this._film, this._changeData);
    this._cardComponent.setClickHandler(this._handleClick);

    if (prevCardComponent === null) {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._cardContainer.getElement().contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, this._film.id);
    } else {
      render(this._cardContainer, this._cardComponent, RenderPosition.BEFOREEND);
    }

    remove(prevCardComponent);
  }

  // Обработчик клика по карточке
  _handleClick(evt) {
    if (CLICKABLE_CARD_ELEMENTS.hasOwnProperty(evt.target.tagName)) {
      const popupPresenter = new FilmPopupPresenter(this._film, this._changeData);
      popupPresenter.init();
    }
  }
}
