import AbstractView from "./smart.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = (menuItem) => {
  return `<a
            href="#stats"
            class="main-navigation__additional ${menuItem === MenuItem.FILMS ? `main-navigation__additional--active` : ``}"
            data-menu-item="${menuItem}">
            Stats
         </a>`;
};

export default class SiteMenu extends AbstractView {
  constructor(menuItem) {
    super();
    this._menuItem = menuItem;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItem);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
