export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export enum COLORS {
  TRANSPARENT = 'rgba(0, 0, 0, 0)',
  BACKGROUND = 'rgba(141, 248, 255, .1)',
  PRIMARY = '#8DF8FF',
  COLD = '#00D5FF',
  HOT = '#FF0000'
}

export class ColorGradient {
  color: RGBColor;
  scale = {
    m: 1,
    n: 0
  };

  constructor(private initial, private final, private customScale?) {
    this.initial = this.hexToRGB(initial);
    this.final = this.hexToRGB(final);
    if (customScale) {
      this.scale.m = 100 / (customScale.max - customScale.min);
      this.scale.n = Math.abs(this.scale.m * customScale.min);
    }
  }

  toRGBString(): string {
    return 'rgb(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ')';
  }

  hexToRGB(hexColor: string): RGBColor {
    const [red, green, blue] = hexColor.replace(/#/,'').match(/.{1,2}/g);
    return {
      r: parseInt(red, 16),
      g: parseInt(green, 16),
      b: parseInt(blue, 16)
    };
  }

  findPoint(point: number): ColorGradient {
    let percentage = this.scale.m * point + this.scale.n;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    this.color = {
      r: 0,
      g: 0,
      b: 0
    };
    ['r', 'g', 'b'].forEach(component => {
      this.color[component] = Math.round(this.initial[component] + (this.final[component] - this.initial[component]) * percentage / 100);
    });
    return this;
  }
}
