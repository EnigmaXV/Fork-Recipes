import icons from "url:../../img/icons.svg";
class paginationView {
  #parentElement = document.querySelector(".pagination");
  #data;
  render(data) {
    //NOTE
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  #generateMarkup() {
    const curPage = this.#data.page;
    const numPages = Math.ceil(
      this.#data.results.length / this.#data.resultsPerPage
    );
    console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Page 1, and there are NO other pages
    return "";
  }
  #clear() {
    this.#parentElement.innerHTML = "";
  }
  addHandlerClick(handler) {
    this.#parentElement.addEventListener("click", e => {
      //NOTE event delegation
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      //   console.log(btn);
      const pageToGo = +btn.dataset.goto;
      //   console.log(pageToGo);
      handler(pageToGo);
    });
  }
}

export default new paginationView();
