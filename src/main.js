import FilmsPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";

import {
  render,
  RenderPosition,
} from "./utils/render.js";

import UserProfile from "./view/user-profile.js";
import StatisticsSection from "./view/statistics.js";

import {getFilms} from "./mock/film.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";

const INDEX_HEADER = document.querySelector(`.header`);
const INDEX_MAIN = document.querySelector(`.main`);

const films = getFilms();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

// Блок профиля
render(INDEX_HEADER, new UserProfile().getElement(), RenderPosition.BEFOREEND);

// Презентер списков фильмов
const filmsPresenter = new FilmsPresenter(INDEX_MAIN, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(INDEX_MAIN, filmsModel, filterModel);

filmsPresenter.init();
filterPresenter.init();

// Секция статистики
const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, new StatisticsSection(films.length).getElement(), RenderPosition.BEFOREEND);
