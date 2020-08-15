import {KEY_CODE_ESCAPE} from "./const.js";

const getRandomBool = () => Math.random() < 0.5;
const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomSet = (items, num) => [...new Set(items.sort(getRandomBool).slice(0, num))];

const addSpaceToStrings = function (strings) {
  for (let i = 1; i < strings.length; i++) {
    strings[i] = ` ` + strings[i];
  }

  return strings;
};

function getRandomDate(from, to) {
  from = from.getTime();
  to = to.getTime();

  return new Date(from + Math.random() * (to - from));
}

// Для автоматически генерируемых элементов мы используем id типа film-1, film-2 и т.д.
// Данная функция возвращает число из произвольного id, которое можно будет использовать как порядковый номер элемента.
const getNumberFromString = function (string) {
  let number = ``;
  for (let i = 0; i < string.length; i++) {
    if (parseInt(string[i], 10)) {
      number += string[i];
    }

    if (string[i] === `0`) {
      number += string[i];
    }
  }
  return parseInt(number, 10);
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const isEscapeDown = function (evt) {
  return evt.keyCode === KEY_CODE_ESCAPE;
};

export {
  getRandomBool,
  getRandomArrayElement,
  getRandomInteger,
  getRandomSet,
  addSpaceToStrings,
  getRandomDate,
  getNumberFromString,
  render,
  isEscapeDown
};
