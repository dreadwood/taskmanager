import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {SortingTypes} from "../const.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortingTypes.DEFAULT;

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourceBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);

    this._renderBoard();
  }

  _sortTasks(sortingType) {
    switch (sortingType) {
      case SortingTypes.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortingTypes.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourceBoardTasks.slice();
    }

    this._currentSortType = sortingType;
  }

  _handleSortTypeChange(sortingType) {
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._sortTasks(sortingType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSorting() {
    render(this._boardComponent, this._sortingComponent);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
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

    render(this._taskListComponent, taskComponent);
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTER_BEGIN); // remove RenderPosition
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _clearTaskList() {
    this._taskListComponent.getElement().innerHTML = ``;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();

    render(this._boardComponent, this._taskListComponent);
    this._renderTaskList();
  }
}
