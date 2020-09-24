import moment from "moment";

import {
  CARDS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  ExtraSections,
  FilterType,
  SortingEntries,
  UserAction,
  UpdateType
} from "../const.js";

import {
  render,
  remove,
  RenderPosition,
} from "../utils/render.js";

import {filter} from "../utils/filter.js";

import UserProfileView from '../view/user-profile';

import NoFilmView from '../view/no-films';
import LoadingView from '../view/loading';
import SortView from "../view/sorting-panel";

import FilmListSectionView from "../view/film-list-section.js";
import MainFilmListView from "../view/film-list-main.js";
import FilmListSectionExtraView from "../view/film-list-section-extra.js";
import CardsContainerView from "../view/card-container.js";
import ShowMoreButtonView from "../view/show-more-button.js";

import CardPresenter from "./card.js";

const INDEX_HEADER = document.querySelector(`.header`);

export default class Board {
  constructor(container, cardModel, filterModel, api) {
    this._cardModel = cardModel;
    this._filterModel = filterModel;
    this._mainContainerComponent = container;
    this._api = api;

    this._currentSortType = SortingEntries.DEFAULT;
    this._renderedCardCount = CARDS_COUNT_PER_STEP;
    this._isLoading = true;

    this._userProfileComponent = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._loadingComponent = new LoadingView();
    this._noFilmComponent = new NoFilmView();

    this._mainCardListSectionComponent = new FilmListSectionView();
    this._mainCardListComponent = new MainFilmListView();
    this._mainCardsContainerComponent = new CardsContainerView();

    this._topCardsListComponent = new FilmListSectionExtraView(ExtraSections.top);
    this._topCardsContainerComponent = new CardsContainerView();

    this._mostCommentedCardsListComponent = new FilmListSectionExtraView(ExtraSections.commented);
    this._mostCommentedCardsContainerComponent = new CardsContainerView();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._cardPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init() {
    this._cardModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  // Рендеринг доски
  _renderBoard() {
    if (this._userProfileComponent === null) {
      this._renderProfileRating();
    }

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSort();

    render(this._mainContainerComponent, this._mainCardListSectionComponent, RenderPosition.BEFOREEND);
    render(this._mainCardListSectionComponent, this._mainCardListComponent, RenderPosition.AFTERBEGIN);
    render(this._mainCardListComponent, this._mainCardsContainerComponent, RenderPosition.AFTERBEGIN);

    const films = this._getFilms();

    if (films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderFilms(films.slice(0, Math.min(films.length, this._renderedCardCount)));

    if (films.length > this._renderedCardCount) {
      this._renderShowMoreButton();
    }

    this._renderFilmsExtra(films);
    this._renderFilmsMost(films);
  }

  // Обработчики изменения вида, модели и режима отображения карточки
  _handleViewAction(actionType, updateType, updatedFilm) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(updatedFilm).then((response) => {
          this._cardModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        remove(this._userProfileComponent);
        this._userProfileComponent = null;
        this._renderBoard();
        break;

      case UpdateType.PATCH:
        this._clearFilmSection({
          resetRenderedFilmCount: true,
          resetSortType: true,
          resetUserProfile: false
        });
        this._renderBoard();
        break;

      case UpdateType.MINOR:
        this._clearFilmSection({
          resetUserProfile: true
        });
        this._renderBoard();
        break;

      case UpdateType.MAJOR:
        this._clearFilmSection({
          resetRenderedFilmCount: true,
          resetSortType: true,
          resetUserProfile: true
        });
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  // Сборка фильмов согласно текущей фильтрации и сортировки
  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._cardModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortingEntries.DATE:
        return this._sortFilmsByReleaseDate(filteredFilms);
      case SortingEntries.RATING:
        return this._sortFilmsByRating(filteredFilms);
    }
    return filteredFilms;
  }

  // Профиль пользователя
  _renderProfileRating() {
    const films = this._cardModel.getFilms();
    const filteredFilms = filter[FilterType.HISTORY](films);
    this._userProfileComponent = new UserProfileView(filteredFilms.length);
    render(INDEX_HEADER, this._userProfileComponent, RenderPosition.BEFOREEND);
  }

  // Панель сортировки
  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._mainContainerComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection({
      resetRenderedFilmCount: true
    });

    this.init();
  }

  // Сортируем фильмы по рейтингу
  _sortFilmsByRating(films) {
    return films.slice().sort((left, right) => {
      let rankDiff = right.rating - left.rating;
      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });
  }

  // Сортируем фильмы по количеству комментариев
  _sortFilmsByComments(films) {
    return films.slice().sort((left, right) => {
      let rankDiff = right.comments.length - left.comments.length;
      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });
  }

  // Сортируем фильмы по дате выхода
  _sortFilmsByReleaseDate(films) {
    return films.slice().sort((left, right) => {
      let dateRight = moment(right.releaseDate, `DD MMMM YYYY`).format(`YYYYMMDD`);
      let dateLeft = moment(left.releaseDate, `DD MMMM YYYY`).format(`YYYYMMDD`);
      let rankDiff = dateRight - dateLeft;

      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });
  }

  _renderLoading() {
    render(this._mainCardListSectionComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  // Рендеринг карточек
  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderFilm(film, container = this._mainCardsContainerComponent) {
    const cardPresenter = new CardPresenter(container, this._handleViewAction, this._handleModeChange);
    cardPresenter.init(film);

    let id;
    switch (container) {
      case this._topCardsContainerComponent:
        id = `Extra` + film.id;
        break;
      case this._mostCommentedCardsContainerComponent:
        id = `Most` + film.id;
        break;
      default:
        id = film.id;
        break;
    }

    this._cardPresenter[id] = cardPresenter;
  }

  _renderNoFilm() {
    remove(this._topCardsListComponent);
    remove(this._mostCommentedCardsListComponent);
    remove(this._mainCardListComponent);
    render(this._mainCardListSectionComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  // Кнопка Show more
  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._mainCardListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const films = this._getFilms();

    const newRenderedFilmCount = Math.min(films.length, this._renderedCardCount + CARDS_COUNT_PER_STEP);
    const newFilmsToRender = films.slice(this._renderedCardCount, newRenderedFilmCount);

    this._renderFilms(newFilmsToRender);
    this._renderedCardCount = newRenderedFilmCount;

    if (this._renderedCardCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  // Рендеринг секций особых карточек
  _renderFilmsExtra(films) {
    const sortedFilms = this._sortFilmsByRating(films).slice(0, SPECIAL_CARDS_COUNT);

    if (sortedFilms[0].rating === 0) {
      return;
    }

    render(this._mainCardListSectionComponent, this._topCardsListComponent, RenderPosition.BEFOREEND);
    render(this._topCardsListComponent, this._topCardsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(sortedFilms, this._topCardsContainerComponent);
  }

  _renderFilmsMost(films) {
    const sortedFilms = this._sortFilmsByComments(films).slice(0, SPECIAL_CARDS_COUNT);

    if (sortedFilms[0].comments.length === 0) {
      return;
    }

    render(this._mainCardListSectionComponent, this._mostCommentedCardsListComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedCardsListComponent, this._mostCommentedCardsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(sortedFilms, this._mostCommentedCardsContainerComponent);
  }

  // Очистка доски
  _clearFilmSection({
    resetRenderedFilmCount = false,
    resetSortType = false,
    resetUserProfile = false
  } = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};

    if (resetUserProfile) {
      remove(this._userProfileComponent);
      this._userProfileComponent = null;
    }

    remove(this._sortComponent);
    remove(this._mainCardListSectionComponent);
    remove(this._mainCardListComponent);
    remove(this._mainCardsContainerComponent);
    remove(this._loadingComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedCardCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedCardCount = Math.min(filmCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortingEntries.DEFAULT;
    }
  }

  destroy() {
    this._clearFilmSection({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._mainCardListSectionComponent);

    this._cardModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }
}
