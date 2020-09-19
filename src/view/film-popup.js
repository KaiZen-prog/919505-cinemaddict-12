import SmartView from "./smart.js";
import {formatFilmReleaseDate} from "../utils/film.js";

const getEmoji = (emojiSrc) => {
  if (emojiSrc !== ``) {
    return `<img src="${emojiSrc}" width="55" height="55" alt="emoji">`;
  } else {
    return ``;
  }
};

const createFilmPopup = (data) => {
  const {
    poster,
    ageLimit,
    title,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    country,
    genres,
    description,
    inWatchlist,
    isWatched,
    isFavorite,
    comments,
    emojiSrc
  } = data;

  // Заполняем жанры
  const renderGenresList = function () {
    let tableTitle;
    if (genres.length === 1) {
      tableTitle = `Genre`;
    } else {
      tableTitle = `Genres`;
    }

    let genresList =
      `<td class="film-details__term">${tableTitle}</td>
        <td class="film-details__cell">`;
    for (const genre of genres) {
      genresList += `<span class="film-details__genre">` + genre + `</span>`;
    }

    return genresList + `</td>`;
  };

  // Корректируем отображение часов и минут, если их меньше 10
  const setTimeString = function (timeString) {
    if (timeString < 10) {
      timeString = `0` + timeString;
    }

    return timeString;
  };

  // Активируем инпуты
  const isInWatchList = inWatchlist
    ? `checked`
    : ``;

  const isInHistory = isWatched
    ? `checked`
    : ``;

  const isInFavorites = isFavorite
    ? `checked`
    : ``;

  // Заполняем комментарии
  const renderCommentsList = function () {
    let commentsList = ``;
    for (const comment of comments) {
      const date = new Date(comment.date);

      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      let hour = setTimeString(date.getUTCHours());
      let minute = setTimeString(date.getMinutes());

      if (minute === 0) {
        minute = `0` + minute;
      }

      const commentDateString = year + `/` + month + `/` + day + ` ` + hour + `:` + minute;
      commentsList +=
        `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
                <img src="${comment.emotion}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
                <p class="film-details__comment-text">${comment.text}</p>
                <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">2019/12/31 23:59</span>
                    <span class="film-details__comment-day">${commentDateString}</span>
                    <button class="film-details__comment-delete">Delete</button>
                </p>
            </div>
        </li>`;
    }

    return commentsList;
  };

  return (
    `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
              <div class="film-details__poster">
                <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

                <p class="film-details__age">${ageLimit}+</p>
              </div>

              <div class="film-details__info">
                <div class="film-details__info-head">
                  <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${title}</h3>
                    <p class="film-details__title-original">Original: ${title}</p>
                  </div>

                  <div class="film-details__rating">
                    <p class="film-details__total-rating">${rating}</p>
                  </div>
                </div>

                <table class="film-details__table">
                  <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${director}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${formatFilmReleaseDate(releaseDate)}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${duration}</td>
                  </tr>
                  <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${country}</td>
                  </tr>
                  <tr class="film-details__row">
                    ${renderGenresList()}
                  </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
              </div>
            </div>

            <section class="film-details__controls">
              <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList}>
              <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isInHistory}>
              <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

              <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isInFavorites}>
              <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
          </div>

          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

              <ul class="film-details__comments-list">
                ${renderCommentsList()}
              </ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label">
                    ${getEmoji(emojiSrc)}
                </div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>
          </div>
        </form>
     </section>`
  );
};

export default class FilmPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmPopup.parseFilmToData(film);

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._addToHistoryHandler = this._addToHistoryHandler.bind(this);
    this._addToFavoritesHandler = this._addToFavoritesHandler.bind(this);
    this._addEmojiHandler = this._addEmojiHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopup(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupHandler(this._callback.closePopup);
  }

  _setInnerHandlers() {
    const element = this.getElement();
    element.querySelector(`#watchlist`).addEventListener(`click`, this._addToWatchlistHandler);
    element.querySelector(`#watched`).addEventListener(`click`, this._addToHistoryHandler);
    element.querySelector(`#favorite`).addEventListener(`click`, this._addToFavoritesHandler);
    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._addEmojiHandler);
  }

  _addToWatchlistHandler(evt) {
    evt.preventDefault();
    this.updateData({
      inWatchlist: !this._data.inWatchlist
    });
  }

  _addToHistoryHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatched: !this._data.isWatched
    });
  }

  _addToFavoritesHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _addEmojiHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentComment: Object.assign({}, this._data.currentComment, {
        emoji: evt.target.value
      })
    });
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup(FilmPopup.parseDataToFilm(this._data));
  }

  setClosePopupHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closePopupHandler);
  }

  static parseFilmToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToFilm(data) {
    return Object.assign({}, data);
  }
}
