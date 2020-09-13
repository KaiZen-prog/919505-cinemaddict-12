import FilmsPresenter from "./presenter/movie-list.js";

import {
  render,
  RenderPosition,
} from "./utils/render.js";

import UserProfile from "./view/user-profile.js";
import StatisticsSection from "./view/statistics.js";

import {getFilms} from "./mock/film.js";

const INDEX_HEADER = document.querySelector(`.header`);
const INDEX_MAIN = document.querySelector(`.main`);

const films = getFilms();

// Блок профиля
render(INDEX_HEADER, new UserProfile().getElement(), RenderPosition.BEFOREEND);

// Презентер списков фильмов
const filmsPresenter = new FilmsPresenter(INDEX_MAIN);
filmsPresenter.init(films);

// Секция статистики
const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, new StatisticsSection(films.length).getElement(), RenderPosition.BEFOREEND);
