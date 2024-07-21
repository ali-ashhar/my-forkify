import icons from 'url:../../img/icons.svg';
icons.slice(0, -14);
import previewView from './previewView';
import View from './view';

class ResaultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'this search has no result please try another one ;)';
  _message = '';

  _generateHTML() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResaultView();
