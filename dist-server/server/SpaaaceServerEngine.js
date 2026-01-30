"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lanceGg = require("lance-gg");
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var nameGenerator = require('./NameGenerator');
var NUM_BOTS = 3;
var SpaaaceServerEngine = exports["default"] = /*#__PURE__*/function (_ServerEngine) {
  function SpaaaceServerEngine(io, gameEngine, inputOptions) {
    var _this;
    _classCallCheck(this, SpaaaceServerEngine);
    _this = _callSuper(this, SpaaaceServerEngine, [io, gameEngine, inputOptions]);
    _this.scoreData = {};
    return _this;
  }

  // when the game starts, create robot spaceships, and register
  // on missile-hit events
  _inherits(SpaaaceServerEngine, _ServerEngine);
  return _createClass(SpaaaceServerEngine, [{
    key: "start",
    value: function start() {
      var _this2 = this;
      _superPropGet(SpaaaceServerEngine, "start", this, 3)([]);
      for (var x = 0; x < NUM_BOTS; x++) this.makeBot();
      this.gameEngine.on('missileHit', function (e) {
        // add kills
        if (_this2.scoreData[e.missile.ownerId]) _this2.scoreData[e.missile.ownerId].kills++;

        // remove score data for killed ship
        delete _this2.scoreData[e.ship.id];
        _this2.updateScore();
        console.log("ship killed: ".concat(e.ship.toString()));
        _this2.gameEngine.removeObjectFromWorld(e.ship.id);
        if (e.ship.isBot) {
          setTimeout(function () {
            return _this2.makeBot();
          }, 5000);
        }
      });
    }

    // a player has connected
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      var _this3 = this;
      _superPropGet(SpaaaceServerEngine, "onPlayerConnected", this, 3)([socket]);
      var makePlayerShip = function makePlayerShip() {
        var ship = _this3.gameEngine.makeShip(socket.playerId);
        _this3.scoreData[ship.id] = {
          kills: 0,
          name: nameGenerator('general')
        };
        _this3.updateScore();
      };

      // handle client restart requests
      socket.on('requestRestart', makePlayerShip);
    }

    // a player has disconnected
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      var _this4 = this;
      _superPropGet(SpaaaceServerEngine, "onPlayerDisconnected", this, 3)([socketId, playerId]);

      // iterate through all objects, delete those that are associated with the player (ship and missiles)
      var playerObjects = this.gameEngine.world.queryObjects({
        playerId: playerId
      });
      playerObjects.forEach(function (obj) {
        _this4.gameEngine.removeObjectFromWorld(obj.id);
        // remove score associated with this ship
        delete _this4.scoreData[obj.id];
      });
      this.updateScore();
    }

    // create a robot spaceship
  }, {
    key: "makeBot",
    value: function makeBot() {
      var bot = this.gameEngine.makeShip(0);
      bot.attachAI();
      this.scoreData[bot.id] = {
        kills: 0,
        name: nameGenerator('general') + 'Bot'
      };
      this.updateScore();
    }
  }, {
    key: "updateScore",
    value: function updateScore() {
      var _this5 = this;
      // delay so player socket can catch up
      setTimeout(function () {
        _this5.io.sockets.emit('scoreUpdate', _this5.scoreData);
      }, 1000);
    }
  }]);
}(_lanceGg.ServerEngine);
//# sourceMappingURL=SpaaaceServerEngine.js.map