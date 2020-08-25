import {isExpiredTask, isRepeatingTask, humanizeTaskDate} from '../utils.js';
import AbstractView from './abstract.js';

const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button
      type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
      ${name}
    </button>`
  );
};

const createTaskTemplate = (task) => {
  const {
    description,
    dueDate,
    repeatingDays,
    color,
    isFavorite,
    isArchive,
  } = task;

  const date = (dueDate !== null)
    ? humanizeTaskDate(dueDate)
    : ``;

  const deadlineClass = isExpiredTask(dueDate)
    ? `card--deadline`
    : ``;

  const repeatingClass = isRepeatingTask(repeatingDays)
    ? `card--repeat`
    : ``;

  const editButton = createButtonMarkup(`edit`);
  const archiveButton = createButtonMarkup(`archive`, isArchive);
  const favoriteButton = createButtonMarkup(`favorites`, isFavorite);

  return (
    `<article class="card card--${color} ${repeatingClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoriteButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class TaskView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }
}
