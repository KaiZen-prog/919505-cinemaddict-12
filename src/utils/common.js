import {KEY_CODE_ESCAPE, KEY_CODE_CTRL, KEY_CODE_ENTER} from "../const.js";
export const isEscapeDown = (evt) => evt.keyCode === KEY_CODE_ESCAPE;
export const isCtrlEnterDown = (evt) => (evt.ctrlKey || evt.metaKey) && (evt.keyCode === KEY_CODE_CTRL || evt.keyCode === KEY_CODE_ENTER);

