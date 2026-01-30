"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lanceGg = require("lance-gg");
var _ShipActor = _interopRequireDefault(require("../client/ShipActor"));
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
var Ship = exports["default"] = /*#__PURE__*/function (_DynamicObject) {
  function Ship(gameEngine, options, props) {
    var _this;
    _classCallCheck(this, Ship);
    _this = _callSuper(this, Ship, [gameEngine, options, props]);
    _this.showThrust = 0;
    return _this;
  }
  _inherits(Ship, _DynamicObject);
  return _createClass(Ship, [{
    key: "maxSpeed",
    get: function get() {
      return 3.0;
    }
  }, {
    key: "onAddToWorld",
    value: function onAddToWorld(gameEngine) {
      if (_lanceGg.Renderer) {
        var renderer = _lanceGg.Renderer.getInstance();
        var shipActor = new _ShipActor["default"](renderer);
        var sprite = shipActor.sprite;
        renderer.sprites[this.id] = sprite;
        sprite.id = this.id;
        sprite.position.set(this.position.x, this.position.y);
        renderer.layer2.addChild(sprite);
        if (gameEngine.isOwnedByPlayer(this)) {
          renderer.addPlayerShip(sprite);
        } else {
          renderer.addOffscreenIndicator(this);
        }
      }
    }
  }, {
    key: "onRemoveFromWorld",
    value: function onRemoveFromWorld(gameEngine) {
      var _this2 = this;
      if (this.fireLoop) {
        this.fireLoop.destroy();
      }
      if (this.onPreStep) {
        this.gameEngine.removeListener('preStep', this.onPreStep);
        this.onPreStep = null;
      }
      if (_lanceGg.Renderer) {
        var renderer = _lanceGg.Renderer.getInstance();
        if (gameEngine.isOwnedByPlayer(this)) {
          renderer.playerShip = null;
        } else {
          renderer.removeOffscreenIndicator(this);
        }
        var sprite = renderer.sprites[this.id];
        if (sprite) {
          if (sprite.actor) {
            // removal "takes time"
            sprite.actor.destroy().then(function () {
              delete renderer.sprites[_this2.id];
            });
          } else {
            sprite.destroy();
            delete renderer.sprites[this.id];
          }
        }
      }
    }

    // no bending corrections on angle needed, angle is deterministic
    // position correction if less than world width/height
  }, {
    key: "bending",
    get: function get() {
      return {
        angleLocal: {
          percent: 0.0
        },
        position: {
          max: 500.0
        }
      };
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.isBot ? 'Bot' : 'Player', "::Ship::").concat(_superPropGet(Ship, "toString", this, 3)([]));
    }
  }, {
    key: "syncTo",
    value: function syncTo(other) {
      _superPropGet(Ship, "syncTo", this, 3)([other]);
      this.showThrust = other.showThrust;
    }
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "attachAI",
    value: function attachAI() {
      var _this3 = this;
      this.isBot = true;
      this.onPreStep = function () {
        _this3.steer();
      };
      this.gameEngine.on('preStep', this.onPreStep);
      var fireLoopTime = Math.round(250 + Math.random() * 100);
      this.fireLoop = this.gameEngine.timer.loop(fireLoopTime, function () {
        if (_this3.target && _this3.distanceToTargetSquared(_this3.target) < 160000) {
          _this3.gameEngine.makeMissile(_this3);
        }
      });
    }
  }, {
    key: "shortestVector",
    value: function shortestVector(p1, p2, wrapDist) {
      var d = Math.abs(p2 - p1);
      if (d > Math.abs(p2 + wrapDist - p1)) p2 += wrapDist;else if (d > Math.abs(p1 + wrapDist - p2)) p1 += wrapDist;
      return p2 - p1;
    }
  }, {
    key: "distanceToTargetSquared",
    value: function distanceToTargetSquared(target) {
      var dx = this.shortestVector(this.position.x, target.position.x, this.gameEngine.worldSettings.width);
      var dy = this.shortestVector(this.position.y, target.position.y, this.gameEngine.worldSettings.height);
      return dx * dx + dy * dy;
    }
  }, {
    key: "steer",
    value: function steer() {
      var closestTarget = null;
      var closestDistance2 = Infinity;
      for (var _i = 0, _Object$keys = Object.keys(this.gameEngine.world.objects); _i < _Object$keys.length; _i++) {
        var objId = _Object$keys[_i];
        var obj = this.gameEngine.world.objects[objId];
        if (obj != this) {
          var distance2 = this.distanceToTargetSquared(obj);
          if (distance2 < closestDistance2) {
            closestTarget = obj;
            closestDistance2 = distance2;
          }
        }
      }
      this.target = closestTarget;
      if (this.target) {
        var newVX = this.shortestVector(this.position.x, this.target.position.x, this.gameEngine.worldSettings.width);
        var newVY = this.shortestVector(this.position.y, this.target.position.y, this.gameEngine.worldSettings.height);
        var angleToTarget = Math.atan2(newVX, newVY) / Math.PI * 180;
        angleToTarget *= -1;
        angleToTarget += 90; // game uses zero angle on the right, clockwise
        if (angleToTarget < 0) angleToTarget += 360;
        var turnRight = this.shortestVector(this.angle, angleToTarget, 360);
        if (turnRight > 4) {
          this.turnRight(2.5);
        } else if (turnRight < -4) {
          this.turnLeft(2.5);
        } else {
          this.accelerate(0.05);
          this.showThrust = 5;
        }
      }
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        showThrust: {
          type: _lanceGg.BaseTypes.TYPES.INT32
        }
      }, _superPropGet(Ship, "netScheme", this));
    }
  }]);
}(_lanceGg.DynamicObject);
//# sourceMappingURL=Ship.js.map