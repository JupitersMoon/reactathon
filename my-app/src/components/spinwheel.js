import React, { Component } from 'react';
import '../App.css'

var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99", "win"];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
// var spinTime = 0;
// var spinTimeTotal = 0;

var ctx;

var outsideRadius = 200;
var textRadius = 160;
var insideRadius = 125;




export default class SpinWheel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spinAngleStart: Math.random() * 10 + 10,
      spinTime: 0,
      spinTimeTotal: Math.random() * 3 + 4 * 1000
    }
  }

  byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

  RGB2Color(r,g,b) {
	return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
  }

  getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;

  let red   = Math.sin(frequency*item+2+phase) * width + center;
  let green = Math.sin(frequency*item+0+phase) * width + center;
  let blue  = Math.sin(frequency*item+4+phase) * width + center;

  return this.RGB2Color(red,green,blue);
  }

  drawRouletteWheel() {
    console.log('drawRouletteWheel', Date.now());
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    console.log('if canvas.getContext');
    outsideRadius = 200;
    textRadius = 160;
    insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 12px Helvetica, Arial';

    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = this.getColor(i, options.length);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}

spin() {
  // change these to be set in state
  // let spinAngleStart = Math.random() * 10 + 10;
  // let spinTime = 0;
  // let spinTimeTotal = Math.random() * 3 + 4 * 1000;
  console.log('spin called', Date.now());
  this.setState({spinTime: 0})
  console.log(this.state.spinTime);
  this.rotateWheel();
}

rotateWheel() {
  this.setState({spinTime: this.state.spinTime += 30})
  console.log(this.state.spinTime, Date.now());
  if(this.state.spinTime >= this.state.spinTimeTotal) {
    this.stopRotateWheel();
    return;
  }
  var spinAngle = this.state.spinAngleStart - this.easeOut(this.state.spinTime, 0, this.state.spinAngleStart, this.state.spinTimeTotal);
  console.log('spingAngle', spinAngle);
  startAngle += (spinAngle * Math.PI / 180);
  console.log('startAngle', startAngle);
  this.drawRouletteWheel();
  spinTimeout = setTimeout(() => this.rotateWheel(), 30);
}

stopRotateWheel() {
  console.log('stopRotateWheel', Date.now());
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

easeOut(t, b, c, d) {
  console.log('easeOut called', arguments, Date.now());
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}


  render(){
    return(
      <div>
        <div>
          <input type="button" value="SPIN" style={wheelStyle} id='spin' onClick={this.spin.bind(this)} />
        </div>
        <div>
          <canvas id="canvas" width="500" height="500"></canvas>
        </div>
      </div>
    )
  }

}

const wheelStyle = {
  float: 'left',
  position: 'absolute',



}
