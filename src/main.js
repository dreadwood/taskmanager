'use strict';;

const TASK_COUNT = 3

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFOR_END: `beforeend`,
};

const createSiteMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        class="control__input visually-hidden"
      >

      <label
        for="control__new-task"
        class="control__label control__label--new-task"
      >
        + ADD NEW TASK
      </label>

      <input
        type="radio"
        name="control"
        id="control__task"
        class="control__input visually-hidden"
        checked=""
      >

      <label
        for="control__task"
        class="control__label"
      >
        TASKS
      </label>

      <input
        type="radio"
        name="control"
        id="control__statistic"
        class="control__input visually-hidden"
      >

      <label
        for="control__statistic"
        class="control__label"
      >
        STATISTICS
      </label>
    </section>`
  )
}

const createFilterTemplate = () => {
  return (
    `<section class="main__filter filter container">
      <input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
        checked=""
      >

      <label
        for="filter__all"
        class="filter__label"
      >All <span class="filter__all-count">13</span></label>

      <input
        type="radio"
        id="filter__overdue"
        class="filter__input visually-hidden"
        name="filter"
        disabled=""
      >

      <label
        for="filter__overdue"
        class="filter__label"
      >Overdue <span class="filter__overdue-count">0</span></label>

      <input
        type="radio"
        id="filter__today"
        class="filter__input visually-hidden"
        name="filter"
        disabled=""
      >

      <label
        for="filter__today"
        class="filter__label"
      >Today <span class="filter__today-count">0</span></label>

      <input
        type="radio"
        id="filter__favorites"
        class="filter__input visually-hidden"
        name="filter"
      >

      <label
        for="filter__favorites"
        class="filter__label"
      >Favorites <span class="filter__favorites-count">1</span></label>

      <input
        type="radio"
        id="filter__repeating"
        class="filter__input visually-hidden"
        name="filter"
      >

      <label
        for="filter__repeating"
        class="filter__label"
      >Repeating <span class="filter__repeating-count">1</span></label>

      <input
        type="radio"
        id="filter__archive"
        class="filter__input visually-hidden"
        name="filter"
      >

      <label
        for="filter__archive"
        class="filter__label"
      >Archive <span class="filter__archive-count">115</span></label>
    </section>`
  )
}

const createBoardTemplate = () => {
  return (
    `<section class="board container"></section>`
  )
}

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" class="board__filter">SORT BY DATE up</a>
      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>`
  )
}

const createTasklistTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  )
}

const createTaskTemplate = () => {
  return (
    `<article class="card card--pink card--repeat">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button type="button" class="card__btn card__btn--favorites">
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">It is example of repeating task. It marks by wave.</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">23 September</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  )
}

const createTaskEditTemplate = () => {
  return (
    `<article class="card card--edit card--yellow card--repeat">
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
              >This is example of task edit. You can set date and chose repeating days and color.</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">yes</span>
                </button>

                <fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="23 September 16:15"
                    >
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">yes</span>
                </button>

                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-mo-4"
                      name="repeat"
                      value="mo"
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-mo-4"
                    >mo</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-tu-4"
                      name="repeat"
                      value="tu"
                      checked=""
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-tu-4"
                    >tu</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-we-4"
                      name="repeat"
                      value="we"
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-we-4"
                    >we</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-th-4"
                      name="repeat"
                      value="th"
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-th-4"
                    >th</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-fr-4"
                      name="repeat"
                      value="fr"
                      checked=""
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-fr-4"
                    >fr</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      name="repeat"
                      value="sa"
                      id="repeat-sa-4"
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-sa-4"
                    >sa</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-su-4"
                      name="repeat"
                      value="su"
                      checked=""
                    >

                    <label
                      class="card__repeat-day"
                      for="repeat-su-4"
                    >su</label>
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                >

                <label
                  for="color-black-4"
                  class="card__color card__color--black"
                >black</label>

                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                  checked=""
                >

                <label
                  for="color-yellow-4"
                  class="card__color card__color--yellow"
                >yellow</label>

                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                >

                <label
                  for="color-blue-4"
                  class="card__color card__color--blue"
                >blue</label>

                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                >

                <label
                  for="color-green-4"
                  class="card__color card__color--green"
                >green</label>

                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                >

                <label
                  for="color-pink-4"
                  class="card__color card__color--pink"
                >pink</label>
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  )
}

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  )
}
const createStatisticTemplate = () => {
  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="01 Feb - 08 Feb"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">0</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic visually-hidden">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap visually-hidden">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  )
}

const render = (container, template, place = RenderPosition.BEFOR_END) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, createSiteMenuTemplate());
render(mainElement, createFilterTemplate());
render(mainElement, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);

render(boardElement, createSortTemplate());
render(boardElement, createTasklistTemplate());
render(boardElement, createLoadMoreButtonTemplate());

const tasklistElement = mainElement.querySelector(`.board__tasks`);

render(tasklistElement, createTaskEditTemplate());
for (let i = 0; i < TASK_COUNT; i++) {
  render(tasklistElement, createTaskTemplate());
}
