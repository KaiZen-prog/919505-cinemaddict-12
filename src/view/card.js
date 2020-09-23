import Abstract from "./abstract.js";
import {MAX_DESCRIPTION_LENGTH, ClickableHTMLElements} from "../const.js";
import {formatFilmReleaseYear, humanizeDuration} from "../utils/film.js";

const createCard = (film) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    comments,
    description,
    inWatchlist,
    isWatched,
    isFavorite,
    id,
  } = film;

  // Редактируем заголовок блока с комментариями в зависимости от их числа
  let commentsLinkTitle;
  if (comments.length === 1) {
    commentsLinkTitle = comments.length + `comment`;
  } else {
    commentsLinkTitle = comments.length + `comments`;
  }

  // Выставляем максимально допустимую длину описания фильма
  let filmDescription = description;
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    filmDescription = description.substring(0, MAX_DESCRIPTION_LENGTH - 1) + `...`;
  }

  // Выставляем активные/неактивные контролы
  const isInWatchList = inWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const isInHistory = isWatched
    ? `film-card__controls-item--active`
    : ``;

  const isInFavorites = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article data-id="${id}" class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
            <span class="film-card__year">${formatFilmReleaseYear(releaseDate)}</span>
            <span class="film-card__duration">${humanizeDuration(duration)}</span>
            <span class="film-card__genre">${genres}</span>
        </p>
        <img src="./images/posters/${poster}"  alt="" class="film-card__poster">
        <p class="film-card__description">${filmDescription}</p>
        <a class="film-card__comments">${commentsLinkTitle}</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button ${isInWatchList} film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button ${isInHistory} film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button ${isInFavorites} film-card__controls-item--favorite">Mark as favorite</button>
        </form>
    </article>`
  );
};

export default class Card extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._addToWatchListHandler = this._addToWatchListHandler.bind(this);
    this._addToHistoryHandler = this._addToHistoryHandler.bind(this);
    this._addToFavoritesHandler = this._addToFavoritesHandler.bind(this);
  }

  getTemplate() {
    return createCard(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    if (ClickableHTMLElements.hasOwnProperty(evt.target.tagName)) {
      this._callback.click(evt);
    }
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _addToWatchListHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addToWatchListHandler);
  }

  _addToHistoryHandler(evt) {
    evt.preventDefault();
    this._callback.addToHistoryClick();
  }

  setAddToHistoryClickHandler(callback) {
    this._callback.addToHistoryClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._addToHistoryHandler);
  }

  _addToFavoritesHandler(evt) {
    evt.preventDefault();
    this._callback.addToFavoritesClick();
  }

  setAddToFavoritesClickHandler(callback) {
    this._callback.addToFavoritesClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._addToFavoritesHandler);
  }
}
