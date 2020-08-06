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
const TASK_COUNT_PER_STEP = 8;

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
const tasklistElement = mainElement.querySelector(`.board__tasks`);

render(boardElement, createSortingTemplate(), RenderPosition.AFTER_BEGIN);

render(tasklistElement, createTaskEditTemplate(tasks[0]));
for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(tasklistElement, createTaskTemplate(tasks[i]));
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  render(boardElement, createLoadMoreButtonTemplate());

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(tasklistElement, createTaskTemplate(task)));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
