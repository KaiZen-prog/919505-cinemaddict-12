import {updateItem} from "../utils/common.js";

import {
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  SORTING_OPTION_CLASSES,
  FILTER_OPTION_CLASSES,
  EXTRA_SECTIONS,
  SORTING_ENTRIES
} from "../const.js";

import {
  render,
  remove,
  RenderPosition,
} from "../utils/render.js";

import Sort from "../view/sorting-panel.js";

import FilmsListSection from "../view/films-list-section.js";
import SpecialSection from "../view/special-section.js";
import CardsContainer from "../view/cards-container.js";
import ShowMoreButton from "../view/show-more-button.js";
import CardPresenter from "../presenter/film-card.js";
import Filter from "../view/filter";
import {generateFilter} from "../mock/filter";
import {FILTER_ENTRIES} from "../const";

const INDEX_MAIN = document.querySelector(`.main`);

export default class FilmList {
  constructor(indexMain) {
    this._indexMain = indexMain;
    this._sortingComponent = new Sort();

    this._mainCardsContainerComponent = new CardsContainer();
    this._topCardsContainerComponent = new CardsContainer();
    this._mostCommentedCardsContainerComponent = new CardsContainer();

    this._showMoreButtonComponent = new ShowMoreButton();
    this._cardPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._currentFilms = films.slice();
    this._sourcedFilms = films.slice();
    this._topFilms = this._sortFilmsByRating(this._films);
    this._mostCommentedFilms = this._sortFilmsByComments(this._films);

    this._activeFilter = FILTER_ENTRIES.ALL;
    this._filters = generateFilter(this._films);
    this._filtersComponent = new Filter(this._filters, this._activeFilter);

    this._renderFilterPanel();
    this._renderSortingPanel();

    this._filmsListComponent = new FilmsListSection(this._films.length);
    render(this._indexMain, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderMainFilmList(this._films);
    this._renderSpecialFilmList(EXTRA_SECTIONS.top, this._topFilms, this._topCardsContainerComponent);
    this._renderSpecialFilmList(EXTRA_SECTIONS.commented, this._mostCommentedFilms, this._mostCommentedCardsContainerComponent);
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

  // Меняем стили на фильтре и сортировке
  _toggleButtons(currentButton, newButton, elementClass) {
    currentButton.classList.remove(elementClass);
    newButton.classList.add(elementClass);
  }

  // Проверяем, не нажат ли уже активный фильтр или сортировка
  _isButtonChanged(component, newButton, elementClass) {
    const currentButton = component.getElement().querySelector(`.` + elementClass);
    if (currentButton === newButton) {
      return false;
    }

    this._toggleButtons(currentButton, newButton, elementClass);
    this._clearMainFilmList();
    return true;
  }

  // Панель фильтрации
  _renderFilterPanel() {
    const onFilterClick = (evt) => {
      if (this._isButtonChanged(this._filtersComponent, evt.target, FILTER_OPTION_CLASSES.ACTIVE)) {
        this._activeFilter = evt.target.dataset.filter;
        this._renderFilteredFilms();
      }
    };

    render(INDEX_MAIN, this._filtersComponent, RenderPosition.AFTERBEGIN);

    this._filtersComponent.setClickHandler((evt) => {
      onFilterClick(evt);
    });
  }

  // Вывод в главный список только тех фильмов, которые проходят выбранный фильтр
  _renderFilteredFilms() {
    this._currentFilms = this._filters[this._activeFilter];
    this._renderMainFilmList(this._currentFilms);
    this._resetSortingPanel();
  }

  // Панель сортировки
  _renderSortingPanel() {
    const onSortingChange = (evt) => {
      if (this._isButtonChanged(this._sortingComponent, evt.target, SORTING_OPTION_CLASSES.ACTIVE)) {
        const sortedFilms = this._getSortedFilms(evt.target.dataset.sortBtn);
        this._renderMainFilmList(sortedFilms);
      }
    };

    render(INDEX_MAIN, this._sortingComponent, RenderPosition.BEFOREEND);

    this._sortingComponent.setClickHandler((evt) => {
      onSortingChange(evt);
    });
  }

  _getSortedFilms(sortBy) {
    let sortedFilms;
    switch (sortBy) {
      case SORTING_ENTRIES.DEFAULT :
        sortedFilms = this._films;
        break;

      case SORTING_ENTRIES.DATE :
        sortedFilms = this._sortFilmsByReleaseDate(this._currentFilms);
        break;

      case SORTING_ENTRIES.RATING :
        sortedFilms = this._sortFilmsByRating(this._currentFilms);
        break;

      default :
        sortedFilms = this._films;
    }

    return sortedFilms;
  }

  _resetSortingPanel() {
    const sortingOptions = document.querySelectorAll(`.` + SORTING_OPTION_CLASSES.PASSIVE);
    sortingOptions.forEach((sortingOption) => {
      if (sortingOption.dataset.sortBtn === SORTING_ENTRIES.DEFAULT) {
        sortingOption.classList.add(SORTING_OPTION_CLASSES.ACTIVE);
      } else {
        sortingOption.classList.remove(SORTING_OPTION_CLASSES.ACTIVE);
      }
    });
  }

  // Обработчик изменения фильмов
  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._topFilms = this._sortFilmsByRating(this._films);
    this._mostCommentedFilms = this._sortFilmsByComments(this._films);

    this._filters = generateFilter(this._films);

    this._clearAllFilmLists();

    this._renderFilteredFilms();
    this._renderCards(this._topCardsContainerComponent, this._topFilms, 0, Math.min(this._topFilms.length, SPECIAL_CARDS_COUNT));
    this._renderCards(this._mostCommentedCardsContainerComponent, this._mostCommentedFilms, 0, Math.min(this._mostCommentedFilms.length, SPECIAL_CARDS_COUNT));

    const filmsList = this._filmsListComponent.getElement().querySelector(`.films-list`);
    this._isShowMoreButtonNeeded(filmsList, this._films);

    this._activeFilter = document.querySelector(`.` + FILTER_OPTION_CLASSES.ACTIVE).dataset.filter;
    this._clearFilterPanel();
    this._filtersComponent = new Filter(this._filters, this._activeFilter);
    this._renderFilterPanel();
  }

  // Рендеринг карточек
  _renderCard(cardsContainer, film) {
    const cardPresenter = new CardPresenter(cardsContainer, this._handleFilmChange);
    cardPresenter.init(film);
    this._cardPresenter[film.id] = cardPresenter;
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
      this._renderCards(this._mainCardsContainerComponent, this._currentFilms, renderedFilmsCount, Math.min(this._currentFilms.length, renderedFilmsCount + FILMS_COUNT_PER_STEP));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= this._currentFilms.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _isShowMoreButtonNeeded(filmsList) {
    if (this._currentFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton(filmsList);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  // Основная секция фильмов
  _renderMainFilmList(films) {
    const filmsList = this._filmsListComponent.getElement().querySelector(`.films-list`);
    render(filmsList, this._mainCardsContainerComponent, RenderPosition.BEFOREEND);
    this._renderCards(this._mainCardsContainerComponent, films, 0, Math.min(films.length, FILMS_COUNT_PER_STEP));

    this._isShowMoreButtonNeeded(filmsList, films);
  }

  _clearMainFilmList() {
    const mainContainer = this._mainCardsContainerComponent.getElement();
    while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.firstChild);
    }
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

  _clearFilterPanel() {
    const filters = this._filtersComponent.getElement();
    while (filters.firstChild) {
      filters.removeChild(filters.firstChild);
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
