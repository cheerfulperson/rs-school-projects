const cummonMixin = {
  closeAll(content) {
    const {
      children,
    } = content;

    for (const el of children) {
      if (!el.classList.contains('display-none')) {
        el.classList.add('display-none');
      }
    }
  },

  setContentVisibility(itemsForHide = [], itemsForShow = []) {
    itemsForHide.forEach((id) => {
      let el = document.getElementById(id);
      el = el.parentNode.tagName == 'LI' ? el.parentNode : el;
      if (!el.classList.contains('display-none')) {
        el.classList.add('display-none');
      }
    });
    itemsForShow.forEach((id) => {
      let el = document.getElementById(id);
      el = el.parentNode.tagName == 'LI' ? el.parentNode : el;
      if (el.classList.contains('display-none')) {
        el.classList.remove('display-none');
      }
    });
  },
  getImageUrl: (name) => `https://raw.githubusercontent.com/cheerfulperson/image-data/master/img/${name}.jpg`,
  addClassList(list) {
    if (!list) return;

    list.forEach((obj) => {
      const {
        selector,
        classList,
      } = obj;

      classList.forEach((name) => {
        document.querySelector(selector).classList.add(name);
      });
    });
  },
  removeClassList(list) {
    if (!list) return;

    list.forEach((obj) => {
      const {
        selector,
        classList,
      } = obj;

      classList.forEach((name) => {
        document.querySelector(selector).classList.remove(name);
      });
    });
  },
  countTrueAnswers(arr) {
    let amount = 0;
    for (const obj of arr) {
      if (obj.isTrue) amount++;
    }
    return amount;
  },
};

export default cummonMixin;
