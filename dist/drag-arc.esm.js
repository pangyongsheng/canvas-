import 'core-js/modules/es6.function.bind';
import 'core-js/modules/es6.array.for-each';
import 'core-js/modules/es6.array.fill';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

/*
 * @Author       : pangyongsheng
 * @Date         : 2020-06-22 16:13:50
 * @LastEditTime : 2020-06-24 17:49:59
 * @LastEditors  : Please set LastEditors
 * @Description  : In User Settings Edit
 * @FilePath     : \drag-arc\src\dragArc.js
 */
var DragAcr = /*#__PURE__*/function () {
  function DragAcr(param) {
    classCallCheck(this, DragAcr);

    this.initParam(param);
    this.draw(this.value);
  }

  createClass(DragAcr, [{
    key: "initParam",
    value: function initParam(param) {
      var el = param.el,
          _param$startDeg = param.startDeg,
          startDeg = _param$startDeg === void 0 ? 0 : _param$startDeg,
          _param$endDeg = param.endDeg,
          endDeg = _param$endDeg === void 0 ? 1 : _param$endDeg,
          _param$innerColor = param.innerColor,
          innerColor = _param$innerColor === void 0 ? "#51e6b6" : _param$innerColor,
          _param$outColor = param.outColor,
          outColor = _param$outColor === void 0 ? "#c0c0c0" : _param$outColor,
          _param$innerLineWidth = param.innerLineWidth,
          innerLineWidth = _param$innerLineWidth === void 0 ? 1 : _param$innerLineWidth,
          _param$outLineWidth = param.outLineWidth,
          outLineWidth = _param$outLineWidth === void 0 ? 20 : _param$outLineWidth,
          _param$counterclockwi = param.counterclockwise,
          counterclockwise = _param$counterclockwi === void 0 ? true : _param$counterclockwi,
          _param$slider = param.slider,
          slider = _param$slider === void 0 ? 10 : _param$slider,
          _param$color = param.color,
          color = _param$color === void 0 ? ["#06dabc", "#33aaff"] : _param$color,
          _param$sliderColor = param.sliderColor,
          sliderColor = _param$sliderColor === void 0 ? "#fff" : _param$sliderColor,
          _param$sliderBorderCo = param.sliderBorderColor,
          sliderBorderColor = _param$sliderBorderCo === void 0 ? "#33aaff" : _param$sliderBorderCo,
          _param$value = param.value,
          value = _param$value === void 0 ? 0 : _param$value,
          _param$change = param.change,
          change = _param$change === void 0 ? function (v) {
        console.log(v);
      } : _param$change,
          _param$textShow = param.textShow,
          textShow = _param$textShow === void 0 ? true : _param$textShow;
      this.el = el;
      this.width = el.offsetWidth;
      this.height = el.offsetHeight;
      this.center = this.width / 2;
      this.radius = this.width / 2 - 30; //滑动路径半径

      this.initCanvas(el);
      this.startDeg = startDeg;
      this.endDeg = endDeg;
      this.innerColor = innerColor;
      this.outColor = outColor;
      this.innerLineWidth = innerLineWidth;
      this.outLineWidth = outLineWidth;
      this.counterclockwise = counterclockwise;
      this.slider = slider;
      this.color = color;
      this.sliderColor = sliderColor;
      this.sliderBorderColor = sliderBorderColor;
      this.value = value;
      this.textShow = textShow;
      this.change = change;
      this.isDown = false;
      this.event(el);
    }
  }, {
    key: "initCanvas",
    value: function initCanvas(dom) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", "dragArc");
      this.canvas.setAttribute("width", this.width);
      this.canvas.setAttribute("height", this.width);
      dom.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    } //绘图

  }, {
    key: "draw",
    value: function draw(value) {
      this.ctx.clearRect(0, 0, this.width, this.width);
      this.ctx.save();
      var startDeg = this.counterclockwise ? Math.PI * (2 - this.startDeg) : Math.PI * this.startDeg;
      var endDeg = this.counterclockwise ? Math.PI * (2 - this.endDeg) : Math.PI * this.endDeg; // 绘制内层圆弧

      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.arc(this.center, this.center, this.radius - 20, startDeg, endDeg, this.counterclockwise); // 绘制内层圆弧

      this.ctx.strokeStyle = this.innerColor;
      this.ctx.stroke(); // 绘制外侧圆弧

      this.ctx.beginPath();
      this.ctx.arc(this.center, this.center, this.radius, startDeg, endDeg, this.counterclockwise); // 绘制外侧圆弧

      this.ctx.strokeStyle = this.outColor;
      this.ctx.lineCap = "round";
      this.ctx.lineWidth = this.outLineWidth;
      this.ctx.stroke();
      var Deg = this.valToDeg(value); // 绘制可变圆弧

      var themeColor = typeof this.color == 'String' ? this.color : this.setLinearGradient();
      this.ctx.beginPath();
      this.ctx.arc(this.center, this.center, this.radius, startDeg, Deg, this.counterclockwise); // 可变圆弧

      this.ctx.strokeStyle = themeColor;
      this.ctx.lineCap = "round";
      this.ctx.lineWidth = this.outLineWidth;
      this.ctx.stroke(); // 绘制滑块

      this.P = this.DegToXY(Deg);
      this.ctx.beginPath();
      this.ctx.moveTo(this.center, this.center);
      this.ctx.arc(this.P.x, this.P.y, this.slider + 5, 0, Math.PI * 2, false); // 绘制滑块内侧

      this.ctx.fillStyle = this.sliderBorderColor;
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(this.center, this.center);
      this.ctx.arc(this.P.x, this.P.y, this.slider, 0, Math.PI * 2, false); // 绘制滑块

      this.ctx.fillStyle = this.sliderColor;
      this.ctx.fill(); // 文字

      if (!this.textShow) return;
      this.ctx.font = "".concat(this.center / 4, "px serif");
      this.ctx.fillStyle = themeColor;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "bottom";
      this.ctx.fillText(this.value, this.center, this.center);
    } //将值转化为弧度

  }, {
    key: "valToDeg",
    value: function valToDeg(v) {
      var range = this.endDeg - this.startDeg;
      var val = range / 100 * v;
      if (this.counterclockwise && val != 0) val = 2 - val;
      var startDeg = this.counterclockwise ? 2 - this.startDeg : this.startDeg;
      return (startDeg + val) * Math.PI;
    } // 弧度转化为对应坐标值

  }, {
    key: "DegToXY",
    value: function DegToXY(deg) {
      var d = 2 * Math.PI - deg;
      return this.respotchangeXY({
        x: this.radius * Math.cos(d),
        y: this.radius * Math.sin(d)
      });
    } //canvas坐标转化为中心坐标

  }, {
    key: "spotchangeXY",
    value: function spotchangeXY(point) {
      var _this = this;

      var spotchangeX = function spotchangeX(i) {
        return i - _this.center;
      };

      var spotchangeY = function spotchangeY(i) {
        return _this.center - i;
      };

      return {
        x: spotchangeX(point.x),
        y: spotchangeY(point.y)
      };
    } //中心坐标转化为canvas坐标

  }, {
    key: "respotchangeXY",
    value: function respotchangeXY(point) {
      var _this2 = this;

      var spotchangeX = function spotchangeX(i) {
        return i + _this2.center;
      };

      var spotchangeY = function spotchangeY(i) {
        return _this2.center - i;
      };

      return {
        x: spotchangeX(point.x),
        y: spotchangeY(point.y)
      };
    }
  }, {
    key: "setLinearGradient",
    value: function setLinearGradient() {
      var _this3 = this;

      var grad = this.ctx.createLinearGradient(0, 0, 0, this.width);
      this.color.forEach(function (e, i) {
        if (i == 0) {
          grad.addColorStop(0, e);
        } else if (i == _this3.color.length - 1) {
          grad.addColorStop(1, e);
        } else {
          grad.addColorStop(1 / _this3.color.length * (i + 1), e);
        }
      });
      return grad;
    }
  }, {
    key: "event",
    value: function event(dom) {
      //事件绑定
      if (this.isMobile) {
        dom.addEventListener("touchstart", this.OnMouseDown.bind(this), false);
        dom.addEventListener("touchmove", this.debounce(this.OnMouseMove.bind(this)), false);
        dom.addEventListener("touchend", this.OnMouseUp.bind(this), false);
        return;
      }

      dom.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
      dom.addEventListener("mousemove", this.debounce(this.OnMouseMove.bind(this)), false);
      dom.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
    }
  }, {
    key: "OnMouseMove",
    value: function OnMouseMove(evt) {
      if (!this.isDown) return;
      var evpoint = {};
      evpoint.x = this.getx(evt);
      evpoint.y = this.gety(evt);
      var point = this.spotchangeXY(evpoint);
      var deg = this.XYToDeg(point.x, point.y);
      deg = this.counterclockwise ? deg : Math.PI * 2 - deg;
      var val = (deg / Math.PI - this.startDeg) / (this.endDeg - this.startDeg) * 100; // if(val>100 || val<0) return;

      if (val >= 100) val = 100;
      if (val <= 0) val = 0;
      if (Math.abs(val - this.value) > 10) return;
      this.draw(val);

      if (this.value != Math.round(val)) {
        this.value = Math.round(val);
        this.change(this.value);
      }
    }
  }, {
    key: "OnMouseDown",
    value: function OnMouseDown(evt) {
      var range = 10;
      var X = this.getx(evt);
      var Y = this.gety(evt);
      var P = this.P;
      var minX = P.x - this.slider - range;
      var maxX = P.x + this.slider + range;
      var minY = P.y - this.slider - range;
      var maxY = P.y + this.slider + range;

      if (minX < X && X < maxX && minY < Y && Y < maxY) {
        //判断鼠标是否在滑块上 
        this.isDown = true;
      } else {
        this.isDown = false;
      }
    }
  }, {
    key: "OnMouseUp",
    value: function OnMouseUp() {
      //鼠标释放
      this.isDown = false;
    } // 将坐标点转化为弧度

  }, {
    key: "XYToDeg",
    value: function XYToDeg(lx, ly) {
      var adeg = Math.atan(ly / lx);
      var deg;

      if (lx >= 0 && ly >= 0) {
        deg = adeg;
      }

      if (lx <= 0 && ly >= 0) {
        deg = adeg + Math.PI;
      }

      if (lx <= 0 && ly <= 0) {
        deg = adeg + Math.PI;
      }

      if (lx > 0 && ly < 0) {
        deg = adeg + Math.PI * 2;
      }

      return deg;
    } //获取鼠标在canvas内坐标x

  }, {
    key: "getx",
    value: function getx(ev) {
      if (!this.isMobile) return ev.clientX - this.el.getBoundingClientRect().left;
      return ev.touches[0].pageX - this.el.getBoundingClientRect().left;
    } //获取鼠标在canvas内坐标y

  }, {
    key: "gety",
    value: function gety(ev) {
      if (!this.isMobile) return ev.clientY - this.el.getBoundingClientRect().top;
      return ev.touches[0].pageY - this.el.getBoundingClientRect().top;
    } //节流

  }, {
    key: "debounce",
    value: function debounce(func) {
      var timeout;
      return function () {
        var context = this;
        var args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, 10);
      };
    }
  }]);

  return DragAcr;
}();

export default DragAcr;
