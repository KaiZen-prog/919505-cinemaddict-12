import FilterView from "../view/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FILTER_ENTRIES, UPDATE_TYPE} from "../const.js";

export default class Filter {
  constructor(filterContainer, filmsModel, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FILTER_ENTRIES.ALL,
        name: `All`,
        count: filter[FILTER_ENTRIES.ALL](films).length
      },
      {
        type: FILTER_ENTRIES.WATCHLIST,
        name: `Watchlist`,
        count: filter[FILTER_ENTRIES.WATCHLIST](films).length
      },
      {
        type: FILTER_ENTRIES.HISTORY,
        name: `History`,
        count: filter[FILTER_ENTRIES.HISTORY](films).length
      },
      {
        type: FILTER_ENTRIES.FAVORITES,
        name: `Favorites`,
        count: filter[FILTER_ENTRIES.FAVORITES](films).length
      }
    ];
  }
}