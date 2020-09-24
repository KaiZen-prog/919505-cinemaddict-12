import moment from "moment";
import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({}, film, {
      id: film.id,
      title: film.film_info.title,
      alternativeTitle: film.film_info.alternative_title,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      poster: film.film_info.poster,
      rating: film.film_info.total_rating,
      releaseDate: moment(new Date(film.film_info.release.date)).format(`DD MMMM YYYY`),
      country: film.film_info.release.release_country,
      duration: moment.utc(moment.duration(film.film_info.runtime, `minutes`).asMilliseconds()).format(`H[h] m[m]`),
      genres: film.film_info.genre,
      ageLimit: film.film_info.age_rating,
      description: film.film_info.description,
      inWatchlist: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      watchingDate: moment(new Date(film.user_details.watching_date)).format(`YYYY/MM/DD`),
      isFavorite: film.user_details.favorite,
      currentComment: {
        text: null,
        emotion: null,
        author: null,
        day: null
      },
      watchingDateNotFormatted: film.user_details.watching_date,
      releaseDateNotFormatted: film.film_info.release.date,
      durationNotFormatted: film.film_info.runtime,
    });

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    return adaptedFilm;
  }

  static modifyComments(comments) {
    return comments.map((element) => {
      const newElement = Object.assign({}, element, {
        day: moment(new Date(element.date)).format(`YYYY/MM/DD HH:mm`),
        emoji: element.emotion
      });

      delete newElement.emotion;
      delete newElement.date;
      return newElement;
    });
  }

  static adaptNewCommentsToClient(movieAndComments) {
    const comments = movieAndComments.comments;
    return Films.modifyComments(comments);
  }

  static adaptCommentsToClient(film, comments) {
    return Object.assign({}, film, {
      comments: Films.modifyComments(comments)
    });
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({}, film, {
      "comments": film.comments.map((comment) => {
        if (comment.id) {
          return comment.id;
        }
        return comment;
      }),
      "film_info": Object.assign({}, {
        "title": film.title,
        "alternative_title": film.alternativeTitle,
        "total_rating": film.rating,
        "poster": film.poster,
        "age_rating": film.ageLimit,
        "director": film.director,
        "writers": film.writers,
        "actors": film.actors,
        "release": Object.assign({}, {
          "date": film.releaseDateNotFormatted,
          "release_country": film.country
        }),
        "runtime": film.durationNotFormatted,
        "genre": film.genres,
        "description": film.description,
      }),
      "user_details": Object.assign({}, {
        "watchlist": film.inWatchlist,
        "already_watched": film.isWatched,
        "watching_date": film.watchingDateNotFormatted,
        "favorite": film.isFavorite,
      })
    });

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.rating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageLimit;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.duration;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.inWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.currentComment;
    delete adaptedFilm.watchingDateNotFormatted;
    delete adaptedFilm.releaseDateNotFormatted;
    delete adaptedFilm.durationNotFormatted;

    return adaptedFilm;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign({}, {
      "comment": comment.comment,
      "date": comment.date,
      "emotion": comment.emoji
    });

    delete adaptedComment.emoji;
    delete adaptedComment.day;
    return adaptedComment;
  }
}
