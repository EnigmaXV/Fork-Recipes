import icons from "url:../../img/icons.svg";
class resultsView {
  #parentElement = document.querySelector(".results");
  #data;
  #errorMessage = " We couldn't find that recipe 😢 please try another one";

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
    return this.#data.map(this.#generateMarkupPreview).join("");
  }
  #generateMarkupPreview(result) {
    return ` <li class="preview">
      <a class="preview__link" href="#${result.id}">
        <figure class="preview__fig">
          <img src="${result.image}" alt="${result.image}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.publisher}</p>
          <div class="">
  
          </div>
        </div>
      </a>
    </li>`;
  }
  #clear() {
    this.#parentElement.innerHTML = "";
  }
  renderSpinner() {
    const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderError(message = this.#errorMessage) {
    const markup = `<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>No recipes found for your query. Please try again!</p>
      </div>`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new resultsView();
