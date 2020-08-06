import {createSiteMenuTemplate} from './view/site-menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortingTemplate} from './view/sorting.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
// import {createStatisticTemplate} from './view/statistic.js';
import {generateTask} from './mock/task.js';

const TASK_COUNT = 18;

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFOR_END: `beforeend`,
};

const render = (container, template, place = RenderPosition.BEFOR_END) => {
  container.insertAdjacentHTML(place, template);
};

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, createSiteMenuTemplate());
render(mainElement, createFilterTemplate(tasks));
render(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);

render(boardElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);
render(boardElement, createLoadMoreButtonTemplate());

const tasklistElement = mainElement.querySelector(`.board__tasks`);

render(tasklistElement, createTaskEditTemplate(tasks[0]));
for (let i = 1; i < TASK_COUNT; i++) {
  render(tasklistElement, createTaskTemplate(tasks[i]));
}
