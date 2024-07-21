import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

icons.slice(0, -14);
import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet!';
  _message = '';
  addBookmarkHandler(handler) {
    window.addEventListener('load', handler);
  }
  _generateHTML() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
