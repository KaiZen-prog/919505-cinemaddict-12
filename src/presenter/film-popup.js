import FilmPopupView from "../view/film-popup.js";
import {render, RenderPosition} from "../utils/render.js";
import {isEscapeDown} from "../utils/common";
const INDEX_BODY = document.querySelector(`body`);

export default class FilmPopup {
  constructor(film) {
    this._film = film;
  }

  init() {
    const popupView = new FilmPopupView(this._film);
    render(INDEX_BODY, popupView, RenderPosition.BEFOREEND);

    // Обработчики закрытия попапа
    const closePopup = () => {
      let popup = document.querySelector(`.film-details`);
      popup.remove();

      document.removeEventListener(`keydown`, onPopupCloseKeyDown);
    };

    const onPopupCloseKeyDown = (evt) => {
      if (isEscapeDown(evt)) {
        closePopup();
      }
    };

    popupView.setClickHandler(closePopup);
    document.addEventListener(`keydown`, onPopupCloseKeyDown);
  }
}

