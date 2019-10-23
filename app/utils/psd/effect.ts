import { Dictionary } from './declare';

const effectTypeMap: Dictionary = {
  IrGl: {
    key: 'innerGlow',
    desc: '内发光',
    keys: [],
    formatCSSString() { return ''; },
  },
  OrGl: {
    key: 'outerGlow',
    desc: '外发光',
    keys: [],
    formatCSSString() { return ''; },
  },
  FrFX: {
    key: 'border',
    desc: '描边',
    keys: [ 'Clr', 'Opct', 'Sz ' ],
    formatCSSString(ends: Dictionary): string {
      const color = `rgba(${Math.round(ends.color.value.r)}, ${Math.round(ends.color.value.g)}, ${Math.round(ends.color.value.b)}, ${Math.round(ends.opacity.value * 100) / 100})`;
      // 作为一般容器的CSSString
      return `border: ${ends.size.value}px solid ${color};`;
    },
  },
  DrSh: {
    key: 'dropShadow',
    desc: '投影',
    keys: [ 'Clr', 'Opct', 'Sz', 'Ckmt', 'Dstn', 'blur', 'lagl' ],
    formatCSSString(ends: Dictionary): string {
      const color = `rgba(${Math.round(ends.color.value.r)}, ${Math.round(ends.color.value.g)}, ${Math.round(ends.color.value.b)}, ${Math.round(ends.opacity.value * 100) / 100})`;
      const x = Math.round((- Math.cos(ends.direction.value) * ends.distance.value) * 10) / 10;
      const y = Math.round(Math.sin(ends.direction.value) * ends.distance.value) / 10;
      // 作为一般容器的CSSString
      return `box-shadow: ${x}px ${y}px ${Math.round(ends.blur.value)}px ${Math.round(ends.extend.value)}px ${color}`;
    },
  },
};

const effectAttrMap: Dictionary = {
  'Clr ': {
    key: 'color',
    desc: '颜色',
    format(value: Dictionary): Dictionary {
      return {
        r: value['Rd '],
        g: value['Grn '],
        b: value['Bl '],
      };
    },
  },
  'Md ': {
    key: 'mixMode',
    desc: '混合模式',
  },
  Opct: {
    key: 'opacity',
    desc: '透明度',
    format(value: Dictionary): number {
      return value.value / 100;
    },
  },
  PntT: {
    key: 'paintType',
    desc: '填充类型',
  },
  Styl: {
    key: '',
    desc: '位置',
  },
  'Sz ': {
    key: 'size',
    desc: '大小',
    format(value: Dictionary): number {
      return value.value;
    },
  },
  Ckmt: {
    key: 'extend',
    desc: '扩展',
    format(value: Dictionary): number {
      return value.value;
    },
  },
  Dstn: {
    key: 'distance',
    desc: '距离',
    format(value: Dictionary): number {
      return value.value;
    },
  },
  blur: {
    key: 'blur',
    desc: '模糊',
    format(value: Dictionary): number {
      return value.value;
    },
  },
  lagl: {
    key: 'direction',
    desc: '角度',
    format(value: Dictionary): number {
      return value.value * Math.PI / 180;
    },
  },
};

declare interface EffectOuter {
  name: string;
  key: string;
  forms: Dictionary;
  cssString: string;
}

export default class Effect {
  data: Dictionary;
  constructor(data: Dictionary) {
    this.data = data;
  }
  getAttr(typeName: string): EffectOuter|null {
    if (!this.data[typeName] && this.data[typeName].enab) return null;
    const typeInfo = effectTypeMap[typeName];
    // console.log('-------------->', effectTypeMap, typeName);
    const effect: EffectOuter = {
      name: typeInfo.desc,
      key: typeInfo.key,
      forms: this.getInputs(typeName, typeInfo),
      cssString: '',
    };
    effect.cssString = typeInfo.formatCSSString(effect.forms);
    return effect;
  }
  getInputs(typeName: string, effect: any): Dictionary {
    const inputs: any = {};
    for (const key of effect.keys) {
      const effectKey = effectAttrMap[key];
      // console.log(effectKey)
      const value = this.data[typeName];
      inputs[effectKey.key] = {
        key: effectKey.key,
        desc: effectKey.desc,
        value: (effectKey.format && value[key]) ? effectKey.format(value[key]) : value[key],
      };
    }
    return inputs;
  }
  export(): Dictionary {
    const ends: Dictionary = {};
    const enableAttrs: string[] = [];
    for (const key in this.data) {
      console.log('---------d', key, this.data[key].enab);
      if (this.data[key].enab) enableAttrs.push(key);
    }
    for (const key of enableAttrs) {
      console.log('-----s', key);
      // let end = this.getAttr(key);
      // if(end) ends[end.key] = end;
    }
    return ends;
  }
}
