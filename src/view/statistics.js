import SmartView from './abstract';
// import Chart from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType} from "../const";
import {filter} from "../utils/filter.js";
import {humanizeDuration} from "../utils/film.js";

const createStatisticsTemplate = (films) => {
  const totalWatchedFilms = filter[FilterType.HISTORY](films);

  // Сбор данных о том, какие жанры были просмотрены и сколько раз
  const getWatchedGenres = () => {
    const watchedGenres = {};
    totalWatchedFilms.forEach((film) => {
      film.genres.forEach((genre) => {
        if (!watchedGenres[genre]) {
          watchedGenres[genre] = Object.assign({}, {
            timesWatched: 1
          });
        } else {
          watchedGenres[genre].timesWatched++;
        }
      });
    });
    return watchedGenres;
  };

  const totalWatchedGenres = getWatchedGenres(totalWatchedFilms);

  // Получение любимого жанра
  const getFavoriteGenre = () => {
    let max = 0;
    let favoriteGenre = ``;

    for (let genre in totalWatchedGenres) {
      if (totalWatchedGenres[genre].timesWatched > max) {
        max = genre.timesWatched;
        favoriteGenre = genre;
      }
    }
    return favoriteGenre;
  };

  const favoriteGenre = getFavoriteGenre();


  // Суммарная длительность всех просмотренных фильмов
  const getTotalWatchedFilmsDuration = () => {
    let totalDuration = 0;

    for (let i = 0; i < totalWatchedFilms.length; i++) {
      totalDuration += totalWatchedFilms[i].duration;
    }
    return totalDuration;
  };

  const watchedFilmsQuantity = totalWatchedFilms.length;

  let watchedFilmsStatTitle = `movies`;
  if (watchedFilmsQuantity === 1) {
    watchedFilmsStatTitle = `movie`;
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsQuantity} <span class="statistic__item-description">${watchedFilmsStatTitle}</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text" id="totalRuntime">${humanizeDuration(getTotalWatchedFilmsDuration(totalWatchedFilms))}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${favoriteGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._genres = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this._genres);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _dateChangeHandler([dateFrom, dateTo]) {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setCharts() {
    // Нужно отрисовать два графика
  }
}
