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
import {RenderPosition, render, replace, remove} from './utils/render.js';

const TASK_COUNT = 18;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const renderTask = (container, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, taskComponent);
};

const renderBoard = (container, boardTasks) => {
  const boardComponent = new BoardView();
  render(container, boardComponent);

  if (tasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTaskView(), RenderPosition.AFTER_BEGIN); // remove RenderPosition
    return;
  }

  render(boardComponent, new SortingView());

  const taskListComponent = new TaskListView();
  render(boardComponent, taskListComponent);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent, boardTask));

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent, loadMoreButtonComponent);

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent, boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

render(headerElement, new SiteMenuView());
render(mainElement, new FilterView(tasks));

renderBoard(mainElement, tasks);
