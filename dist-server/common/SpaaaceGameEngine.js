"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lanceGg = require("lance-gg");
var _Ship = _interopRequireDefault(require("./Ship"));
var _Missile = _interopRequireDefault(require("./Missile"));
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
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var SpaaaceGameEngine = exports["default"] = /*#__PURE__*/function (_GameEngine) {
  function SpaaaceGameEngine(options) {
    var _this;
    _classCallCheck(this, SpaaaceGameEngine);
    _this = _callSuper(this, SpaaaceGameEngine, [options]);
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _this,
      collisions: {
        type: 'brute',
        collisionDistance: 28
      }
    });
    return _this;
  }
  _inherits(SpaaaceGameEngine, _GameEngine);
  return _createClass(SpaaaceGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Ship["default"]);
      serializer.registerClass(_Missile["default"]);
    }
  }, {
    key: "initWorld",
    value: function initWorld() {
      _superPropGet(SpaaaceGameEngine, "initWorld", this, 3)([{
        worldWrap: true,
        width: 3000,
        height: 3000
      }]);
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;
      _superPropGet(SpaaaceGameEngine, "start", this, 3)([]);
      this.on('collisionStart', function (e) {
        var collisionObjects = Object.keys(e).map(function (k) {
          return e[k];
        });
        var ship = collisionObjects.find(function (o) {
          return o instanceof _Ship["default"];
        });
        var missile = collisionObjects.find(function (o) {
          return o instanceof _Missile["default"];
        });
        if (!ship || !missile) return;

        // make sure not to process the collision between a missile and the ship that fired it
        if (missile.playerId !== ship.playerId) {
          _this2.destroyMissile(missile.id);
          _this2.trace.info(function () {
            return "missile by ship=".concat(missile.playerId, " hit ship=").concat(ship.id);
          });
          _this2.emit('missileHit', {
            missile: missile,
            ship: ship
          });
        }
      });
      this.on('postStep', this.reduceVisibleThrust.bind(this));
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId, isServer) {
      _superPropGet(SpaaaceGameEngine, "processInput", this, 3)([inputData, playerId]);

      // get the player ship tied to the player socket
      var playerShip = this.world.queryObject({
        playerId: playerId,
        instanceType: _Ship["default"]
      });
      if (playerShip) {
        if (inputData.input == 'up') {
          playerShip.accelerate(0.05);
          playerShip.showThrust = 5; // show thrust for next steps.
        } else if (inputData.input == 'right') {
          playerShip.turnRight(2.5);
        } else if (inputData.input == 'left') {
          playerShip.turnLeft(2.5);
        } else if (inputData.input == 'space') {
          this.makeMissile(playerShip, inputData.messageIndex);
          this.emit('fireMissile');
        }
      }
    }
  }, {
    key: "makeShip",
    value:
    // Makes a new ship, places it randomly and adds it to the game world
    function makeShip(playerId) {
      var newShipX = Math.floor(Math.random() * (this.worldSettings.width - 200)) + 200;
      var newShipY = Math.floor(Math.random() * (this.worldSettings.height - 200)) + 200;
      var ship = new _Ship["default"](this, null, {
        position: new _lanceGg.TwoVector(newShipX, newShipY)
      });
      ship.playerId = playerId;
      this.addObjectToWorld(ship);
      console.log("ship added: ".concat(ship.toString()));
      return ship;
    }
  }, {
    key: "makeMissile",
    value: function makeMissile(playerShip, inputId) {
      var missile = new _Missile["default"](this);

      // we want the missile location and velocity to correspond to that of the ship firing it
      missile.position.copy(playerShip.position);
      missile.velocity.copy(playerShip.velocity);
      missile.angle = playerShip.angle;
      missile.playerId = playerShip.playerId;
      missile.ownerId = playerShip.id;
      missile.inputId = inputId; // this enables usage of the missile shadow object
      missile.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
      missile.velocity.y += Math.sin(missile.angle * (Math.PI / 180)) * 10;
      this.trace.trace(function () {
        return "missile[".concat(missile.id, "] created vel=").concat(missile.velocity);
      });
      var obj = this.addObjectToWorld(missile);

      // if the object was added successfully to the game world, destroy the missile after some game ticks
      if (obj) this.timer.add(30, this.destroyMissile, this, [obj.id]);
      return missile;
    }

    // destroy the missile if it still exists
  }, {
    key: "destroyMissile",
    value: function destroyMissile(missileId) {
      if (this.world.objects[missileId]) {
        this.trace.trace(function () {
          return "missile[".concat(missileId, "] destroyed");
        });
        this.removeObjectFromWorld(missileId);
      }
    }

    // at the end of the step, reduce the thrust for all objects
  }, {
    key: "reduceVisibleThrust",
    value: function reduceVisibleThrust(postStepEv) {
      if (postStepEv.isReenact) return;
      var ships = this.world.queryObjects({
        instanceType: _Ship["default"]
      });
      ships.forEach(function (ship) {
        if (Number.isInteger(ship.showThrust) && ship.showThrust >= 1) ship.showThrust--;
      });
    }
  }]);
}(_lanceGg.GameEngine);
//# sourceMappingURL=SpaaaceGameEngine.js.map