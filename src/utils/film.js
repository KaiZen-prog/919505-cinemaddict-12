import moment from "moment";

export const formatFilmReleaseYear = (date)=>{
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`YYYY`);
};

export const formatFilmReleaseDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`DD MMMM YYYY`);
};

export const humanizeDuration = function (duration) {
  let hours = Math.floor(duration / 60) + `h`;
  let minutes = duration % 60 + `m`;

  if (Math.floor(duration / 60) === 0) {
    hours = ``;
  }

  if (duration % 60 === 0) {
    minutes = ``;
  }

  return hours + ` ` + minutes;
};
