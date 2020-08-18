import {KEY_CODE_ESCAPE} from "./const.js";

const getRandomBool = () => Math.random() < 0.5;
const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomSet = (items, num) => [...new Set(items.sort(getRandomBool).slice(0, num))];

const addSpaceToStrings = (strings) => {
  for (let i = 1; i < strings.length; i++) {
    strings[i] = ` ` + strings[i];
  }

  return strings;
};

const getRandomDate = (from, to) => new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));

// Для автоматически генерируемых элементов мы используем id типа film-1, film-2 и т.д.
// Данная функция возвращает число из произвольного id, которое можно будет использовать как порядковый номер элемента.
const getNumberFromString = (string) => {
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

const renderPosition = {
  afterBegin: `afterbegin`,
  beforeEnd: `beforeend`
};

const render = (container, element, place) => {
  switch (place) {
    case renderPosition.afterBegin:
      container.prepend(element);
      break;
    case renderPosition.beforeEnd:
      container.append(element);
      break;
  }
};

// Принцип работы прост:
// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
const createElement = (template) => {
  const newElement = document.createElement(`div`); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

const isEscapeDown = (evt) => evt.keyCode === KEY_CODE_ESCAPE;

export {
  getRandomBool,
  getRandomArrayElement,
  getRandomInteger,
  getRandomSet,
  addSpaceToStrings,
  getRandomDate,
  getNumberFromString,
  renderPosition,
  render,
  createElement,
  isEscapeDown
};
