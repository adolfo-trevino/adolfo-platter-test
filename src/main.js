class ProductList extends HTMLElement {
  constructor() {
    super();
    this.defineSelectors();
    }
  
  connectedCallback() {
    this.addEventListeners();
  }

  defineSelectors() {
    this.productGrid = this.querySelector('#product-grid');
    this.showMoreButton = this.querySelector('#show-more');
    this.moreProducts = this.querySelector('#more-products');
  }
  
  addEventListeners() {
    if(this.showMoreButton){
        this.showMoreButton.addEventListener('click', this.handleShowMore.bind(this));
    }
  }
  
  handleShowMore() {
    if(!this.moreProducts || !this.showMoreButton) return;
    this.moreProducts.classList.add('expanded');
    this.showMoreButton.setAttribute('aria-expanded', 'true');
    this.showMoreButton.classList.add('hidden');
  }
  
  removeEventListeners() {
    if(!this.showMoreButton){
    this.showMoreButton.removeEventListener('click', this.handleShowMore.bind(this));
    }
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }

}

customElements.define('product-list', ProductList);
