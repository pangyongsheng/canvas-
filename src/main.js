/*
 * @Author       : pangyongsheng
 * @Date         : 2020-06-22 16:13:50
 * @LastEditTime : 2020-06-24 17:49:59
 * @LastEditors  : Please set LastEditors
 * @Description  : In User Settings Edit
 * @FilePath     : \drag-arc\src\dragArc.js
 */
class DragAcr {
  constructor(param) {
    this.initParam(param)
    this.draw(this.value)
  }
  initParam(param) {
    const {
      el,
      startDeg = 0,
      endDeg = 1.8,
      innerColor = "#0078b4",
      outColor = "#c0c0c0",
      innerLineWidth = 1,
      outLineWidth = 20,
      counterclockwise = true,
      rotate = 0,
      slider = 10,
      color = "",
      sliderColor = "#fff",
      sliderBorderColor = "#f15a4a",
      value = 0,
      change = (v)=> { console.log(v) },
    } = param;

    this.el = el;
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.center = this.width / 2
    this.radius = this.width / 3; //滑动路径半径
    this.initCanvas(el);

    this.startDeg = startDeg;
    this.endDeg = endDeg;
    this.innerColor = innerColor;
    this.outColor = outColor;
    this.innerLineWidth = innerLineWidth;
    this.outLineWidth = outLineWidth;
    this.counterclockwise = counterclockwise;
    this.rotate = rotate;
    this.slider = slider;
    this.color = color;
    this.sliderColor = sliderColor;
    this.sliderBorderColor = sliderBorderColor;
    this.value = value;

    this.change = change;

    this.isDown = false;
    this.event(el)

  }
  initCanvas(dom) {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "dragArc");
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.width);
    dom.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    //console.log(this.ctx)
  }
  //绘图
  draw(value) {
    this.ctx.clearRect(0, 0, this.width, this.width);

    this.ctx.save();

    let startDeg = this.counterclockwise ? Math.PI * (2 - this.startDeg) : Math.PI * this.startDeg
    let endDeg = this.counterclockwise ? Math.PI * (2 - this.endDeg) : Math.PI * this.endDeg

    // 绘制内层圆弧
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.arc(this.center, this.center, this.radius - 20, startDeg, endDeg, this.counterclockwise); // 绘制内层圆弧
    this.ctx.strokeStyle = this.innerColor;
    this.ctx.stroke();

    // 绘制外侧圆弧
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius, startDeg, endDeg, this.counterclockwise); // 绘制外侧圆弧
    this.ctx.strokeStyle = this.outColor;
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 20;
    this.ctx.stroke();

    let Deg = this.valToDeg(value)

    //console.log(Deg)

    // 绘制可变圆弧
    this.ctx.beginPath();
    this.ctx.arc(this.center, this.center, this.radius, startDeg, Deg, this.counterclockwise); // 可变圆弧
    this.ctx.strokeStyle = '#f15a4a';
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = 20;
    this.ctx.stroke();

    // 绘制滑块
    this.P = this.DegToXY(Deg)
    this.ctx.beginPath();
    this.ctx.moveTo(200, 200);
    this.ctx.arc(this.P.x, this.P.y, this.slider + 5, 0, Math.PI * 2, false); // 绘制滑块内侧
    this.ctx.fillStyle = this.sliderBorderColor;
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(200, 200);
    this.ctx.arc(this.P.x, this.P.y, this.slider, 0, Math.PI * 2, false); // 绘制滑块
    this.ctx.fillStyle = this.sliderColor;;
    this.ctx.fill();

  }
  //将值转化为弧度
  valToDeg(v) {
    let range = this.endDeg - this.startDeg;
    let val = range / 100 * v;
    if(this.counterclockwise && (val !=0) ) val = 2 -val;
    let startDeg = this.counterclockwise ? (2 - this.startDeg) : this.startDeg;
    return (startDeg + val) * Math.PI;
  }
  // 弧度转化为对应坐标值
  DegToXY(deg) {
    let d = 2 * Math.PI - deg;
    return this.respotchangeXY({
      x: this.radius * Math.cos(d),
      y: this.radius * Math.sin(d)
    })
  }

  //canvas坐标转化为中心坐标
  spotchangeXY(point) {
    const spotchangeX = (i) => {
      return i - this.center
    }
    const spotchangeY = (i) => {
      return this.center - i
    }
    return {
      x: spotchangeX(point.x),
      y: spotchangeY(point.y)
    }
  }

  //中心坐标转化为canvas坐标
  respotchangeXY(point) {
    const spotchangeX = (i) => {
      return i + this.center
    }
    const spotchangeY = (i) => {
      return this.center - i
    }
    return {
      x: spotchangeX(point.x),
      y: spotchangeY(point.y)
    }
  }
  event(dom) {  //事件绑定
    if(this.isMobile){
        dom.addEventListener("touchstart", this.OnMouseDown.bind(this), false);
        dom.addEventListener("touchmove", this.debounce(this.OnMouseMove.bind(this)), false);
        dom.addEventListener("touchend", this.OnMouseUp.bind(this), false);
        return
    }
    dom.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
    dom.addEventListener("mousemove", this.debounce(this.OnMouseMove.bind(this)), false);
    dom.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
  }
  OnMouseMove(evt) {
    if (!this.isDown) return;
    let evpoint = {};
    evpoint.x = this.getx(evt);
    evpoint.y = this.gety(evt);
    let point = this.spotchangeXY(evpoint);
    let deg = this.XYToDeg(point.x, point.y);
    deg = this.counterclockwise ? deg : Math.PI * 2 - deg;
    let val = (deg/ Math.PI - this.startDeg) /(this.endDeg - this.startDeg)  * 100
    if(val>100 || val<0) return;
    if(Math.abs (val - this.value) > 10) return;
    this.value = val;
    this.draw(val);
    this.change(val)
  }
  OnMouseDown(evt) {
    console.log('down');
    let X = this.getx(evt);
    let Y = this.gety(evt);
    let P = this.P 
    // console.log(P)
    // console.log(X,Y)
    let minX = P.x - this.slider;
    let maxX = P.x + this.slider;
    let minY = P.y - this.slider;
    let maxY = P.y + this.slider;
    if (minX < X && X < maxX && minY < Y && Y < maxY) {   //判断鼠标是否在滑块上 
      this.isDown = true;
    } else {
      this.isDown = false;
    }
  }
  OnMouseUp() {  //鼠标释放
    this.isDown = false
  }
  // 将坐标点转化为弧度
  XYToDeg(lx, ly) {
    let adeg = Math.atan(ly / lx)
    let deg;
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
    return deg
  }

  //获取鼠标在canvas内坐标x
  getx(ev) {
    if(!this.isMobile) return ev.clientX - this.el.getBoundingClientRect().left;
    return ev.touches[0].pageX - this.el.getBoundingClientRect().left;
  }
  //获取鼠标在canvas内坐标y
  gety(ev) {
    if(!this.isMobile) return ev.clientY - this.el.getBoundingClientRect().top;
    return ev.touches[0].pageY - this.el.getBoundingClientRect().top;
  }
  //节流
  debounce(func) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        func.apply(context, args)
      }, 10);
    }
  }
}


export default DragAcr