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

const TASK_COUNT = 18;
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

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, taskComponent.getElement());
};

const renderBoard = (container, boardTasks) => {
  const boardComponent = new BoardView();
  render(container, boardComponent.getElement());

  if (tasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.AFTER_BEGIN); // remove RenderPosition
    return;
  }

  render(boardComponent.getElement(), new SortingView().getElement());

  const taskListComponent = new TaskListView();
  render(boardComponent.getElement(), taskListComponent.getElement());

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (tasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(headerElement, new SiteMenuView().getElement());
render(mainElement, new FilterView(tasks).getElement());

renderBoard(mainElement, tasks);
