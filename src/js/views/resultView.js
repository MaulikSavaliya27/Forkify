import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No Recipes found for your query!please try another One.`;
  _message = ``;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
