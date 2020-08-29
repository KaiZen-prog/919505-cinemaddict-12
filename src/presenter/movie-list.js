import {
  getNumberFromString,
  isEscapeDown
} from "../utils/common.js";

import {
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  CLICKABLE_CARD_ELEMENTS,
  EXTRA_SECTIONS
} from "../const.js";

import {FILTER_ENTRIES} from '../const.js';

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
import Card from "../view/card.js";
import FilmPopup from "../view/film-popup.js";
import Filter from "../view/filter";

const INDEX_BODY = document.querySelector(`body`);
const INDEX_MAIN = document.querySelector(`.main`);

export default class FilmList {
  constructor(indexMain) {
    this._indexMain = indexMain;
    this._sortingComponent = new Sort();
    this._cardDIV = new CardsContainer();
    this._showMoreButtonComponent = new ShowMoreButton();
  }

  init(films, filters) {
    this._films = films.slice();
    this._filters = filters;
    this._filtersComponent = new Filter(this._filters);

    // Сортируем фильмы по рейтингу
    this._topFilms = this._films.slice().sort((left, right) => {
      let rankDiff = right.rating - left.rating;
      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });

    // Сортируем фильмы по количеству комментариев
    this._mostCommentedFilms = this._films.slice().sort((left, right) => {
      let rankDiff = right.comments.length - left.comments.length;
      if (rankDiff === 0) {
        rankDiff = films.indexOf(left) - films.indexOf(right);
      }
      return rankDiff;
    });

    this._renderFilterPanel();
    this._renderSortingPanel();

    this._filmsListComponent = new FilmsListSection(this._films.length);
    render(this._indexMain, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderMainFilmList(this._films);
    this._renderSpecialFilmList(EXTRA_SECTIONS.top, this._topFilms);
    this._renderSpecialFilmList(EXTRA_SECTIONS.commented, this._mostCommentedFilms);
  }

  // Панель фильтрации
  _renderFilterPanel() {
    const onFilterChange = (evt) => {

      const currentFilter = this._filtersComponent.getElement().querySelector(`.main-navigation__item--active`);
      currentFilter.classList.remove(`main-navigation__item--active`);
      evt.target.classList.add(`main-navigation__item--active`);

      const cardsContainer = this._cardDIV.getElement();
      while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
      }

      let films;
      switch (evt.target.dataset.filter) {
        case FILTER_ENTRIES[0] :
          films = this._filters[FILTER_ENTRIES[0]];
          break;

        case FILTER_ENTRIES[1] :
          films = this._filters[FILTER_ENTRIES[1]];
          break;

        case FILTER_ENTRIES[2] :
          films = this._filters[FILTER_ENTRIES[2]];
          break;

        case FILTER_ENTRIES[3] :
          films = this._filters[FILTER_ENTRIES[3]];
          break;

        default :
          films = this._filters[FILTER_ENTRIES[0]];
          break;
      }

      this._renderMainFilmList(films);
    };

    render(INDEX_MAIN, this._filtersComponent, RenderPosition.BEFOREEND);

    this._filtersComponent.setClickHandler((evt) => {
      onFilterChange(evt);
    });
  }

  // Панель сортировки
  _renderSortingPanel() {
    render(INDEX_MAIN, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  // Рендеринг карточек
  _renderCards(cardsContainer, films, from, to) {
    // Обработчики закрытия попапа
    const closePopup = () => {
      let popup = document.querySelector(`.film-details`);
      popup.remove();

      document.removeEventListener(`keydown`, onPopupCloseKeyDown);
    };

    const onPopupCloseKeyDown = (evt) => {
      if (isEscapeDown(evt)) {
        closePopup();
      }
    };

    const onPopupCloseClick = () => closePopup();

    // Обработчик клика по карточке
    const onCardClick = (evt) => {
      if (CLICKABLE_CARD_ELEMENTS.includes(evt.target.tagName)) {
        const cardNumber = getNumberFromString(evt.currentTarget.id);
        const popup = new FilmPopup(this._films[cardNumber]);

        render(INDEX_BODY, popup, RenderPosition.BEFOREEND);

        popup.setClickHandler(onPopupCloseClick);
        document.addEventListener(`keydown`, onPopupCloseKeyDown);
      }
    };

    for (let i = from; i < to; i++) {
      let cardComponent = new Card(films[i], films[i].id);
      render(cardsContainer, cardComponent, RenderPosition.BEFOREEND);

      cardComponent.setClickHandler((evt) => {
        onCardClick(evt);
      });
    }
  }

  _renderShowMoreButton(container, films) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler((evt) => {
      evt.preventDefault();
      this._renderCards(this._cardDIV, films, renderedFilmsCount, Math.min(films.length, renderedFilmsCount + FILMS_COUNT_PER_STEP));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  // Основная секция фильмов
  _renderMainFilmList(films) {
    const filmsList = this._filmsListComponent.getElement().querySelector(`.films-list`);
    render(filmsList, this._cardDIV, RenderPosition.BEFOREEND);
    this._renderCards(this._cardDIV, films, 0, Math.min(films.length, FILMS_COUNT_PER_STEP));

    if (films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton(filmsList, films);
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
