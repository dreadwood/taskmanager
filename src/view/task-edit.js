import {COLORS} from '../const.js';
import {isRepeatingTask, formatTaskDueDate} from '../utils/task.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import he from 'he';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_TASK = {
  description: ``,
  dueDate: null,
  color: COLORS[0],
  repeatingDays: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => {
  return (
    `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${formatTaskDueDate(dueDate)}"
        >
      </label>
    </fieldset>` : ``}`
  );
};

const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {
  return (
    `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>

    ${isRepeating ? `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(repeating).map(([day, repeat], index) => `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${repeat ? `checked` : ``}
        >
        <label
          class="card__repeat-day"
          for="repeat-${day}-${index}"
        >${day}</label>`).join(`\n`)}
      </div>
    </fieldset>` : ``}`
  );
};

const createTaskEditColorsTemplate = (currentColor) => {
  return COLORS.map((color, index) => {
    return (
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${currentColor === color ? `checked` : ``}
      >
      <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
      >${color}</label>`
    );
  }).join(``);
};

const createTaskEditTemplate = (data) => {
  const {
    description,
    dueDate,
    color,
    repeatingDays,
    isDueDate,
    isRepeating,
  } = data;

  const repeatingClass = isRepeating
    ? `card--repeat`
    : ``;
  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
  const repeatingTemplate = createTaskEditRepeatingTemplate(repeatingDays, isRepeating);
  const colorsTemplate = createTaskEditColorsTemplate(color);

  const isSubmitDisabled = (isDueDate && dueDate === null)
    || isRepeating && !isRepeatingTask(repeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatingClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${he.encode(description)}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}
                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button
              class="card__save"
              type="submit"
              ${isSubmitDisabled ? `disabled` : ``}
            >save</button>
            <button
              class="card__delete"
              type="button"
            >delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEditView extends SmartView {
  constructor(task = BLANK_TASK) {
    super();
    this._data = TaskEditView.parseTaskToData(task);
    this.datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(task) {
    this.updateData(
        TaskEditView.parseTaskToData(task)
    );
  }

  getTemplate() {
    return createTaskEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this.datepicker) {
      this.datepicker.destroy();
      this.datepicker = null;
    }

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler,
          }
      );
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._dueDateToggleHandler);
    this.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._repeatingToggleHandler);
    this.getElement()
      .querySelector(`.card__text`)
      .addEventListener(`input`, this._descriptionInputHandler);

    if (this._data.isRepeating) {
      this.getElement()
        .querySelector(`.card__repeat-days-inner`)
        .addEventListener(`change`, this._repeatingChangeHandler);
    }

    this.getElement()
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, this._colorChangeHandler);
  }

  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false,
    });
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false,
    });
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value,
    }, true);
  }

  _dueDateChangeHandler([userDate]) {
    userDate.setHours(23, 59, 59, 999);

    this.updateData({
      dueDate: userDate,
    });
  }

  _repeatingChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      repeatingDays: Object.assign(
          {},
          this._data.repeatingDays,
          {[evt.target.value]: evt.target.checked}
      ),
    });
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value,
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEditView.parseDataToTask(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TaskEditView.parseDataToTask(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }

  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: task.dueDate !== null,
          isRepeating: isRepeatingTask(task.repeatingDays),
        }
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }
}
