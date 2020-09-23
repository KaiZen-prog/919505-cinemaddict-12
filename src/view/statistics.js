import SmartView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType} from "../const";
import {filter} from "../utils/filter.js";
import {humanizeDuration} from "../utils/film.js";
import {countWatchedFilmsInDateRange} from "../utils/statistics.js";

const CURRENT_DATE = new Date();

const renderChart = (ctx, watchedGenres) => {
  const BAR_HEIGHT = 50;

  const watchedGenresLabels = [];
  for (let genre in watchedGenres) {
    watchedGenresLabels.push(genre);
  }

  const watchedGenresCounts = [];
  for (let genre in watchedGenres) {
    watchedGenresCounts.push(watchedGenres[genre].timesWatched);
  }
  ctx.height = BAR_HEIGHT * 5;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: watchedGenresLabels,
      datasets: [{
        data: watchedGenresCounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: 'start',
          align: 'start',
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (watchedFilms, watchedGenres) => {
  // Получение любимого жанра
  const getFavoriteGenre = () => {
    let max = 0;
    let favoriteGenre = ``;

    for (let genre in watchedGenres) {
      if (watchedGenres[genre].timesWatched > max) {
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

    for (let i = 0; i < watchedFilms.length; i++) {
      totalDuration += watchedFilms[i].duration;
    }
    return totalDuration;
  };

  const watchedFilmsQuantity = watchedFilms.length;

  let watchedFilmsStatTitle = `movies`;
  if (watchedFilmsQuantity === 1) {
    watchedFilmsStatTitle = `movie`;
  }

  // Сколько фильмов просмотрено за прошедший год
  let yearBefore = new Date();
  yearBefore.setFullYear(yearBefore.getFullYear() - 1);
  const watchedFilmsLastYear = countWatchedFilmsInDateRange(watchedFilms, yearBefore, CURRENT_DATE)

  // Сколько фильмов просмотрено за прошедший месяц
  let monthBefore = new Date();
  monthBefore.setMonth(monthBefore.getMonth() - 1);
  const watchedFilmsLastMonth = countWatchedFilmsInDateRange(watchedFilms, monthBefore, CURRENT_DATE)

  // Сколько фильмов просмотрено за прошедшую неделю
  let weekBefore = new Date();
  weekBefore.setDate(weekBefore.getDate() - 7);
  const watchedFilmsLastWeek = countWatchedFilmsInDateRange(watchedFilms, weekBefore, CURRENT_DATE)

  // Сколько фильмов просмотрено за прошедшие сутки
  let dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 1);
  const watchedFilmsToday = countWatchedFilmsInDateRange(watchedFilms, dayBefore, CURRENT_DATE)

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
          <p class="statistic__item-text">${humanizeDuration(getTotalWatchedFilmsDuration(watchedFilms))}</p>
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
    this._watchedFilms = filter[FilterType.HISTORY](films);
    this._watchedGenres = this._getWatchedGenres(this._watchedFilms);

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
    return createStatisticsTemplate(this._watchedFilms, this._watchedGenres);
  }

  // Сбор данных о том, какие жанры были просмотрены и сколько раз
  _getWatchedGenres(films) {
    const watchedGenres = {};
    films.forEach((film) => {
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
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(ctx, this._watchedGenres);
  }
}
