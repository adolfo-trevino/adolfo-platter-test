class BestSellers extends HTMLElement {
  constructor() {
    super();
    this.defineSelectors();
    this.isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    // Custom Scrollbar state
    this.tx = 0;
    this.dragging = false;
    this.dragStartMouseX = 0;
    this.dragStartThumbX = 0;

    // Bound handlers stored so we can removeEventListener 
    this.onMouseMove = this.handleDragMove.bind(this);
    this.onMouseUp = this.handleDragEnd.bind(this);
    this.onTouchMove = e => this.handleDragMove(e.touches[0]);
    this.onTouchEnd = this.handleDragEnd.bind(this);
    this.onShowMore = this.handleShowMore.bind(this);
    this.onDragStart = this.handleDragStart.bind(this);
    this.onClickTrack = this.handleClickTrack.bind(this);
    }
  
  connectedCallback() {
    this.addEventListeners();
    requestAnimationFrame(() => this.syncUI());
  }

  defineSelectors() {
    this.productGrid = this.querySelector('#product-grid');
    this.showMoreButton = this.querySelector('#show-more');
    this.moreProducts = this.querySelector('#more-products');
    // Custom Scrollbar
    this.productGridContainer = this.querySelector('#product-grid-container');
    this.track = this.querySelector('.product-list-track');
    this.thumb = this.querySelector('.product-list-thumb');
  }

  geometry() {
    if (!this.productGridContainer || !this.productGrid || !this.track) {
      return { viewW: 0, totalW: 0, trackW: 0, maxTx: 0, thumbW: 40, thumbTravel: 0 };
    }
    this.viewW = this.productGridContainer.clientWidth || 0;
    this.totalW = this.productGrid.scrollWidth || 0;
    this.trackW = this.track.clientWidth || 0;
    this.maxTx = Math.max(0, this.totalW - this.viewW);
    this.thumbW = this.totalW > 0 ? Math.max(40, (this.viewW / this.totalW) * this.trackW) : 40;
    this.thumbTravel = Math.max(0, this.trackW - this.thumbW);
    return { viewW: this.viewW, totalW: this.totalW, trackW: this.trackW, maxTx: this.maxTx, thumbW: this.thumbW, thumbTravel: this.thumbTravel };
  }
  
  addEventListeners() {
    if (this.showMoreButton) {
      this.showMoreButton.addEventListener('click', this.onShowMore);
    }
    // Custom Scrollbar
    if (this.isDesktop) {
      this.thumb?.addEventListener('mousedown', this.onDragStart);
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);

      this.thumb?.addEventListener('touchstart', this.onDragStart);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);

      this.track?.addEventListener('click', this.onClickTrack);

      if (this.productGridContainer) {
        this.resizeObserver = new ResizeObserver(() => this.syncUI());
        this.resizeObserver.observe(this.productGridContainer);
      }
    }
  }
  
  /*
  Show More
  */
  handleShowMore() {
    if(!this.moreProducts || !this.showMoreButton) return;
    this.moreProducts.classList.add('expanded');
    this.showMoreButton.setAttribute('aria-expanded', 'true');
    this.showMoreButton.classList.add('hidden');
  }

  /*  
  Custom Scrollbar
  */
  syncUI() {
    if(!this.isDesktop) return;
    const { maxTx, thumbW, thumbTravel } = this.geometry();
    // Clamp _tx just in case
    this.tx = Math.min(0, Math.max(-maxTx, this.tx));

    // Progress 0→1 (how far we've scrolled)
    const progress = maxTx > 0 ? Math.abs(this.tx) / maxTx : 0;

    // Apply to product grid
    if (this.productGrid) {
      this.productGrid.style.transform = `translateX(${this.tx}px)`;
    }

    // SIZE & POSITION OF THUMB
    if (this.thumb) {
      this.thumb.style.width = `${thumbW}px`;
      this.thumb.style.transform = `translateX(${progress * thumbTravel}px)`;
    }

  }

  // Scrollbar Handlers
  handleDragStart(e) {
    if (!this.productGrid || !this.thumb) return;
    this.dragging = true;
    this.dragStartMouseX = e.clientX;

    const matrix = new DOMMatrix(getComputedStyle(this.thumb).transform);
    this.dragStartThumbX = matrix.m41 || 0;

    this.productGrid.classList.add('no-transition');
    this.thumb.style.transition = 'none';
  }
  handleDragMove(e) {
    if(!this.dragging) return;
    const { thumbTravel, maxTx } = this.geometry();

    const delta = e.clientX - this.dragStartMouseX;
    const newThumbX = Math.max(0, Math.min(thumbTravel, this.dragStartThumbX + delta));
    const progress = thumbTravel > 0 ? newThumbX / thumbTravel : 0;

    this.tx = -(progress * maxTx);
    this.syncUI();
  }
  handleDragEnd() {
    if (!this.dragging) return;
    this.dragging = false;
    this.productGrid?.classList.remove('no-transition');
    this.thumb?.style.removeProperty('transition');
  }
  handleClickTrack(e) {
    if (this.dragging || !this.isDesktop || e.target === this.thumb || !this.track) return;
    const { thumbW, thumbTravel, maxTx } = this.geometry();
    const rect = this.track.getBoundingClientRect();
    const rawLeft = e.clientX - rect.left - thumbW / 2;
    const clampedLeft = Math.max(0, Math.min(thumbTravel, rawLeft));
    const progress = thumbTravel > 0 ? clampedLeft / thumbTravel : 0;
    this.tx = -(progress * maxTx);
    this.syncUI();
  }

  removeEventListeners() {
    if (this.showMoreButton) {
      this.showMoreButton.removeEventListener('click', this.onShowMore);
    }
    if (this.isDesktop) {
      this.thumb?.removeEventListener('mousedown', this.onDragStart);
      this.thumb?.removeEventListener('touchstart', this.onDragStart);
      this.track?.removeEventListener('click', this.onClickTrack);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
      this.resizeObserver?.disconnect();
    }
  }
  
  disconnectedCallback() {
    this.removeEventListeners();
  }

}

customElements.define('best-sellers', BestSellers);
