import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
    parentElement = document.querySelector('.results');
    errorMessage = 'Could not find recipe for your query.Please try again!';
    message = '';
    generateMarkup() {
        return this.data.map(result => previewView.render(result, false)).join('');
    }
}
export default new ResultsView();