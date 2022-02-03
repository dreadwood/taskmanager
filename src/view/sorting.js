import AbstractView from './abstract.js';
import {SortingTypes} from '../const.js';

const createSortingTemplate = (currentSortType) => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter ${currentSortType === SortingTypes.DEFAULT ? `board__filter--active` : ``}" data-sorting-type="${SortingTypes.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter ${currentSortType === SortingTypes.DATE_UP ? `board__filter--active` : ``}" data-sorting-type="${SortingTypes.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter ${currentSortType === SortingTypes.DATE_DOWN ? `board__filter--active` : ``}" data-sorting-type="${SortingTypes.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

export default class SortingView extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortingTypeChangeHandler = this._sortingTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  setSortingTypeChangeHandler(callback) {
    this._callback.sortingTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortingTypeChangeHandler);
  }

  _sortingTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortingTypeChange(evt.target.dataset.sortingType);
  }
}
