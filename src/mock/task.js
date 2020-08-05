const DESCRIPTION = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const COLOR = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`,
];

const DAYS_WEEK = [
  `mo`,
  `tu`,
  `we`,
  `th`,
  `fr`,
  `sa`,
  `su`,
];

// Функция генерации случайного целого числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayItems = (array) => {
  const randomIndex = getRandomInteger(array.length - 1);

  return array[randomIndex];
};

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
  const color = getRandomArrayItems(COLOR);
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
