import Observer from './observer.js';

export default class TasksModel extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  setTasks(updateType, tasks) {
    this._tasks = tasks.slice();

    this._notify(updateType);
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      update,
      ...this._tasks.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTask(updateType, update) {
    this._tasks = [
      update,
      ...this._tasks,
    ];

    this._notify(updateType, update);
  }

  deleteTask(updateType, update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tasks = [
      ...this._tasks.slice(0, index),
      ...this._tasks.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(task) {
    const adaptedTask = {
      ...task,
      // На клиенте дата хранится как экземпляр Date
      dueDate: task.due_date !== null ? new Date(task.due_date) : task.due_date,
      isArchive: task.is_archived,
      isFavorite: task.is_favorite,
      repeatingDays: task.repeating_days,
    };

    delete adaptedTask.due_date;
    delete adaptedTask.is_archived;
    delete adaptedTask.is_favorite;
    delete adaptedTask.repeating_days;

    return adaptedTask;
  }

  static adaptToServer(task) {
    const adaptedTask = {
      ...task,
      // На сервере дата хранится в ISO формате
      'due_date': task.dueDate instanceof Date ? task.dueDate.toISOString() : null,
      'is_archived': task.isArchive,
      'is_favorite': task.isFavorite,
      'repeating_days': task.repeatingDays,
    };

    delete adaptedTask.dueDate;
    delete adaptedTask.isArchive;
    delete adaptedTask.isFavorite;
    delete adaptedTask.repeating;

    return adaptedTask;
  }
}
