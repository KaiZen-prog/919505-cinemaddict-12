import {
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  SORTING_OPTION_CLASSES,
  EXTRA_SECTIONS,
  SORTING_ENTRIES,
  USER_ACTION,
  UPDATE_TYPE
} from "../const.js";

import {
  render,
  remove,
  RenderPosition,
} from "../utils/render.js";

import SortingView from "../view/sorting-panel.js";

import FilmsListSection from "../view/films-list-section.js";
import SpecialSection from "../view/special-section.js";
import CardsContainer from "../view/cards-container.js";
import ShowMoreButton from "../view/show-more-button.js";
import CardPresenter from "../presenter/film-card.js";
import {filter} from "../utils/filter.js";

const INDEX_MAIN = document.querySelector(`.main`);

export default class FilmList {
  constructor(indexMain, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._indexMain = indexMain;
    this._currentSortType = SORTING_ENTRIES.DEFAULT;
    this._sortingComponent = null;

    this._mainCardsContainerComponent = new CardsContainer();
    this._topCardsContainerComponent = new CardsContainer();
    this._mostCommentedCardsContainerComponent = new CardsContainer();

    this._showMoreButtonComponent = new ShowMoreButton();
    this._filmPresenter = {};

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._getFilms();

    this._renderSortingPanel();

    this._filmsListComponent = new FilmsListSection(films.length);
    render(this._indexMain, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._mainFilmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list`);
    render(this._mainFilmsListElement, this._mainCardsContainerComponent, RenderPosition.BEFOREEND);

    this._renderFilteredFilms();
    this._renderSpecialFilmList(EXTRA_SECTIONS.top, this._topFilms, this._topCardsContainerComponent);
    this._renderSpecialFilmList(EXTRA_SECTIONS.commented, this._mostCommentedFilms, this._mostCommentedCardsContainerComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case USER_ACTION.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        this._resetAllFilmLists();
        break;
    }
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    this._topFilms = this._sortFilmsByRating(films);
    this._mostCommentedFilms = this._sortFilmsByComments(films);
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SORTING_ENTRIES.DATE:
        return this._sortFilmsByReleaseDate(filteredFilms);
      case SORTING_ENTRIES.RATING:
        return this._sortFilmsByRating(filteredFilms);
    }
    return filteredFilms;
  }

  _resetAllFilmLists() {
    this._clearAllFilmLists();
    this._renderFilteredFilms();
    this._renderCards(this._topCardsContainerComponent, this._topFilms, 0, Math.min(this._topFilms.length, SPECIAL_CARDS_COUNT));
    this._renderCards(this._mostCommentedCardsContainerComponent, this._mostCommentedFilms, 0, Math.min(this._mostCommentedFilms.length, SPECIAL_CARDS_COUNT));
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this._resetAllFilmLists();
        break;
      case UPDATE_TYPE.MAJOR:
        this._resetAllFilmLists();
        break;
    }
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


  // Вывод в главный список только тех фильмов, которые проходят выбранный фильтр
  _renderFilteredFilms() {
    const filteredFilms = this._getFilms();
    this._renderMainFilmList(filteredFilms);
    this._resetSortingPanel();
  }

  // Панель сортировки
  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._resetAllFilmLists();
  }

  _renderSortingPanel() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortTypeChange);

    render(INDEX_MAIN, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _resetSortingPanel() {
    const sortingOptions = document.querySelectorAll(`.` + SORTING_OPTION_CLASSES.DEFAULT);
    sortingOptions.forEach((sortingOption) => {
      if (sortingOption.dataset.sortBtn === SORTING_ENTRIES.DEFAULT) {
        sortingOption.classList.add(SORTING_OPTION_CLASSES.ACTIVE);
      } else {
        sortingOption.classList.remove(SORTING_OPTION_CLASSES.ACTIVE);
      }
    });
  }

  // Рендеринг карточек
  _renderCard(cardsContainer, film) {
    const cardPresenter = new CardPresenter(cardsContainer, this._handleViewAction);
    cardPresenter.init(film);
    this._filmPresenter[film.id] = cardPresenter;
  }

  _renderCards(cardsContainer, films, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderCard(cardsContainer, film));
  }

  // Кнопка Show more
  _renderShowMoreButton(container) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderCards(this._mainCardsContainerComponent, this._films, renderedFilmsCount, Math.min(this._films.length, renderedFilmsCount + FILMS_COUNT_PER_STEP));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _isShowMoreButtonNeeded(filmsList, filmsQuantity) {
    if (filmsQuantity > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton(filmsList);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  // Основная секция фильмов
  _renderMainFilmList(films) {
    this._renderCards(this._mainCardsContainerComponent, films, 0, Math.min(films.length, FILMS_COUNT_PER_STEP));
    this._isShowMoreButtonNeeded(this._mainFilmsListElement, films);
  }

  // Методы очистки блоков при смене их содержания
  _clearAllFilmLists() {
    const mainContainer = this._mainCardsContainerComponent.getElement();
    const topContainer = this._topCardsContainerComponent.getElement();
    const mostCommentedContainer = this._mostCommentedCardsContainerComponent.getElement();

    while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
    }

    while (topContainer.firstChild) {
      topContainer.removeChild(topContainer.firstChild);
    }

    while (mostCommentedContainer.firstChild) {
      mostCommentedContainer.removeChild(mostCommentedContainer.firstChild);
    }
  }

  // Секции особых фильмов
  _renderSpecialFilmList(sectionTitle, specialFilms, specialCardsContainer) {
    const cardSection = INDEX_MAIN.querySelector(`.films`);
    render(cardSection, new SpecialSection(sectionTitle), RenderPosition.BEFOREEND);

    const specialSection = cardSection.lastChild;
    render(specialSection, specialCardsContainer, RenderPosition.BEFOREEND);

    this._renderCards(specialCardsContainer, specialFilms, 0, Math.min(specialFilms.length, SPECIAL_CARDS_COUNT));
  }
}
