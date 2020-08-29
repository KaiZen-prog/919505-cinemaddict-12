import {MAX_DESCRIPTION_LENGTH} from "../const.js";
import Abstract from "./abstract";

const createCard = (film, filmId) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    comments,
    description
  } = film;

  let commentsLinkTitle;
  if (comments.length === 1) {
    commentsLinkTitle = comments.length + `comment`;
  } else {
    commentsLinkTitle = comments.length + `comments`;
  }

  let filmDescription = description;
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    filmDescription = description.substring(0, MAX_DESCRIPTION_LENGTH - 1) + `...`;
  }

  return (
    `<article id="${filmId}" class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genres}</span>
        </p>
        <img src=${poster}  alt="" class="film-card__poster">
        <p class="film-card__description">${filmDescription}</p>
        <a class="film-card__comments">${commentsLinkTitle}</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
    </article>`
  );
};

export default class Card extends Abstract {
  constructor(film, filmId) {
    super();
    this._film = film;
    this._filmId = filmId;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createCard(this._film, this._filmId);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
