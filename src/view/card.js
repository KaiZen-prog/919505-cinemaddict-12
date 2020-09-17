import SmartView from "./smart.js";

import {
  MAX_DESCRIPTION_LENGTH,
  USER_ACTION,
  UPDATE_TYPE
} from "../const.js";

import {
  formatFilmReleaseYear
} from "../utils/film.js";

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
    `<article data-id="${id}" class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info"></p>
        <p class="film-card__info">inWatchlist: ${inWatchlist}</p>
        <p class="film-card__info">isWatched: ${isWatched}</p>
        <p class="film-card__info">isFavorite: ${isFavorite}</p>
        <p class="film-card__info">
            <span class="film-card__year">${formatFilmReleaseYear(releaseDate)}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genres}</span>
        </p>
        <img src="./images/posters/${poster}"  alt="" class="film-card__poster">
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

export default class Card extends SmartView {
  constructor(film, changeData) {
    super();
    this._film = film;
    this._data = Card.parseFilmToData(this._film);
    this._changeData = changeData;

    this._clickHandler = this._clickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createCard(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _setInnerHandlers() {
    const element = this.getElement();
    element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, (evt) => {
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
    });

    element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._changeData(Object.assign({}, this._film, {isWatched: !this._film.isWatched}));
    });

    element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._changeData(Object.assign({}, this._film, {isFavorite: !this._film.isFavorite}));
    });
  }

  restoreHandlers() {
    this.setClickHandler(this._callback.click);
    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return Object.assign(
        {},
        film,
        {
          poster: film.poster,
          ageLimit: film.ageLimit,
          title: film.title,
          rating: film.rating,
          director: film.director,
          writers: film.writers,
          actors: film.actors,
          releaseDate: film.releaseDate,
          duration: film.duration,
          country: film.country,
          genres: film.genres,
          description: film.description,
          comments: film.comments,
          emojiSrc: film.emojiSrc
        });
  }
}
