const template = /*html*/`
  <div class="GradientMaster">
    <section class="left">
      <div class="color-box">
        <div ref="lgBox" class="linear-gradient-box" :style="style" @click="handleBoxClick">
          <div class="diagonal-line"></div>
          <div
            v-for="item in sideCorners"
            :key="item"
            :class="['to-side-corner', item.split(' ').join('-'), { active: sideOrCorner === 'to ' + item }]"
            :data-to="item">
            </div>
          <div class="gradient-line" :style="gradientLineStyle">
            <div
              class="colorStop"
              v-for="item in computedColorStops"
              :key="item.key"
            ></div>
            <div class="grip" id="grip" @mousedown="handleMousedown"></div>
          </div>
        </div>
      </div>
      <div class="input-box">
        <div class="input-group">
          <label>{{gradientValue}}</label>
        </div>
      </div>
    </section>
  </div>
`;

function calculateAngle(pointA, pointB) {
  // 计算水平和垂直距离
  var dx = pointB.x - pointA.x;
  var dy = pointB.y - pointA.y;

  // 计算角度（弧度值）
  var angleRad = Math.atan2(dy, dx);

  // 将弧度转换为角度（0-360度）
  var angleDeg = (angleRad * 180 / Math.PI + 360) % 360;

  return angleDeg;
}

function calculateDistanceToIntersection(squareSideLength, angleInDegrees) {
  if (angleInDegrees === 0 || angleInDegrees % 90 === 0) {
    return squareSideLength;
  }
  angleInDegrees = angleInDegrees % 90;
  if (angleInDegrees > 45) {
    angleInDegrees = 90 - angleInDegrees;
  }
  // 将角度转换为弧度
  var angleInRadians = (angleInDegrees * Math.PI) / 180;

  // 计算射线与正方形的交点坐标
  var intersectionX = squareSideLength / 2 * Math.tan(angleInRadians);
  var intersectionY = squareSideLength / 2;

  // 计算交点到中心的距离
  var distanceToIntersection = Math.sqrt(intersectionX * intersectionX + intersectionY * intersectionY);

  return distanceToIntersection * 2;
}

export default {
  data: () => ({
    rectSize: 300,
    angle: 0,
    sideOrCorner: 'to top right',
    // #e66465, #9198e5
    colorStops: [
      { color: '#e66465', stop: null },
      { color: '#9198e5', stop: null }
    ],
    sideCorners: ['top', 'right', 'bottom', 'left', 'left top', 'right top', 'left bottom', 'right bottom']
  }),
  computed: {
    computedColorStops() {
      return []
    },
    lineLength() {
      return calculateDistanceToIntersection(this.rectSize, this.computedAngle)
    },
    gradientValue() {
      const colorStops = this.colorStops.map(item => {
        return `${item.color} ${item.stop || ''}`.trim();
      }).join(', ');

      let angle;
      if (this.sideOrCorner === 'custom') {
        angle = `${this.computedAngle}deg`;
      } else {
        angle = this.sideOrCorner
      }

      return `linear-gradient(${angle}, ${colorStops})`
    },
    style() {
      return {
        width: this.rectSize + 'px',
        height: this.rectSize + 'px',
        backgroundImage: this.gradientValue
      }
    },
    computedAngle() {
      switch (this.sideOrCorner) {
        case 'to right': return 90;
        case 'to right bottom': 
        case 'to bottom right': 
          return 135;
        case 'to bottom': return 180;
        case 'to left bottom':
        case 'to bottom left':
          return 225;
        case 'to left': return 270;
        case 'to left top':
        case 'to top left':
          return 315;
        case 'to top': return 0;
        case 'to top right': 
        case 'to right top': 
          return 45;
        default: return this.angle;
      }
    },
    gradientLineStyle() {
      return {
        width: this.lineLength + 'px',
        transform: `translate(-50%, -50%) rotate(${this.computedAngle - 90}deg)`
      }
    }
  },
  created() {
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
  },
  methods: {
    handleBoxClick(ev) {
      const dataset = ev.target.dataset;
      if (dataset.to) {
        this.sideOrCorner = 'to ' + dataset.to;
        return;
      }
    },
    handleMousedown() {
      this.centerPoint = (function(myDiv) {
        var rect = myDiv.getBoundingClientRect();
        var x = rect.left + rect.width / 2;
        var y = rect.top + rect.height / 2;
        return {x, y};
      })(this.$refs.lgBox);
      document.addEventListener('mousemove', this.handleMousemove);
      document.addEventListener('mouseup', this.handleMouseup);
    },
    handleMousemove(ev) {
      const {x, y} = ev;
      let angle = calculateAngle(this.centerPoint, {x, y}) + 90;
      
      if (angle >= 360) {
        angle = angle - 360;
      }
      const match = [
        [0, 'top'],
        [45, 'right top'],
        [90, 'right'],
        [135, 'right bottom'],
        [180, 'bottom'],
        [225, 'left bottom'],
        [270, 'left'],
        [315, 'left top']
      ].some(([v, k]) => {
        if (Math.abs(angle - v) <= 0.5) {
          this.sideOrCorner = 'to ' + k;
          return true;
        }
      })
      if (!match && this.sideOrCorner != 'custom') {
        this.sideOrCorner = 'custom';
      } 
      this.angle = Math.round(angle);
      
      ev.preventDefault();
    },
    handleMouseup() {
      document.removeEventListener('mouseup', this.handleMouseup);
      document.removeEventListener('mousemove', this.handleMousemove);
    }
  },
  template
}