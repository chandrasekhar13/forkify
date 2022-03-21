import icons from 'url:../../img/icons.svg';
export default class view {
    data;

    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        // console.log(data);
        this.data = data;
        const markup = this.generateMarkup();
        if (!render) return markup;

        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0))
        //     return this.renderError();
        // console.log(data);
        this.data = data;
        const newMarkup = this.generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        // console.log(newElements);
        const curElements = Array.from(this.parentElement.querySelectorAll('*'));
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            if (!newEl.isEqualNode(curEl)) {
                curEl.innerHTML = newEl.innerHTML;
            }
        });
        //console.log(curElements);
    }
    clear() {
        this.parentElement.innerHTML = '';
    }
    renderSpinner() {
        const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    renderError(message = this.errorMessage) {
        const markup = ` <div class="error">
  <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
  </div>
  <p>${message}</p>
</div>`;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    renderMessage(message = this.message) {
        const markup = ` <div class="message">
<div>
  <svg>
    <use href="${icons}#icon-alert-smile"></use>
  </svg>
</div>
<p>${message}</p>
</div>`;
        this.clear();
        this.parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}