import {DESCRIPTION, COLORS, DAYS_WEEK} from '../const.js';
import {getRandomInteger, getRandomArrayItems} from '../utils.js';

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateRepeatingDays = (repeating = false) => {
  return DAYS_WEEK.reduce((obj, day) => {
    obj[day] = (repeating) ? Boolean(getRandomInteger()) : false;
    return obj;
  }, {});
};

export const generateTask = () => {
  const id = String(new Date().getTime() + Math.random());
  const description = getRandomArrayItems(DESCRIPTION);
  const dueDate = getRandomInteger() ? generateDate() : null;
  const repeatingDays = dueDate ? generateRepeatingDays() : generateRepeatingDays(true);
  const color = getRandomArrayItems(COLORS);
  const isFavorite = Boolean(getRandomInteger());
  const isArchive = Boolean(getRandomInteger());

  return {
    id,
    description, // string (min 1, max 140)
    dueDate,
    repeatingDays,
    color,
    isFavorite,
    isArchive,
  };
};
