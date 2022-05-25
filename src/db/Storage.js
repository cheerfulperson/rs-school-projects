class Storage {
  constructor(store) {
    this.store = store;
  }

  // * Should be async, but I decided do it sync
  getItem(key) {
    return JSON.parse(this.store.getItem(key));
  }

  // * Should be async
  setItem(key, value) {
    this.store.setItem(key, JSON.stringify(value));
  }

  getAll() {
    return this.store;
  }

  clear() {
    this.store.clear();
  }

  openStore(cb) {
    if (!this.store.getItem('games')) {
      this.store.setItem('games', '[]');
    }
    cb();
  }
}

export default new Storage(localStorage);
