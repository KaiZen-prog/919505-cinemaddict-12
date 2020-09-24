import Abstract from './abstract';
import {setProfileRank} from "../utils/statistics";

const createUserProfileTemplate = (filmsCount) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${setProfileRank(filmsCount)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends Abstract {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createUserProfileTemplate(this._filmsCount);
  }
}
