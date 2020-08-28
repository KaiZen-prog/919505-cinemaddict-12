import {
  FILMS_QUANTITY,
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  CLICKABLE_CARD_ELEMENTS,
  EXTRA_SECTIONS
} from "./const.js";

import {
  getNumberFromString,
  isEscapeDown
} from "./utils/common.js";

import {
  render,
  RenderPosition,
} from "./utils/render.js";

import UserProfile from "./view/user-profile.js";
import Filter from "./view/filter.js";
import Sort from "./view/sorting-panel.js";
import MainSection from "./view/main-section.js";
import SpecialSection from "./view/special-section.js";
import CardsContainer from "./view/cards-container.js";
import ShowMoreButton from "./view/show-more-button.js";
import Card from "./view/card.js";
import StatisticsSection from "./view/statistics.js";

import FilmPopup from "./view/film-popup.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

const INDEX_BODY = document.querySelector(`body`);
const INDEX_HEADER = document.querySelector(`.header`);
const INDEX_MAIN = document.querySelector(`.main`);

const films = new Array(FILMS_QUANTITY).fill().map(generateFilm);
const filters = generateFilter(films);

render(INDEX_HEADER, new UserProfile().getElement(), RenderPosition.BEFOREEND);
render(INDEX_MAIN, new Filter(filters).getElement(), RenderPosition.BEFOREEND);
render(INDEX_MAIN, new Sort().getElement(), RenderPosition.BEFOREEND);
render(INDEX_MAIN, new MainSection(films.length).getElement(), RenderPosition.BEFOREEND);

const filmsList = INDEX_MAIN.querySelector(`.films-list`);
render(filmsList, new CardsContainer().getElement(), RenderPosition.BEFOREEND);

// Обработчики открытия\закрытия попапа
const cards = document.querySelectorAll(`.film-card`);

const closePopup = () => {
  let popup = document.querySelector(`.film-details`);
  popup.remove();

  cards.forEach((el) => el.addEventListener(`click`, onCardClick));

  document.removeEventListener(`keydown`, onPopupCloseKeyDown);
};

const onPopupCloseKeyDown = (evt) => {
  if (isEscapeDown(evt)) {
    closePopup();
  }
};

const onPopupCloseClick = () => closePopup();

const onCardClick = (evt) => {
  if (CLICKABLE_CARD_ELEMENTS.includes(evt.target.tagName)) {
    const cardNumber = getNumberFromString(evt.currentTarget.id);
    const popup = new FilmPopup(films[cardNumber]).getElement();

    render(INDEX_BODY, popup, RenderPosition.BEFOREEND);

    let closeButton = popup.querySelector(`.film-details__close-btn`);

    closeButton.addEventListener(`click`, onPopupCloseClick);
    cards.forEach((el) => {
      el.removeEventListener(`click`, onCardClick);
    });

    document.addEventListener(`keydown`, onPopupCloseKeyDown);
  }
};


// Рендеринг карточек
const filmCardsContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  let card = new Card(films[i], i).getElement();
  render(filmCardsContainer, card, RenderPosition.BEFOREEND);

  card.addEventListener(`click`, onCardClick);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  const showMoreButton = new ShowMoreButton().getElement();

  render(filmsList, showMoreButton, RenderPosition.BEFOREEND);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => {
        let card = new Card(film, filmCardsContainer.childElementCount).getElement();
        render(filmCardsContainer, card, RenderPosition.BEFOREEND);
        card.addEventListener(`click`, onCardClick);
      });

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// Секции особых фильмов
const cardSection = INDEX_MAIN.querySelector(`.films`);

const getSpecialCardId = (film) => {
  let id = 0;

  for (let i = 0; i < films.length; i++) {
    if (film === films[i]) {
      id = i;
      return id;
    }
  }
  return id;
};

const createSpecialFilmSection = (sectionTitle, specialCards) => {
  render(cardSection, new SpecialSection(sectionTitle).getElement(), RenderPosition.BEFOREEND);

  const specialSection = cardSection.lastChild;
  render(specialSection, new CardsContainer().getElement(), RenderPosition.BEFOREEND);

  const specialCardsContainer = specialSection.querySelector(`.films-list__container`);

  const quantity = Math.min(specialCards.length, SPECIAL_CARDS_COUNT);

  for (let i = 0; i < quantity; i++) {
    let cardId = getSpecialCardId(specialCards[i]);
    let card = new Card(specialCards[i], cardId).getElement();
    render(specialCardsContainer, card, RenderPosition.BEFOREEND);

    card.addEventListener(`click`, onCardClick);
  }
};

if (films.length > 0) {
  // Сортируем фильмы по рейтингу
  const topCards = films.slice().sort((left, right) => {
    let rankDiff = right.rating - left.rating;
    if (rankDiff === 0) {
      rankDiff = films.indexOf(left) - films.indexOf(right);
    }
    return rankDiff;
  });

  // Сортируем фильмы по количеству комментариев
  const mostCommentedCards = films.slice().sort((left, right) => {
    let rankDiff = right.comments.length - left.comments.length;
    if (rankDiff === 0) {
      rankDiff = films.indexOf(left) - films.indexOf(right);
    }
    return rankDiff;
  });

  createSpecialFilmSection(EXTRA_SECTIONS.top, topCards);
  createSpecialFilmSection(EXTRA_SECTIONS.commented, mostCommentedCards);
}

// Секция статистики
const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, new StatisticsSection(films.length).getElement(), RenderPosition.BEFOREEND);
