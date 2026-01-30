"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _howler = _interopRequireDefault(require("howler"));
var _lanceGg = require("lance-gg");
var _SpaaaceRenderer = _interopRequireDefault(require("../client/SpaaaceRenderer"));
var _MobileControls = _interopRequireDefault(require("./MobileControls"));
var _Ship = _interopRequireDefault(require("../common/Ship"));
var _Utils = _interopRequireDefault(require("../common/Utils"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } // eslint-disable-line no-unused-vars
var SpaaaceClientEngine = exports["default"] = /*#__PURE__*/function (_ClientEngine) {
  function SpaaaceClientEngine(gameEngine, options) {
    _classCallCheck(this, SpaaaceClientEngine);
    return _callSuper(this, SpaaaceClientEngine, [gameEngine, options, _SpaaaceRenderer["default"]]);
  }
  _inherits(SpaaaceClientEngine, _ClientEngine);
  return _createClass(SpaaaceClientEngine, [{
    key: "start",
    value: function start() {
      var _this = this;
      _superPropGet(SpaaaceClientEngine, "start", this, 3)([]);

      // handle gui for game condition
      this.gameEngine.on('objectDestroyed', function (obj) {
        if (obj instanceof _Ship["default"] && _this.gameEngine.isOwnedByPlayer(obj)) {
          document.body.classList.add('lostGame');
          document.querySelector('#tryAgain').disabled = false;
        }
      });
      this.gameEngine.once('renderer.ready', function () {
        // click event for "try again" button
        document.querySelector('#tryAgain').addEventListener('click', function () {
          if (_Utils["default"].isTouchDevice()) {
            _this.renderer.enableFullScreen();
          }
          _this.socket.emit('requestRestart');
        });
        document.querySelector('#joinGame').addEventListener('click', function (clickEvent) {
          if (_Utils["default"].isTouchDevice()) {
            _this.renderer.enableFullScreen();
          }
          clickEvent.currentTarget.disabled = true;
          _this.socket.emit('requestRestart');
        });
        document.querySelector('#reconnect').addEventListener('click', function () {
          window.location.reload();
        });

        //  Game input
        if (_Utils["default"].isTouchDevice()) {
          _this.controls = new _MobileControls["default"](_this);
          _this.controls.on('fire', function () {
            _this.sendInput('space');
          });
        } else {
          _this.controls = new _lanceGg.KeyboardControls(_this);
          _this.controls.bindKey('left', 'left', {
            repeat: true
          });
          _this.controls.bindKey('right', 'right', {
            repeat: true
          });
          _this.controls.bindKey('up', 'up', {
            repeat: true
          });
          _this.controls.bindKey('space', 'space');
        }
      });

      // allow a custom path for sounds
      var assetPathPrefix = this.options.assetPathPrefix ? this.options.assetPathPrefix : '';

      // handle sounds
      this.sounds = {
        missileHit: new Howl({
          src: [assetPathPrefix + 'assets/audio/193429__unfa__projectile-hit.mp3']
        }),
        fireMissile: new Howl({
          src: [assetPathPrefix + 'assets/audio/248293__chocobaggy__weird-laser-gun.mp3']
        })
      };
      this.gameEngine.on('fireMissile', function () {
        _this.sounds.fireMissile.play();
      });
      this.gameEngine.on('missileHit', function () {
        // don't play explosion sound if the player is not in game
        if (_this.renderer.playerShip) {
          _this.sounds.missileHit.play();
        }
      });
      this.networkMonitor.on('RTTUpdate', function (e) {
        _this.renderer.updateHUD(e);
      });
    }

    // extend ClientEngine connect to add own events
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;
      return _superPropGet(SpaaaceClientEngine, "connect", this, 3)([]).then(function () {
        _this2.socket.on('scoreUpdate', function (e) {
          _this2.renderer.updateScore(e);
        });
        _this2.socket.on('disconnect', function (e) {
          console.log('disconnected');
          document.body.classList.add('disconnected');
          document.body.classList.remove('gameActive');
          document.querySelector('#reconnect').disabled = false;
        });
        if ('autostart' in _Utils["default"].getUrlVars()) {
          _this2.socket.emit('requestRestart');
        }
      });
    }
  }]);
}(_lanceGg.ClientEngine);
//# sourceMappingURL=SpaaaceClientEngine.js.map