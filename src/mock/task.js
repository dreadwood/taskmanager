import {COLORS} from '../const.js';
import {getRandomInteger, getRandomArrayItems} from '../utils/common.js';

const TASK_COUNT = 22;
const DESCRIPTION = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];
export const DAYS_WEEK = [
  `mo`,
  `tu`,
  `we`,
  `th`,
  `fr`,
  `sa`,
  `su`,
];

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

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateTask = () => {
  const id = generateId();
  const description = getRandomArrayItems(DESCRIPTION);
  const dueDate = getRandomInteger() ? generateDate() : null;
  const repeatingDays = dueDate ? generateRepeatingDays() : generateRepeatingDays(true);
  const color = getRandomArrayItems(COLORS);
  const isFavorite = Boolean(getRandomInteger());
  const isArchive = Boolean(getRandomInteger());

  return {
    id,
    description,
    dueDate,
    repeatingDays,
    color,
    isFavorite,
    isArchive,
  };
};


export const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);
