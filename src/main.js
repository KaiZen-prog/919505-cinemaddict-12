import FilmsPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";

import {getFilms} from "./mock/film.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";

const INDEX_MAIN = document.querySelector(`.main`);

const films = getFilms();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(INDEX_MAIN, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(INDEX_MAIN, filmsModel, filterModel);

filmsPresenter.init();
filterPresenter.init();
