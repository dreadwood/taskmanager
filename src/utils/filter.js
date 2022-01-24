import {FilterType} from '../const.js';
import {isExpiredTask, isExpiredTaskToday, isRepeatingTask} from './task.js';

export const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.OVERDUE]: (tasks) => tasks.filter((task) => isExpiredTask(task.dueDate)),
  [FilterType.TODAY]: (tasks) => tasks.filter((task) => isExpiredTaskToday(task.dueDate)),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite),
  [FilterType.REPEATING]: (tasks) => tasks.filter((task) => isRepeatingTask(task.repeatingDays)),
  [FilterType.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive),
};
