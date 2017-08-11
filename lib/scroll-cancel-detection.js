'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScrollCancelDetection = function () {
  function ScrollCancelDetection() {
    (0, _classCallCheck3.default)(this, ScrollCancelDetection);

    this.callback = null;
    this.doc = null;
    this.on = this.on.bind(this);
    this._detect = this._detect.bind(this);
    this.off = this.off.bind(this);
  }

  (0, _createClass3.default)(ScrollCancelDetection, [{
    key: '_detect',
    value: function _detect(e) {
      var from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName === 'HTML') {
        if (this.callback) this.callback();
      }
    }
  }, {
    key: 'on',
    value: function on(doc, callback) {
      if (this.callback) return;
      this.callback = callback;
      this.doc = doc;
      doc.addEventListener('mouseout', this._detect);
      doc.addEventListener('touchcancel', callback);
    }
  }, {
    key: 'off',
    value: function off() {
      if (!this.doc || !this.callback) return;
      this.doc.removeEventListener('mouseout', this._detect);
      this.doc.removeEventListener('touchcancel', this.callback);
      this.doc = null;
      this.callback = null;
    }
  }]);
  return ScrollCancelDetection;
}();

exports.default = ScrollCancelDetection;