'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scroller = function (_Component) {
  (0, _inherits3.default)(Scroller, _Component);

  function Scroller(props) {
    (0, _classCallCheck3.default)(this, Scroller);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scroller.__proto__ || (0, _getPrototypeOf2.default)(Scroller)).call(this, props));

    _this.state = {
      startAbsX: 0,
      startAbsY: 0,
      startRelX: 0,
      startRelY: 0
    };
    _this.el = null;
    _this.setWrapperRef = _this.setElRef.bind(_this);
    _this.handleScrollStart = _this.handleScrollStart.bind(_this);
    _this.handleScrollMove = _this.handleScrollMove.bind(_this);
    _this.handleScrollEnd = _this.handleScrollEnd.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Scroller, [{
    key: 'setElRef',
    value: function setElRef(el) {
      this.el = el;
    }
  }, {
    key: 'handleScrollStart',
    value: function handleScrollStart(e) {
      var _ref = e.touches && e.touches[0] || e,
          pageX = _ref.pageX,
          pageY = _ref.pageY;

      this.setState({
        startAbsX: pageX,
        startAbsY: pageY,
        startRelX: this.props.x,
        startRelY: this.props.y
      });

      var doc = this.el.ownerDocument;
      doc.addEventListener('touchmove', this.handleScrollMove);
      doc.addEventListener('mousemove', this.handleScrollMove);
      doc.addEventListener('touchend', this.handleScrollEnd, true);
      doc.addEventListener('mouseup', this.handleScrollEnd, true);

      if (typeof this.props.onScrollStart === 'function') {
        this.props.onScrollStart({
          x: this.props.x,
          y: this.props.y
        }, e);
      }
    }
  }, {
    key: 'handleScrollMove',
    value: function handleScrollMove(e) {
      if (e.touches && e.touches.length > 1) return;

      var _ref2 = e.touches && e.touches[0] || e,
          pageX = _ref2.pageX,
          pageY = _ref2.pageY;

      if (typeof this.props.onScroll === 'function') {
        this.props.onScroll({
          x: this.state.startRelX + pageX - this.state.startAbsX,
          y: this.state.startRelY + pageY - this.state.startAbsY
        }, e);
      }
    }
  }, {
    key: 'handleScrollEnd',
    value: function handleScrollEnd(e) {
      var doc = this.el.ownerDocument;
      doc.removeEventListener('touchmove', this.handleScrollMove);
      doc.removeEventListener('mousemove', this.handleScrollMove);
      doc.removeEventListener('touchend', this.handleScrollEnd, true);
      doc.removeEventListener('mouseup', this.handleScrollEnd, true);

      if (typeof this.props.onScrollEnd === 'function') {
        this.props.onScrollEnd({
          x: this.props.x,
          y: this.props.y
        }, e);
      }
    }
  }, {
    key: 'renderStyle',
    value: function renderStyle() {
      var _props = this.props,
          x = _props.x,
          y = _props.y;

      return (0, _assign2.default)({
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      }, this.props.style);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = _lodash2.default.omit(this.props, ['tagName', 'x', 'y', 'onScrollStart', 'onScroll', 'onScrollEnd']);

      return _react2.default.createElement(this.props.tagName, (0, _assign2.default)({}, props, {
        ref: this.setWrapperRef,
        onTouchStart: this.handleScrollStart,
        onMouseDown: this.handleScrollStart,
        style: this.renderStyle()
      }), this.props.children);
    }
  }]);
  return Scroller;
}(_react.Component);

exports.default = Scroller;


Scroller.propTypes = {
  tagName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.instanceOf(_react.Component)]),
  children: _react.PropTypes.node,
  onScrollStart: _react.PropTypes.func,
  onScroll: _react.PropTypes.func,
  onScrollEnd: _react.PropTypes.func,
  x: _react.PropTypes.number,
  y: _react.PropTypes.number
};

Scroller.defaultProps = {
  tagName: 'div',
  x: 0,
  y: 0,
  style: null
};