import {SORTING_ENTRIES} from "../const.js";

const generateSortingElements = () => {
  let sortingList = ``;

  for (let i = 0; i < SORTING_ENTRIES.length; i++) {
    const isActive = SORTING_ENTRIES[i] === `Sort by default`
      ? ` sort__button--active`
      : ``;

    sortingList +=
      `<li>
        <a href="#" class="sort__button${isActive}">${SORTING_ENTRIES[i]}</a>
      </li>`;
  }

  return sortingList;
};

export const createSortTemplate = () => {
  return (
    `<ul class="sort">
        ${generateSortingElements()}
    </ul>`
  );
};

