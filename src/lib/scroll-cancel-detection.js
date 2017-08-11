export default class ScrollCancelDetection {
  constructor() {
    this.callback = null;
    this.doc = null;
    this.on = this.on.bind(this);
    this._detect = this._detect.bind(this);
    this.off = this.off.bind(this);
  }

  _detect(e) {
    const from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName === 'HTML') {
      if (this.callback) this.callback();
    }
  }

  on(doc, callback) {
    if (this.callback) return;
    this.callback = callback;
    this.doc = doc;
    doc.addEventListener('mouseout', this._detect);
    doc.addEventListener('touchcancel', callback);
  }

  off() {
    if (!this.doc || !this.callback) return;
    this.doc.removeEventListener('mouseout', this._detect);
    this.doc.removeEventListener('touchcancel', this.callback);
    this.doc = null;
    this.callback = null;
  }
}
