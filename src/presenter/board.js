import BoardView from '../view/board.js';
import SortingView from '../view/sorting.js';
import TaskListView from '../view/task-list.js';
import NoTaskView from '../view/no-task.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import TaskPresenter from './task.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortingTypes} from '../const.js';
import {sortTaskUp, sortTaskDown} from '../utils/task.js';
import {updateItem} from '../utils/common.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortingTypes.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourceBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourceBoardTasks = updateItem(this._sourceBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
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
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
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
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
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
