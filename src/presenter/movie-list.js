import {
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  EXTRA_SECTIONS,
  FILTER_ENTRIES,
  SORTING_ENTRIES,
  USER_ACTION,
  UPDATE_TYPE
} from "../const.js";

import {
  render,
  remove,
  RenderPosition,
} from "../utils/render.js";

import NoFilm from '../view/no-films';
import Loading from '../view/loading';

import SortView from "../view/sorting-panel.js";

import Profile from '../view/user-profile';
import StatisticsSection from "../view/statistics.js";
import FilmListSection from "../view/film-list-section.js";
import MainFilmList from "../view/film-list-main.js";
import FilmListSectionExtra from "../view/film-list-section-extra.js";
import CardsContainer from "../view/cards-container.js";
import ShowMoreButton from "../view/show-more-button.js";
import CardPresenter from "../presenter/film-card.js";
import {filter} from "../utils/filter.js";

const INDEX_HEADER = document.querySelector(`.header`);
const STAT_SECTION = document.querySelector(`.footer__statistics`);

export default class FilmList {
  constructor(container, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._main = container;
    this._currentSortType = SORTING_ENTRIES.DEFAULT;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._loadingComponent = new Loading();
    this._noFilmComponent = new NoFilm();

    this._mainFilmListSectionComponent = new FilmListSection();
    this._mainFilmListComponent = new MainFilmList();
    this._mainCardsContainerComponent = new CardsContainer();

    this._topCardsListComponent = new FilmListSectionExtra(EXTRA_SECTIONS.top);
    this._topCardsContainerComponent = new CardsContainer();

    this._mostCommentedCardsListComponent = new FilmListSectionExtra(EXTRA_SECTIONS.commented);
    this._mostCommentedCardsContainerComponent = new CardsContainer();

    this._showMoreButtonComponent = new ShowMoreButton();

    this._cardPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmSection();
  }

  _handleViewAction(actionType, updateType, updatedFilm) {
    switch (actionType) {
      case USER_ACTION.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, updatedFilm);
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UPDATE_TYPE.MINOR:
        this._clearFilmSection();
        this._renderFilmSection();
        break;
      case UPDATE_TYPE.MAJOR:
        this._clearFilmSection({
          resetRenderedFilmCount: true, resetSortType: true
        });
        this._renderFilmSection();
        break;
      case UPDATE_TYPE.INIT:
        remove(this._loadingComponent);
        this._renderFilmSection();
        this._renderFooterStat();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SORTING_ENTRIES.DATE:
        return this._sortFilmsByReleaseDate(filteredFilms);
      case SORTING_ENTRIES.RATING:
        return this._sortFilmsByRating(filteredFilms);
    }
    return filteredFilms;
  }

  _renderFilmSection() {
    this._renderSort();

    render(this._main, this._mainFilmListSectionComponent, RenderPosition.BEFOREEND);
    render(this._mainFilmListSectionComponent, this._mainFilmListComponent, RenderPosition.AFTERBEGIN);
    render(this._mainFilmListComponent, this._mainCardsContainerComponent, RenderPosition.AFTERBEGIN);

    const films = this._getFilms();

    if (films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderFilms(films.slice(0, Math.min(films.length, this._renderedFilmCount)));

    if (films.length > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }

    this._renderFilmsExtra(films);
    this._renderFilmsMost(films);
    this._renderProfileRating(films);
    this._renderFooterStat();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButton();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._mainFilmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const films = this._getFilms();

    const newRenderedFilmCount = Math.min(films.length, this._renderedFilmCount + FILMS_COUNT_PER_STEP);
    const newFilmsToRender = films.slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(newFilmsToRender);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderProfileRating(films) {
    const filteredFilms = filter[FILTER_ENTRIES.HISTORY](films);
    this._profile = new Profile(filteredFilms.length);
    render(INDEX_HEADER, this._profile, RenderPosition.BEFOREEND);
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

  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderNoFilm() {
    remove(this._topCardsListComponent);
    remove(this._mostCommentedCardsListComponent);
    remove(this._mainFilmListComponent);
    render(this._mainFilmListSectionComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilmsExtra(films) {
    const sortedFilms = this._sortFilmsByRating(films).slice(0, SPECIAL_CARDS_COUNT);

    render(this._mainFilmListSectionComponent, this._topCardsListComponent, RenderPosition.BEFOREEND);
    render(this._topCardsListComponent, this._topCardsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(sortedFilms, this._topCardsContainerComponent);
  }

  _renderFilmsMost(films) {
    const sortedFilms = this._sortFilmsByComments(films).slice(0, SPECIAL_CARDS_COUNT);

    render(this._mainFilmListSectionComponent, this._mostCommentedCardsListComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedCardsListComponent, this._mostCommentedCardsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilms(sortedFilms, this._mostCommentedCardsContainerComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._main, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFooterStat() {
    const films = this._filmsModel.getFilms();
    this._footerStatComponent = new StatisticsSection(films.length);
    render(STAT_SECTION, this._footerStatComponent, RenderPosition.BEFOREEND);
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
      let rankDiff = right.releaseDate - left.releaseDate;
      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });
  }

  // Панель сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection({
      resetRenderedFilmCount: true
    });

    this._renderFilmSection();
  }

  _clearFilmSection({
    resetRenderedFilmCount = false,
    resetSortType = false
  } = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};

    remove(this._profile);
    remove(this._sortComponent);
    remove(this._mainFilmListSectionComponent);
    remove(this._mainFilmListComponent);
    remove(this._mainCardsContainerComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
    remove(this._footerStatComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SORTING_ENTRIES.DEFAULT;
    }
  }
}
