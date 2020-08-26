import AbstractView from './abstract.js';
import {SortingTypes} from '../const.js';

const createSortingTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sorting-type="${SortingTypes.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sorting-type="${SortingTypes.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sorting-type="${SortingTypes.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

export default class SortingView extends AbstractView {
  constructor() {
    super();

    this._sortingTypeChangeHandler = this._sortingTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortingTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingTypeChange(evt.target.dataset.sortingType);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sortingTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortingTypeChangeHandler);
  }
}
