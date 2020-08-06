import {isExpiredTask, isExpiredTaskToday, isRepeatingTask} from '../utils.js';

const taskToFilterMap = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isExpiredTask(task.dueDate)).length,
  today: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isExpiredTaskToday(task.dueDate)).length,
  favorites: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => task.isFavorite).length,
  repeating: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isRepeatingTask(task.repeatingDays)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length,
};

const generateFilter = (tasks) => {
  return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(tasks),
    };
  });
};

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${(count === 0) ? `disabled` : ``}
    >
    <label for="filter__${name}" class="filter__label">
      ${name}
      <span class="filter__${name}-count">${count}</span>
    </label>`
  );
};

export const createFilterTemplate = (tasks) => {
  const filters = generateFilter(tasks);
  const filterItemTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filterItemTemplate}
    </section>`
  );
};
