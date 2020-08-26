import SiteMenuView from './view/site-menu.js';
import FilterView from './view/filter.js';
// import StatisticView from './view/statistic.js';
import {generateTask} from './mock/task.js';
import BoardPresenter from './presenter/board.js';
import {render} from './utils/render.js';

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill(``).map(generateTask);

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainElement);

render(headerElement, new SiteMenuView());
render(mainElement, new FilterView(tasks));

boardPresenter.init(tasks);
