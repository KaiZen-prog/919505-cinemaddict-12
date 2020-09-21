import Abstract from './abstract';
import {ProfileRating} from "../const";

const createUserProfileTemplate = (filmsCount) => {
  const setProfileRating = () => {
    let profileNickName = ``;

    switch (true) {
      case (filmsCount >= 1 && filmsCount <= 10):
        profileNickName = ProfileRating.NOVICE;
        break;
      case (filmsCount >= 11 && filmsCount <= 20):
        profileNickName = ProfileRating.FAN;
        break;
      case (filmsCount >= 21):
        profileNickName = ProfileRating.MOVIE_BUFF;
        break;
      default:
        profileNickName = ``;
        break;
    }
    return profileNickName;
  };

  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${setProfileRating()}</p>
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
