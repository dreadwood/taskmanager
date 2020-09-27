import SiteMenuView from './view/site-menu.js';
// import StatisticView from './view/statistic.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import {render} from './utils/render.js';

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, new SiteMenuView());

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, tasksModel);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
});
