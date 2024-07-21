import icons from 'url:../../img/icons.svg';
icons.slice(0, -14);
import View from './view';

class PaginationVeiw extends View {
  _parentElement = document.querySelector('.pagination');

  addClickHandler = function (handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  };

  _generateHTML() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.resault.length / this._data.resaultPage
    );
    // 1) page 1 with other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateHTMLForButtons('next', curPage);
    }

    // 3) last page
    if (curPage === numPages && numPages > 1) {
      return this._generateHTMLForButtons('prev', curPage);
    }
    // 4) other page
    if (this._data.page < numPages) {
      return (
        this._generateHTMLForButtons('next', curPage) +
        this._generateHTMLForButtons('prev', curPage)
      );
    }
    // 2) page 1 without pages
    return '';
  }

  _generateHTMLForButtons(flag, curPage) {
    let arrow;
    flag === 'next' ? (curPage = curPage + 1) : (curPage = curPage - 1);
    flag === 'next' ? (arrow = 'right') : (arrow = 'left');

    const html = `
              <button data-goto ="${curPage}"
                class="btn--inline pagination__btn--${flag}">
                ${
                  flag === 'next' ? `<span>Page ${curPage}</span>` : ''
                }            
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-${arrow}"></use>
                </svg>
                ${flag === 'prev' ? `<span>Page ${curPage}</span>` : ''}
              </button> 
    `;
    return html;
  }
}
export default new PaginationVeiw();
