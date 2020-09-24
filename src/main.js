import {MenuItem, UpdateType, FilterType, BackendValues} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";

import Api from "./api.js";
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

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

// Рендеринг блока навигации
const mainNavigationSectionComponent = new MainNavigationSection();
let menuButtonComponent = new MenuButtonView(MenuItem.STATISTICS);

render(INDEX_MAIN, mainNavigationSectionComponent, RenderPosition.AFTERBEGIN);

// Инициализация презентеров
const boardPresenter = new BoardPresenter(INDEX_MAIN, filmsModel, filterModel, api);
const filterPresenter = new FilterPresenter(mainNavigationSectionComponent, filmsModel, filterModel);

boardPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(FILMS_QUANTITY_SECTION, new CardsQuantityView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);
    render(mainNavigationSectionComponent, menuButtonComponent, RenderPosition.BEFOREEND);
    menuButtonComponent.setMenuClickHandler(handleStatButtonClick);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    render(FILMS_QUANTITY_SECTION, new CardsQuantityView(0), RenderPosition.BEFOREEND);
    render(mainNavigationSectionComponent, menuButtonComponent, RenderPosition.BEFOREEND);
    menuButtonComponent.setMenuClickHandler(handleStatButtonClick);
  });


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

// Обновление кнопки меню при смене экрана
const resetMenuButton = (menuItem) => {
  remove(menuButtonComponent);
  menuButtonComponent = new MenuButtonView(menuItem);
  render(mainNavigationSectionComponent, menuButtonComponent, RenderPosition.BEFOREEND);
  menuButtonComponent.setMenuClickHandler(handleStatButtonClick);
};
