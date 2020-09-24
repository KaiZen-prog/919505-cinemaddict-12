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
      isFavorite: film.user_details.favorite,
      watchingDate: moment(new Date(film.user_details.watching_date)).format(`YYYY/MM/DD`),
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
        emoji: element.emotion,
        day: moment(new Date(element.date)).format(`YYYY/MM/DD HH:mm`)
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
      "film_info": Object.assign({}, {
        "poster": film.poster,
        "title": film.title,
        "alternative_title": film.alternativeTitle,
        "description": film.description,
        "total_rating": film.totalRating,
        "runtime": film.runtimeUnformated,
        "genre": film.genre,
        "age_rating": film.age,
        "director": film.director,
        "writers": film.writers,
        "actors": film.actors,
        "release": Object.assign({}, {
          "release_country": film.country,
          "date": film.releaseDateUnformated,
        }),
      }),
      "user_details": Object.assign({}, {
        "watchlist": film.isWatchlist,
        "already_watched": film.isHistory,
        "favorite": film.isFavorites,
        "watching_date": film.watchingDateUnformated,
      }),
      "comments": film.comments.map((comment) => {
        if (comment.id) {
          return comment.id;
        }
        return comment;
      })
    });

    delete adaptedFilm.poster;
    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.runtime;
    delete adaptedFilm.age;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.country;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isHistory;
    delete adaptedFilm.isFavorites;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.genre;
    delete adaptedFilm.currentComment;
    return adaptedFilm;
  }

  static adaptCommentToServer(comment) {
    const adaptedComment = Object.assign({}, {
      "comment": comment.comment,
      "emotion": comment.emoji,
      "date": comment.day
    });

    delete adaptedComment.emoji;
    delete adaptedComment.day;
    return adaptedComment;
  }
}
