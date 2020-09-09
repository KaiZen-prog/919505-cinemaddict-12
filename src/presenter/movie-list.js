import {updateItem} from "../utils/common.js";

import {
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
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
import CardsContainer from "../view/cards-container.js";
import SpecialSection from "../view/special-section.js";
import ShowMoreButton from "../view/show-more-button.js";
import CardPresenter from "../presenter/film-card.js";
import Filter from "../view/filter";

const INDEX_MAIN = document.querySelector(`.main`);

export default class FilmList {
  constructor(indexMain) {
    this._indexMain = indexMain;
    this._sortingComponent = new Sort();
    this._cardsContainerComponent = new CardsContainer();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._cardPresenter = {};

    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films, filters) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._filters = filters;
    this._filtersComponent = new Filter(this._filters);

    this._renderFilterPanel();
    this._renderSortingPanel();

    this._filmsListComponent = new FilmsListSection(this._films.length);
    render(this._indexMain, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderMainFilmList(this._films);
    this._renderSpecialFilmList(EXTRA_SECTIONS.top, this._sortFilmsByRating(films));
    this._renderSpecialFilmList(EXTRA_SECTIONS.commented, this._sortFilmsByComments(films));
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
      if (this._isButtonChanged(this._filtersComponent, evt.target, `main-navigation__item--active`)) {
        const newFilter = evt.target.dataset.filter;
        this._films = this._filters[newFilter];
        const currentSort = this._sortingComponent.getElement().querySelector(`.sort__button--active`);
        const sortedFilms = this._getSortedFilms(currentSort.dataset.sortBtn);
        this._renderMainFilmList(sortedFilms);
      }
    };

    render(INDEX_MAIN, this._filtersComponent, RenderPosition.AFTERBEGIN);

    this._filtersComponent.setClickHandler((evt) => {
      onFilterClick(evt);
    });
  }

  // Панель сортировки
  _renderSortingPanel() {
    const onSortingChange = (evt) => {
      if (this._isButtonChanged(this._sortingComponent, evt.target, `sort__button--active`)) {
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
        sortedFilms = this._sortFilmsByReleaseDate(this._films);
        break;

      case SORTING_ENTRIES.RATING :
        sortedFilms = this._sortFilmsByRating(this._films);
        break;

      default :
        sortedFilms = this._films;
    }

    return sortedFilms;
  }

  // Обработчик изменения фильмов
  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
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
  _renderShowMoreButton(container, films) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderCards(this._cardsContainerComponent, films, renderedFilmsCount, Math.min(films.length, renderedFilmsCount + FILMS_COUNT_PER_STEP));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  // Основная секция фильмов
  _renderMainFilmList(films) {
    const filmsList = this._filmsListComponent.getElement().querySelector(`.films-list`);
    render(filmsList, this._cardsContainerComponent, RenderPosition.BEFOREEND);
    this._renderCards(this._cardsContainerComponent, films, 0, Math.min(films.length, FILMS_COUNT_PER_STEP));

    if (films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton(filmsList, films);
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _clearMainFilmList() {
    const cardsContainer = this._cardsContainerComponent.getElement();
    while (cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild);
    }
  }

  // Секции особых фильмов
  _renderSpecialFilmList(sectionTitle, specialFilms) {
    const cardSection = INDEX_MAIN.querySelector(`.films`);
    render(cardSection, new SpecialSection(sectionTitle), RenderPosition.BEFOREEND);

    const specialSection = cardSection.lastChild;
    render(specialSection, new CardsContainer(), RenderPosition.BEFOREEND);

    const specialCardsContainer = specialSection.querySelector(`.films-list__container`);
    this._renderCards(specialCardsContainer, specialFilms, 0, Math.min(specialFilms.length, SPECIAL_CARDS_COUNT));
  }
}
