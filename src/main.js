import SiteMenuView from './view/site-menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createBoardTemplate} from './view/board.js';
import {createSortingTemplate} from './view/sorting.js';
import {createTaskTemplate} from './view/task.js';
import {createTaskEditTemplate} from './view/task-edit.js';
import {createLoadMoreButtonTemplate} from './view/load-more-button.js';
// import {createStatisticTemplate} from './view/statistic.js';
import {generateTask} from './mock/task.js';
import {RenderPosition, renderTemplate, renderElement} from './utils.js';

const TASK_COUNT = 18;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

renderElement(headerElement, new SiteMenuView().getElement());
renderTemplate(mainElement, createFilterTemplate(tasks));
renderTemplate(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const tasklistElement = mainElement.querySelector(`.board__tasks`);

renderTemplate(boardElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);

renderTemplate(tasklistElement, createTaskEditTemplate(tasks[0]));
for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(tasklistElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  renderTemplate(boardElement, createLoadMoreButtonTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(tasklistElement, createTaskTemplate(task)));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
