import {MenuItem, UpdateType, FilterType} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";

import {getFilms} from "./mock/film.js";
import FilmsModel from "./model/films.js";
import FilterModel from "./model/filter.js";

import MainNavigationSection from './view/main-navigation-section';
import MenuButtonView from './view/menu-button';
import StatisticsView from "./view/statistics.js";
import CardsQuantityView from "./view/films-quantity.js";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";

const INDEX_MAIN = document.querySelector(`.main`);
const FILMS_QUANTITY_SECTION = document.querySelector(`.footer__statistics`);


// Сборка моделей
const films = getFilms();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

// Рендеринг блока навигации
const mainNavigationSectionComponent = new MainNavigationSection();
let menuButtonComponent = new MenuButtonView(MenuItem.STATISTICS);

render(INDEX_MAIN, mainNavigationSectionComponent, RenderPosition.AFTERBEGIN);
render(mainNavigationSectionComponent, menuButtonComponent, RenderPosition.BEFOREEND);

// Инициализация презентеров
const boardPresenter = new BoardPresenter(INDEX_MAIN, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainNavigationSectionComponent, filmsModel, filterModel);

boardPresenter.init();
filterPresenter.init();

// Рендеринг общего числа карточек
render(FILMS_QUANTITY_SECTION, new CardsQuantityView(films.length), RenderPosition.BEFOREEND);

// Обработчик смены экрана
const handleStatButtonClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      resetMenuButton(MenuItem.STATISTICS);
      boardPresenter.init();
      remove(statisticsComponent);
      break;

    case MenuItem.STATISTICS:
      filterModel.setFilter(UpdateType.PATCH, FilterType.ALL);
      resetMenuButton(MenuItem.FILMS);
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.getFilms());
      render(INDEX_MAIN, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

let statisticsComponent = null;
menuButtonComponent.setMenuClickHandler(handleStatButtonClick);

// Обновление кнопки меню при смене экрана
const resetMenuButton = (menuItem) => {
  remove(menuButtonComponent);
  menuButtonComponent = new MenuButtonView(menuItem);
  render(mainNavigationSectionComponent, menuButtonComponent, RenderPosition.BEFOREEND);
  menuButtonComponent.setMenuClickHandler(handleStatButtonClick);
};
