import {
  FILMS_QUANTITY,
  FILMS_COUNT_PER_STEP,
  SPECIAL_CARDS_COUNT,
  EXTRA_SECTIONS
} from "./const.js";

import {getNumberFromString, render, isEscapeDown} from "./utils.js";

import {createUserProfileTemplate} from "./view/user-profile.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sorting-panel.js";
import {createMainSection} from "./view/main-section.js";
import {createTopSection} from "./view/top-section.js";
import {createMostCommentedSection} from "./view/most-commented-section.js";
import {createCardsContainer} from "./view/cards-container.js";
import {createShowMoreButton} from "./view/show-more-button.js";
import {createCard} from "./view/card.js";
import {createStatistics} from "./view/statistics.js";

import {createFilmPopup} from "./view/film-popup.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

const INDEX_BODY = document.querySelector(`body`);
const INDEX_HEADER = document.querySelector(`.header`);
const INDEX_MAIN = document.querySelector(`.main`);

const films = new Array(FILMS_QUANTITY).fill().map(generateFilm);
const filters = generateFilter(films);

render(INDEX_HEADER, createUserProfileTemplate(), `beforeend`);

render(INDEX_MAIN, createFilterTemplate(filters), `beforeend`);
render(INDEX_MAIN, createSortTemplate(), `beforeend`);
render(INDEX_MAIN, createMainSection(), `beforeend`);

const filmsList = INDEX_MAIN.querySelector(`.films-list`);
render(filmsList, createCardsContainer(), `beforeend`);

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
  if (evt.target.tagName === `IMG`) {
    const cardNumber = getNumberFromString(evt.currentTarget.id);

    render(INDEX_BODY, createFilmPopup(films[cardNumber - 1]), `beforeend`);

    let popup = document.querySelector(`.film-details`);
    let closeButton = popup.querySelector(`.film-details__close-btn`);

    closeButton.addEventListener(`click`, onPopupCloseClick);
    cards.forEach((el) => {
      el.removeEventListener(`click`, onCardClick);
    });

    document.addEventListener(`keydown`, onPopupCloseKeyDown);
  }
};

const filmCardsContainer = filmsList.querySelector(`.films-list__container`);

// Каждой только что созданной карточке добавляем листенер
const createCardEventListener = (idNumber) => {
  const cardId = `film-` + idNumber;
  const card = document.getElementById(cardId);

  card.addEventListener(`click`, onCardClick);
};

// Рендеринг карточек
for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmCardsContainer, createCard(films[i], i), `beforeend`);
  createCardEventListener(i);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  render(filmsList, createShowMoreButton(), `beforeend`);

  const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => {
        render(filmCardsContainer, createCard(film, filmCardsContainer.childElementCount + 1), `beforeend`);
        createCardEventListener(filmCardsContainer.childElementCount);
      });

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

// Секции особых фильмов
const filmsSection = INDEX_MAIN.querySelector(`.films`);

const getSpecialFilmId = (film) => {
  let id = 0;

  for (let i = 0; i < films.length; i++) {
    if (film === films[i]) {
      id = i;
      return id;
    }
  }
  return id;
};

// Секция самых рейтинговых фильмов
const topFilms = films.slice().sort((left, right) => {
  let rankDiff = right.rating - left.rating;
  if (rankDiff === 0) {
    rankDiff = films.indexOf(left) - films.indexOf(right);
  }
  return rankDiff;
});

render(filmsSection, createTopSection(EXTRA_SECTIONS.top), `beforeend`);

const topFilmsSection = filmsSection.lastChild;
render(topFilmsSection, createCardsContainer(), `beforeend`);

const topFilmsContainer = topFilmsSection.querySelector(`.films-list__container`);

for (let i = 0; i < SPECIAL_CARDS_COUNT; i++) {
  let filmId = getSpecialFilmId(topFilms[i]);
  render(topFilmsContainer, createCard(topFilms[i], filmId), `beforeend`);

  let card = topFilmsContainer.lastChild;
  card.addEventListener(`click`, onCardClick);
}


// Секция самых комментируемых фильмов
const mostCommentedFilms = films.slice().sort((left, right) => {
  let rankDiff = right.comments.length - left.comments.length;
  if (rankDiff === 0) {
    rankDiff = films.indexOf(left) - films.indexOf(right);
  }
  return rankDiff;
});

render(filmsSection, createTopSection(EXTRA_SECTIONS.commented), `beforeend`);

const mostCommentedFilmsSection = filmsSection.lastChild;
render(mostCommentedFilmsSection, createCardsContainer(), `beforeend`);

const mostCommentedFilmsContainer = mostCommentedFilmsSection.querySelector(`.films-list__container`);

for (let i = 0; i < SPECIAL_CARDS_COUNT; i++) {
  let filmId = getSpecialFilmId(mostCommentedFilms[i]);
  render(mostCommentedFilmsContainer, createCard(mostCommentedFilms[i], filmId), `beforeend`);

  let card = mostCommentedFilmsContainer.lastChild;
  card.addEventListener(`click`, onCardClick);
}
render(filmsSection, createMostCommentedSection(), `beforeend`);


// Секция статистики
const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, createStatistics(films.length), `beforeend`);
