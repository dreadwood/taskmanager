import AbstractView from './abstract.js';

const createTaskListTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class TaskListView extends AbstractView {
  getTemplate() {
    return createTaskListTemplate();
  }
}
