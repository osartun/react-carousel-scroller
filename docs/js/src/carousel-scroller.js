'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.START = exports.END = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _easedScroller = require('./eased-scroller');

var _easedScroller2 = _interopRequireDefault(_easedScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var END = exports.END = 'end';
var START = exports.START = 'start';

var CarouselScroller = function (_Component) {
  (0, _inherits3.default)(CarouselScroller, _Component);

  function CarouselScroller(props) {
    (0, _classCallCheck3.default)(this, CarouselScroller);

    var _this = (0, _possibleConstructorReturn3.default)(this, (CarouselScroller.__proto__ || (0, _getPrototypeOf2.default)(CarouselScroller)).call(this, props));

    _this.state = {
      scrolling: false,
      x: 0,
      y: 0,
      initialPos: undefined
    };
    _this.el = {};
    _this.bounds = {};
    _this.setScrollerRef = _this.setScrollerRef.bind(_this);
    _this.handleScrollStart = _this.handleScrollStart.bind(_this);
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleScrollEnd = _this.handleScrollEnd.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(CarouselScroller, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.index !== this.props.index) {
        var pos = this.getPosFromIndex(nextProps.index);
        this.setState((0, _defineProperty3.default)({}, this.props.orientation, pos));
        this.conditionallyCallOnEnd(nextProps.index, this.props.index);
      }
      if (nextProps.orientation !== this.props.orientation) {
        var _setState2;

        // Transfer position
        this.setState((_setState2 = {}, (0, _defineProperty3.default)(_setState2, nextProps.orientation, this.state[this.props.orientation]), (0, _defineProperty3.default)(_setState2, this.props.orientation, 0), _setState2));
      }
    }
  }, {
    key: 'conditionallyCallOnEnd',
    value: function conditionallyCallOnEnd(nextIndex, prevIndex) {
      if (typeof this.props.onEnd === 'function' && nextIndex !== prevIndex) {
        var lastReachableIndex = this.getLastReachableIndex();
        if (nextIndex >= lastReachableIndex) {
          this.props.onEnd(true, END);
        } else if (prevIndex >= lastReachableIndex) {
          this.props.onEnd(false, END);
        }
        if (nextIndex <= 0) {
          this.props.onEnd(true, START);
        } else if (prevIndex <= 0) {
          this.props.onEnd(false, START);
        }
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateBounds();
      if (this.props.index !== 0) {
        var pos = this.getPosFromIndex(this.props.index);
        this.setState((0, _defineProperty3.default)({}, this.props.orientation, pos));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.el = {};
      this.bounds = {};
    }
  }, {
    key: 'setScrollerRef',
    value: function setScrollerRef(comp) {
      this.el = {
        scroller: comp.el,
        container: comp.el.parentElement
      };
    }
  }, {
    key: 'updateBounds',
    value: function updateBounds() {
      if (this.el.scroller && this.el.container) {
        var children = this.el.scroller.children;
        this.bounds = {
          container: this.el.container.getBoundingClientRect(),
          scroller: this.el.scroller.getBoundingClientRect(),
          children: (0, _from2.default)(children).map(function (child) {
            return child.getBoundingClientRect();
          })
        };
      }
    }
  }, {
    key: 'handleScrollStart',
    value: function handleScrollStart() {
      this.updateBounds();
      var orientation = this.props.orientation;
      this.setState({
        scrolling: true,
        initialPos: this.state[orientation]
      });
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(pos) {
      var _this2 = this;

      var orientation = this.props.orientation;

      var _getMinMaxVal = this.getMinMaxVal(),
          _getMinMaxVal2 = (0, _slicedToArray3.default)(_getMinMaxVal, 2),
          min = _getMinMaxVal2[0],
          max = _getMinMaxVal2[1];

      (0, _raf2.default)(function () {
        _this2.setState((0, _defineProperty3.default)({}, orientation, _lodash2.default.clamp(pos[orientation], min, max)));
      });
    }
  }, {
    key: 'handleScrollEnd',
    value: function handleScrollEnd(pos) {
      var _setState4;

      var orientation = this.props.orientation;
      this.setState((_setState4 = {
        scrolling: false
      }, (0, _defineProperty3.default)(_setState4, orientation, this.state.initialPos), (0, _defineProperty3.default)(_setState4, 'initialPos', undefined), _setState4));
      if (typeof this.props.onChange === 'function') {
        var endIndex = this.getIndexFromPos(pos[orientation]);
        this.props.onChange(endIndex);
      }
    }
  }, {
    key: 'getMinMaxVal',
    value: function getMinMaxVal() {
      var length = this.props.orientation === 'x' ? 'width' : 'height';
      var _bounds = this.bounds,
          scroller = _bounds.scroller,
          container = _bounds.container;

      var lastChild = _lodash2.default.last(this.bounds.children);
      if (scroller[length] > container[length]) {
        return [container[length] - scroller[length], 0];
      } else if (!lastChild) {
        return [0, 0];
      }
      return [lastChild[length] - scroller[length], 0];
    }
  }, {
    key: 'getLatchPos',
    value: function getLatchPos(pos) {
      var _this3 = this;

      var _getMinMaxVal3 = this.getMinMaxVal(),
          _getMinMaxVal4 = (0, _slicedToArray3.default)(_getMinMaxVal3, 2),
          min = _getMinMaxVal4[0],
          max = _getMinMaxVal4[1];

      var childrenPos = this.bounds.children.reduce(function (arr, childBounds) {
        var childPos = _this3.getPosFromChildBounds(childBounds);
        if (childPos !== min) arr.push(childPos);
        return arr;
      }, []);
      return this.getClosestVal(pos, [].concat([max], childrenPos, [min]));
    }
  }, {
    key: 'getClosestVal',
    value: function getClosestVal(nr) {
      var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var curr = range[0];
      range.forEach(function (val) {
        if (Math.abs(nr - val) < Math.abs(nr - curr)) curr = val;
      });
      return curr;
    }
  }, {
    key: 'getIndexFromPos',
    value: function getIndexFromPos(pos) {
      var childrenPos = this.bounds.children.map(this.getPosFromChildBounds.bind(this));
      var childPos = this.getClosestVal(pos, childrenPos);
      return childrenPos.indexOf(childPos);
    }
  }, {
    key: 'getPosFromIndex',
    value: function getPosFromIndex(index) {
      if (this.bounds.children) {
        var childIndex = _lodash2.default.clamp(index, 0, this.bounds.children.length - 1);
        return this.getPosFromChildBounds(this.bounds.children[childIndex]);
      }
      return 0;
    }
  }, {
    key: 'getPosFromChildBounds',
    value: function getPosFromChildBounds(bounds) {
      var _getMinMaxVal5 = this.getMinMaxVal(),
          _getMinMaxVal6 = (0, _slicedToArray3.default)(_getMinMaxVal5, 2),
          min = _getMinMaxVal6[0],
          max = _getMinMaxVal6[1];

      var start = this.props.orientation === 'x' ? 'left' : 'top';
      var childPos = Math.round(max - (bounds[start] - this.bounds.scroller[start]));
      return childPos > min ? childPos : min;
    }
  }, {
    key: 'getLastReachableIndex',
    value: function getLastReachableIndex() {
      var _getMinMaxVal7 = this.getMinMaxVal(),
          _getMinMaxVal8 = (0, _slicedToArray3.default)(_getMinMaxVal7, 1),
          min = _getMinMaxVal8[0];

      return this.getIndexFromPos(min);
    }
  }, {
    key: 'getClassName',
    value: function getClassName() {
      var scrolling = this.state.scrolling;
      return (0, _classnames2.default)({ scrolling: scrolling }, this.props.className);
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      var base = {
        position: 'absolute'
      };
      var whileScrolling = this.state.scrolling ? {
        userSelect: 'none'
      } : null;
      return (0, _assign2.default)({}, base, whileScrolling, this.props.style);
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          x = _state.x,
          y = _state.y;

      return _react2.default.createElement(_easedScroller2.default, {
        x: x,
        y: y,
        orientation: this.props.orientation,
        className: this.getClassName(),
        ref: this.setScrollerRef,
        onScrollStart: this.handleScrollStart,
        onScroll: this.handleScroll,
        onScrollEnd: this.handleScrollEnd,
        style: this.getStyle()
      }, this.props.children);
    }
  }]);
  return CarouselScroller;
}(_react.Component);

exports.default = CarouselScroller;


CarouselScroller.propTypes = {
  orientation: _react.PropTypes.oneOf(['x', 'y']),
  index: _react.PropTypes.number,
  onChange: _react.PropTypes.func,
  onEnd: _react.PropTypes.func,
  withStyle: _react.PropTypes.bool
};

CarouselScroller.defaultProps = {
  orientation: 'x',
  index: 0
};