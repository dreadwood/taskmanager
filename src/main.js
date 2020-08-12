import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import BoardView from './view/board.js';
import SortingView from './view/sorting.js';
import TaskView from './view/task.js';
import TaskEditView from './view/task-edit.js';
import LoadMoreButtonView from './view/load-more-button.js';
// import StatisticView from './view/statistic.js';
import {generateTask} from './mock/task.js';
import {RenderPosition, renderElement} from './utils.js';

const TASK_COUNT = 18;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

renderElement(headerElement, new SiteMenuView().getElement());
renderElement(mainElement, new FilterView(tasks).getElement());
renderElement(mainElement, new BoardView().getElement());

const boardElement = mainElement.querySelector(`.board`);
const tasklistElement = mainElement.querySelector(`.board__tasks`);

renderElement(boardElement, new SortingView().getElement(), RenderPosition.AFTER_BEGIN);

renderElement(tasklistElement, new TaskEditView(tasks[0]).getElement());
for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderElement(tasklistElement, new TaskView(tasks[i]).getElement());
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  renderElement(boardElement, new LoadMoreButtonView().getElement());

  const loadMoreButton = boardElement.querySelector(`.load-more`);
  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderElement(tasklistElement, new TaskView(task).getElement()));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
