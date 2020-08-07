import {render} from "./utils.js";

import {createUserProfileTemplate} from "./view/user-profile.js";
import {createMainMenuTemplate} from "./view/main-menu.js";
import {createSortTemplate} from "./view/sorting-panel.js";
import {createMainSection} from "./view/main-section.js";
import {createTopSection} from "./view/top-section.js";
import {createMostCommentedSection} from "./view/most-commented-section.js";
import {createCardsContainer} from "./view/cards-container.js";
import {createShowMoreButton} from "./view/show-more-button.js";
import {createCard} from "./view/card.js";
import {createExtraCard} from "./view/card-extra.js";
import {createStatistics} from "./view/statistics.js";

const COMMON_CARDS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;

const INDEX_HEADER = document.querySelector(`.header`);
const INDEX_MAIN = document.querySelector(`.main`);

render(INDEX_HEADER, createUserProfileTemplate(), `beforeend`);

render(INDEX_MAIN, createMainMenuTemplate(), `beforeend`);
render(INDEX_MAIN, createSortTemplate(), `beforeend`);
render(INDEX_MAIN, createMainSection(), `beforeend`);

const filmsList = INDEX_MAIN.querySelector(`.films-list`);
render(filmsList, createCardsContainer(), `beforeend`);
render(filmsList, createShowMoreButton(), `beforeend`);

const filmCardsContainer = filmsList.querySelector(`.films-list__container`);
for (let i = 0; i < COMMON_CARDS_COUNT; i++) {
  render(filmCardsContainer, createCard(), `beforeend`);
}

const filmsSection = INDEX_MAIN.querySelector(`.films`);
render(filmsSection, createTopSection(), `beforeend`);
render(filmsSection, createMostCommentedSection(), `beforeend`);

const extraFilmSectionCollection = filmsSection.querySelectorAll(`.films-list--extra`);
extraFilmSectionCollection.forEach(function (el) {
  render(el, createCardsContainer(), `beforeend`);
  const container = el.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    render(container, createExtraCard(), `beforeend`);
  }
});

const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, createStatistics(), `beforeend`);
