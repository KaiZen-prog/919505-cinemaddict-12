import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {FilterType, StatisticsFilters, StatisticsValues, StatisticsLabels} from "../const";
import {filter} from "../utils/filter.js";
import {getWatchedFilmsInDateRange, setProfileRank} from "../utils/statistics.js";

import SmartView from './smart';

const CURRENT_DATE = new Date();

// Рендеринг графика
const renderChart = (ctx, watchedGenres) => {
  const BAR_HEIGHT = 50;


  // Сортируем жанры по числу просмотров
  const sortedGenreTitles = Object.keys(watchedGenres)
    .sort(function (a, b) {
      return watchedGenres[b] - watchedGenres[a];
    });

  const watchedGenresCounts = [];
  for (let i = 0; i < sortedGenreTitles.length; i++) {
    watchedGenresCounts.push(watchedGenres[sortedGenreTitles[i]]);
  }

  ctx.height = BAR_HEIGHT * 5;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedGenreTitles,
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
          anchor: `start`,
          align: `start`,
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

const createStatisticsTemplate = (totalWatchedFilms, watchedFilms, watchedGenres, currentFilter, currentWatchedGenresCount) => {
  // Получение любимого жанра
  const getFavoriteGenre = () => {
    let max = 0;
    let favoriteGenre = ``;

    for (const genre in watchedGenres) {
      if (watchedGenres[genre] > max) {
        max = watchedGenres[genre];
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
      totalDuration += watchedFilms[i].durationNotFormatted;
    }
    return totalDuration;
  };

  const watchedFilmsQuantity = watchedFilms.length;

  let watchedFilmsStatTitle = `movies`;
  if (watchedFilmsQuantity === 1) {
    watchedFilmsStatTitle = `movie`;
  }

  // Генерация фильтров статистики
  const generateInputs = () => {
    let inputs = ``;

    for (const statFilter in StatisticsFilters) {
      if (StatisticsFilters.hasOwnProperty(statFilter)) {
        const isChecked = () => {
          let string = ``;
          if (StatisticsFilters[statFilter] === currentFilter) {
            string += `checked`;
          }
          return string;
        };

        inputs +=
          `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="${StatisticsFilters[statFilter]}" value="${StatisticsValues[statFilter]}" ${isChecked()}>
        <label for="${StatisticsFilters[statFilter]}" class="statistic__filters-label">${StatisticsLabels[statFilter]}</label>`;
      }
    }

    return inputs;
  };

  const canvasToggler = () => {
    if (currentWatchedGenresCount > 0) {
      return (
        `<div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
        </div>`
      );
    } else {
      return (``);
    }
  };

  const formattedDuration = (minutes) => {
    const hrs = Math.trunc(minutes / 60);
    const mins = minutes % 60;
    return hrs + `h ` + mins + `m`;
  };

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${setProfileRank(totalWatchedFilms.length)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${generateInputs()}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsQuantity} <span class="statistic__item-description">${watchedFilmsStatTitle}</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${(formattedDuration(getTotalWatchedFilmsDuration()))}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${favoriteGenre}</p>
        </li>
      </ul>
      ${canvasToggler()}
    </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();
    this._currentWatchedGenresCount = 0;
    this._totalWatchedFilms = filter[FilterType.HISTORY](films);
    this._totalWatchedGenres = this._getWatchedGenres(this._totalWatchedFilms);

    // Фильмы за прошедший год
    const yearBefore = new Date().setFullYear(new Date().getFullYear() - 1);
    this._filmsWatchedLastYear = getWatchedFilmsInDateRange(this._totalWatchedFilms, yearBefore, CURRENT_DATE);

    // Фильмы за прошедший месяц
    const monthBefore = new Date().setMonth(new Date().getMonth() - 1);
    this._filmsWatchedLastMonth = getWatchedFilmsInDateRange(this._totalWatchedFilms, monthBefore, CURRENT_DATE);

    // Фильмы за прошедшую неделю
    const weekBefore = new Date().setDate(new Date().getDate() - 7);
    this._filmsWatchedLastWeek = getWatchedFilmsInDateRange(this._totalWatchedFilms, weekBefore, CURRENT_DATE);

    // Фильмы за прошедшие сутки
    const dayBefore = new Date().setDate(new Date().getDate() - 1);
    this._filmsWatchedToday = getWatchedFilmsInDateRange(this._totalWatchedFilms, dayBefore, CURRENT_DATE);

    this._currentFilter = StatisticsFilters.ALL_TIME;
    this._currentWatchedFilms = this._totalWatchedFilms;
    this._currentWatchedGenres = this._totalWatchedGenres;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._changeStatTimeClickHandler();

    this._setChart();
  }

  getTemplate() {
    return createStatisticsTemplate(
        this._totalWatchedFilms,
        this._currentWatchedFilms,
        this._currentWatchedGenres,
        this._currentFilter,
        this._currentWatchedGenresCount
    );
  }

  restoreHandlers() {
    this._setChart();
    this._changeStatTimeClickHandler();
  }

  // Сбор данных о том, какие жанры были просмотрены и сколько раз
  _getWatchedGenres(films) {
    this._currentWatchedGenresCount = 0;
    const watchedGenres = {};
    films.forEach((film) => {
      film.genres.forEach((genre) => {
        if (!watchedGenres[genre]) {
          watchedGenres[genre] = 1;
          this._currentWatchedGenresCount++;
        } else {
          watchedGenres[genre]++;
        }
      });
    });
    return watchedGenres;
  }

  _setChart() {
    if (this._currentWatchedGenresCount === 0) {
      return;
    }

    const ctx = this.getElement().querySelector(`.statistic__chart`);
    renderChart(ctx, this._currentWatchedGenres);
  }


  _changeStatTimeClickHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._dateChangeHandler);
  }


  _dateChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.id === this._currentFilter) {
      return;
    }

    switch (evt.target.id) {
      case StatisticsFilters.TODAY:
        this._currentWatchedFilms = this._filmsWatchedToday;
        this._currentFilter = StatisticsFilters.TODAY;
        break;

      case StatisticsFilters.WEEK:
        this._currentWatchedFilms = this._filmsWatchedLastWeek;
        this._currentFilter = StatisticsFilters.WEEK;
        break;

      case StatisticsFilters.MONTH:
        this._currentWatchedFilms = this._filmsWatchedLastMonth;
        this._currentFilter = StatisticsFilters.MONTH;
        break;

      case StatisticsFilters.YEAR:
        this._currentWatchedFilms = this._filmsWatchedLastYear;
        this._currentFilter = StatisticsFilters.YEAR;
        break;

      default:
        this._currentWatchedFilms = this._totalWatchedFilms;
        this._currentFilter = StatisticsFilters.ALL_TIME;
        break;
    }

    this._currentWatchedGenres = this._getWatchedGenres(this._currentWatchedFilms);
    this.updateElement();
  }
}
