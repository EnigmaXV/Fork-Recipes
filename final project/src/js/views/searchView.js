//Get query from search bar

class searchView {
  #parentElement = document.querySelector(".search");

  getQuery() {
    const query = this.#parentElement.querySelector(".search__field").value;
    this.#clear();
    return query;
  }
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener("submit", e => {
      e.preventDefault();

      handler();
    });
  }
  #clear() {
    this.#parentElement.querySelector(".search__field").value = "";
  }
}
export default new searchView();
