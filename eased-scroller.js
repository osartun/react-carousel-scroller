'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _sign = require('babel-runtime/core-js/math/sign');

var _sign2 = _interopRequireDefault(_sign);

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

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _scroller = require('./scroller');

var _scroller2 = _interopRequireDefault(_scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTimestamp = (typeof performance === 'undefined' ? 'undefined' : (0, _typeof3.default)(performance)) === "object" ? performance.now.bind(performance) : Date.now.bind(Date);

var EasedScroller = function (_Component) {
  (0, _inherits3.default)(EasedScroller, _Component);

  function EasedScroller(props) {
    (0, _classCallCheck3.default)(this, EasedScroller);

    var _this = (0, _possibleConstructorReturn3.default)(this, (EasedScroller.__proto__ || (0, _getPrototypeOf2.default)(EasedScroller)).call(this, props));

    _this.state = {
      scrolling: false,
      ending: false,
      style: null,
      direction: 0,
      timestamp: createTimestamp(),
      velocity: 0,
      acceleration: 0
    };
    _this.el = null;
    _this.setRefEl = _this.setRefEl.bind(_this);
    _this.handleScrollStart = _this.handleScrollStart.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleScrollEnd = _this.handleScrollEnd.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(EasedScroller, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var orientation = this.props.orientation;
      if (nextProps[orientation] !== this.props[orientation] && !this.state.scrolling && !this.state.ending) {
        this.setState({ style: this.getStyle() });
      }
    }
  }, {
    key: 'setRefEl',
    value: function setRefEl(comp) {
      this.el = comp.el;
    }
  }, {
    key: 'handleScrollStart',
    value: function handleScrollStart(pos, e) {
      this.setState({
        scrolling: true,
        style: null,
        timestamp: createTimestamp(),
        velocity: 0,
        acceleration: 1
      });
      if (typeof this.props.onScrollStart === 'function') {
        this.props.onScrollStart(pos, e);
      }
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(pos, e) {
      var orientation = this.props.orientation;
      var timestamp = createTimestamp();
      var timeDelta = timestamp - this.state.timestamp;
      var lineDelta = pos[orientation] - this.props[orientation];
      var velocity = lineDelta / timeDelta; // px per millisecond
      var acceleration = (velocity - this.state.velocity) / Math.pow(timeDelta, 2);
      this.setState({
        direction: (0, _sign2.default)(lineDelta),
        timestamp: timestamp,
        velocity: velocity,
        acceleration: acceleration
      });
      if (typeof this.props.onScroll === 'function') {
        var _Object$assign2;

        var _state = this.state,
            direction = _state.direction,
            _velocity = _state.velocity,
            _acceleration = _state.acceleration;

        this.props.onScroll((0, _assign2.default)({}, pos, (_Object$assign2 = {}, (0, _defineProperty3.default)(_Object$assign2, orientation, pos[orientation]), (0, _defineProperty3.default)(_Object$assign2, 'direction', direction), (0, _defineProperty3.default)(_Object$assign2, 'velocity', _velocity), (0, _defineProperty3.default)(_Object$assign2, 'acceleration', _acceleration), _Object$assign2)), e);
      }
    }
  }, {
    key: 'handleScrollEnd',
    value: function handleScrollEnd(pos, e) {
      var _this2 = this;

      this.setState({ scrolling: false, ending: true });
      var orientation = this.props.orientation;
      var endPos = this.calcPosAoT();
      this.setState({ style: this.getStyle() });
      (0, _raf2.default)(function () {
        if (typeof _this2.props.onScrollEnd === 'function') {
          var _Object$assign3;

          var _state2 = _this2.state,
              direction = _state2.direction,
              velocity = _state2.velocity,
              acceleration = _state2.acceleration;

          _this2.props.onScrollEnd((0, _assign2.default)({}, pos, (_Object$assign3 = {}, (0, _defineProperty3.default)(_Object$assign3, orientation, endPos), (0, _defineProperty3.default)(_Object$assign3, 'direction', direction), (0, _defineProperty3.default)(_Object$assign3, 'velocity', velocity), (0, _defineProperty3.default)(_Object$assign3, 'acceleration', acceleration), _Object$assign3)), e);
        }
        _this2.setState({ ending: false });
      });
    }
  }, {
    key: 'calcPosAoT',
    value: function calcPosAoT() {
      var orientation = this.props.orientation;
      var currentPos = this.props[orientation];
      var direction = this.state.direction;
      var acceleration = this.state.acceleration;
      var distance = 0.5 * Math.abs(acceleration) * Math.pow(this.props.easeDuration, 2);
      return currentPos + direction * distance;
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      return {
        transition: 'transform ' + this.props.easeDuration + 'ms 0 ease-out'
      };
    }
  }, {
    key: 'getRenderProps',
    value: function getRenderProps() {
      var props = _lodash2.default.omit(this.props, ['orientation', 'easeDuration']);
      return (0, _assign2.default)({}, props, {
        ref: this.setRefEl,
        onScrollStart: this.handleScrollStart,
        onScroll: this.handleScroll,
        onScrollEnd: this.handleScrollEnd,
        style: this.state.style
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_scroller2.default, this.getRenderProps(), this.props.children);
    }
  }]);
  return EasedScroller;
}(_react.Component);

exports.default = EasedScroller;


EasedScroller.propTypes = (0, _assign2.default)({}, _scroller2.default.propTypes, {
  orientation: _react.PropTypes.oneOf(['x', 'y']),
  easeDuration: _react.PropTypes.number
});

EasedScroller.defaultProps = {
  orientation: 'x',
  easeDuration: 300
};