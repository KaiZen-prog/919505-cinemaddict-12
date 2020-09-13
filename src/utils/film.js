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
