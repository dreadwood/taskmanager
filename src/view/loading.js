import AbstractView from './abstract.js';

const createNoTaskTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Loading...
    </p>`
  );
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
