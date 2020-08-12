import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
import BoardView from './view/board.js';
import TaskListView from './view/task-list.js';
import SortingView from './view/sorting.js';
import TaskView from './view/task.js';
import TaskEditView from './view/task-edit.js';
import LoadMoreButtonView from './view/load-more-button.js';
import NoTaskView from './view/no-task.js';
// import StatisticView from './view/statistic.js';
import {generateTask} from './mock/task.js';
import {RenderPosition, render} from './utils.js';

const TASK_COUNT = 0;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);


const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const renderTask = (container, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    container.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    container.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, taskComponent.getElement());
};

render(headerElement, new SiteMenuView().getElement());
render(mainElement, new FilterView(tasks).getElement());

const boardComponent = new BoardView();
render(mainElement, boardComponent.getElement());

if (tasks.every((task) => task.isArchive)) {
  render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTER_BEGIN);
} else {
  const taskListComponent = new TaskListView();
  render(boardComponent.getElement(), taskListComponent.getElement());

  render(boardComponent.getElement(), new SortingView().getElement(), RenderPosition.AFTER_BEGIN);

  for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
    renderTask(taskListComponent.getElement(), tasks[i]);
  }

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    render(boardComponent.getElement(), new LoadMoreButtonView().getElement());

    const loadMoreButton = boardComponent.getElement().querySelector(`.load-more`);
    loadMoreButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      tasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponent.getElement(), task));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= tasks.length) {
        loadMoreButton.remove();
      }
    });
  }
}
