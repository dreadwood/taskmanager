import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import TasksModel from './model/tasks.js';
import FilterModel from './model/filter.js';
import Api from './api/api.js';
import {generateTask} from './mock/task.js';
import {render, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';


const TASK_COUNT = 22;
const AUTHORIZATION = `Basic hSsilf82dcl1sa2j`;
const END_POINT = `https://14.ecmascript.pages.academy/task-manager`;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);
const api = new Api(END_POINT, AUTHORIZATION);

api.getTasks().then((task) => {
  console.log(task);
});

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const siteMenuComponent = new SiteMenuView();
render(headerElement, siteMenuComponent);

const boardPresenter = new BoardPresenter(mainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, tasksModel);

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      // Скрыть статистику
      remove(statisticsComponent);
      // Показать доску
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      // Показать форму добавления новой задачи
      boardPresenter.createTask(handleTaskNewFormClose);
      // Убрать выделение с ADD NEW TASK после сохранения
      siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;
    case MenuItem.TASKS:
      // Показать доску
      boardPresenter.init();
      // Скрыть статистику
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      // Скрыть доску
      boardPresenter.destroy();
      // Показать статистику
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(mainElement, statisticsComponent);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();
