import BoardView from '../view/board.js';
import SortingView from '../view/sorting.js';
import TaskListView from '../view/task-list.js';
import NoTaskView from '../view/no-task.js';
import LoadMoreButtonView from '../view/load-more-button.js';
import LoadingView from '../view/loading.js';
import TaskPresenter, {State as TaskPresenterViewState} from './task.js';
import TaskNewPresenter from './task-new.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import {SortingTypes, UserAction, UpdateType} from '../const.js';
import {sortTaskUp, sortTaskDown} from '../utils/task.js';
import {filter} from '../utils/filter.js';

const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer, tasksModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortingTypes.DEFAULT;
    this._taskPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._sortingComponent = null;
    this._loadMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._taskNewPresenter = new TaskNewPresenter(this._taskListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._taskListComponent);

    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._taskListComponent);
    remove(this._boardComponent);

    this._tasksModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTask(callback) {
    this._taskNewPresenter.init(callback);
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filtredTasks = filter[filterType](tasks);

    switch (this._currentSortType) {
      case SortingTypes.DATE_UP:
        return filtredTasks.sort(sortTaskUp);
      case SortingTypes.DATE_DOWN:
        return filtredTasks.sort(sortTaskDown);
    }

    return filtredTasks;
  }

  _handleModeChange() {
    this._taskNewPresenter.destroy();
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._taskPresenter[update.id].setViewState(TaskPresenterViewState.SAVING);
        this._api.updateTask(update)
          .then((response) => this._tasksModel.updateTask(updateType, response))
          .catch(() => this._taskPresenter[update.id].setViewState(TaskPresenterViewState.ABORTING));
        break;
      case UserAction.ADD_TASK:
        this._taskNewPresenter.setSaving();
        this._api.addTask(update)
          .then((response) => this._tasksModel.addTask(updateType, response))
          .catch(() => this._taskNewPresenter.setAbording());
        break;
      case UserAction.DELETE_TASK:
        this._taskPresenter[update.id].setViewState(TaskPresenterViewState.DELETING);
        this._api.deleteTask(update)
          .then(() => this._tasksModel.deleteTask(updateType, update))
          .catch(() => this._taskPresenter[update.id].setViewState(TaskPresenterViewState.ABORTING));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({
          resetRenderedTaskCount: true,
          resetSortType: true,
        });
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortingType) {
    if (this._currentSortingType === sortingType) {
      return;
    }

    this._currentSortType = sortingType;
    this._clearBoard({
      resetRenderedTaskCount: true,
    });
    this._renderBoard();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortingComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleViewAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTER_BEGIN);
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.AFTER_BEGIN);
  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);

    render(this._boardComponent, this._loadMoreButtonComponent);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;

    this._taskNewPresenter.destroy();

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortingComponent);
    remove(this._noTaskComponent);
    remove(this._loadingComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortingTypes.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();

    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedTaskCount)));

    if (taskCount > this._renderedTaskCount) {
      this._renderLoadMoreButton();
    }
  }
}
