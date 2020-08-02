'use strict';

const COMMON_CARDS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;

const createUserProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">Movie Buff</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

const createMainMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
            <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
            <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
            <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
        <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" class="sort__button">Sort by date</a></li>
        <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

const createMainFilmsSection = () => {
  return (
    `<section class="films">
        <section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        </section>
    </section>`
  );
};

const createTopFilmsSection = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

const createMostCommentedFilmsSection = () => {
  return (
    `<section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>
    </section>`
  );
};

const createFilmsContainer = () => {
  return (
    `<div class="films-list__container"> </div>`
  );
};

const createShowMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

const createFilmCard = () => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title">The Dance of Life</h3>
        <p class="film-card__rating">8.3</p>
        <p class="film-card__info">
            <span class="film-card__year">1929</span>
            <span class="film-card__duration">1h 55m</span>
            <span class="film-card__genre">Musical</span>
        </p>
        <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
        <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
        <a class="film-card__comments">5 comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
    </article>`
  );
};

const createExtraFilmCard = () => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title">The Great Flamarion</h3>
        <p class="film-card__rating">8.9</p>
        <p class="film-card__info">
            <span class="film-card__year">1945</span>
            <span class="film-card__duration">1h 18m</span>
            <span class="film-card__genre">Mystery</span>
        </p>
        <img src="./images/posters/the-great-flamarion.jpg" alt="" class="film-card__poster">
        <p class="film-card__description">The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Grea…</p>
        <a class="film-card__comments">12 comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
    </article>`
  );
};

const createStatistics = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const indexHeader = document.querySelector(`.header`);
const indexMain = document.querySelector(`.main`);

render(indexHeader, createUserProfileTemplate(), `beforeend`);

render(indexMain, createMainMenuTemplate(), `beforeend`);
render(indexMain, createSortTemplate(), `beforeend`);
render(indexMain, createMainFilmsSection(), `beforeend`);

const filmsList = indexMain.querySelector(`.films-list`);

render(filmsList, createFilmsContainer(), `beforeend`);
render(filmsList, createShowMoreButton(), `beforeend`);

const filmCardsContainer = filmsList.querySelector(`.films-list__container`);


for (let i = 0; i < COMMON_CARDS_COUNT; i++) {
  render(filmCardsContainer, createFilmCard(), `beforeend`);
}

const filmsSection = indexMain.querySelector(`.films`);
render(filmsSection, createTopFilmsSection(), `beforeend`);
render(filmsSection, createMostCommentedFilmsSection(), `beforeend`);

const extraFilmSectionCollection = filmsSection.querySelectorAll(`.films-list--extra`);

extraFilmSectionCollection.forEach(function (el) {
  render(el, createFilmsContainer(), `beforeend`);
  let container = el.querySelector(`.films-list__container`);

  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    render(container, createExtraFilmCard(), `beforeend`);
  }
});

const statisticsSection = document.querySelector(`.footer__statistics`);
render(statisticsSection, createStatistics(), `beforeend`);
