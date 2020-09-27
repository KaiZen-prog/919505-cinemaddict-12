import {MenuItem, UpdateType, FilterType, BackendValues, StoreValues} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";

import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

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
const store = new Store(StoreValues.STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

// Рендеринг блока навигации
const mainNavigationSectionComponent = new MainNavigationSection();
let menuButtonComponent = new MenuButtonView(MenuItem.STATISTICS);

render(INDEX_MAIN, mainNavigationSectionComponent, RenderPosition.AFTERBEGIN);

// Инициализация презентеров
const boardPresenter = new BoardPresenter(INDEX_MAIN, filmsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(mainNavigationSectionComponent, filmsModel, filterModel);

boardPresenter.init();
filterPresenter.init();

apiWithProvider.getFilms()
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

// ServiceWorker
window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
