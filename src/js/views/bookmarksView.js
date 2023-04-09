import icons from "url:../../img/icons.svg"; // Parcel 2
class bookmarksView {
  #parentElement = document.querySelector(".bookmarks__list");
  #data;
  #errorMessage = " We couldn't find that recipe 😢 please try another one";

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  #clear() {
    this.#parentElement.innerHTML = "";
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

  addHandlerBookmark(handler) {
    window.addEventListener("load", () => {
      handler();
    });
  }
}
export default new bookmarksView();
