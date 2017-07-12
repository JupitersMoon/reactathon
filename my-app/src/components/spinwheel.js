import React, { Component } from 'react';
import '../App.css'

var active = ["hiking", "biking", "swimming", "waterfight", "climbing", "kayak", "tubing",  "sports"];
var party = ["BBQ","summertime party", "porch party", "beach party", "kitty pool party", "margarita pool party", "roller skating", "skateboarding"];
var indoor = ["TV", "movie", "video games", "slap a friend", "take a shot", "board games", "card games", "do nothing with A/C", "read a book"];
var outdoor = ["sunbathing", "camping", "swimsuit twister", "amusement park", "star gazing", "smore's", "eat ice cream"];
var roadTrip = ["scenic drive", "visit museums", "visit mom", "explore landmarks", "go to hot springs", "roadside attractions"];

var options = active;




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
      spinTimeTotal: Math.random() * 3 + 4 * 1000,
      selected: "active"
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
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
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
  this.rotateWheel();
}

rotateWheel() {
  this.setState({spinTime: this.state.spinTime += 30})
  if(this.state.spinTime >= this.state.spinTimeTotal) {
    this.stopRotateWheel();
    return;
  }
  var spinAngle = this.state.spinAngleStart - this.easeOut(this.state.spinTime, 0, this.state.spinAngleStart, this.state.spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  this.drawRouletteWheel();
  spinTimeout = setTimeout(() => this.rotateWheel(), 30);
}

stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  this.setState({spinTime: 0})
}

easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}

handleChange(changeEvent){
  this.setState({
    selected: changeEvent.target.value
  })

  switch(true) {
    case this.state.selected === 'active':
    options = active;
    break;
    case this.state.selected === 'outdoor':
    options = outdoor;
    break;
    case this.state.selected === 'indoor':
    options = indoor;
    break;
    case this.state.selected === 'party':
    options = party;
    break;
    case this.state.selected === 'roadTrip':
    options = roadTrip;
    break;
    default:
    options = active;
  }

  this.drawRouletteWheel()

}



  render(){
    return(
      <div>
      <form>
      <input type="radio" name="category" value="active" id="active" checked={this.state.selected==="active"} onChange={this.handleChange.bind(this)} /><label for="active"> Active </label>

      <input type="radio" name="category" value="party" id="party" checked={this.state.selected==="party"} onChange={this.handleChange.bind(this)} /><label for="active"> Party </label>

      <input type="radio" name="category" value="indoor" id="indoor" checked={this.state.selected==="indoor"} onChange={this.handleChange.bind(this)} /><label for="active"> Indoor </label>

      <input type="radio" name="category" value="outdoor" id="outdoor" checked={this.state.selected==="outdoor"} onChange={this.handleChange.bind(this)} /><label for="active"> Outdoor </label>

      <input type="radio" name="category" value="roadTrip" id="roadTrip" checked={this.state.selected==="roadTrip"} onChange={this.handleChange.bind(this)} /><label for="active"> RoadTrip </label>

    </form>
      <input type="button" value="spin" style={wheelStyle} id='spin' onClick={this.spin.bind(this)} />
<canvas id="canvas" width="500" height="500"></canvas>
</div>
    )
  }

}

const wheelStyle = {
  float: 'left',
  position: 'absolute',



}
