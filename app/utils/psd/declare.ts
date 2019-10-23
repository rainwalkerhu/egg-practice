// psd.js对象
export declare interface PSDObject {
  fromEvent(e: Event): any;
}
// 字典类型
export declare interface Dictionary {
  [key: string]: any;
}
// 从psd.js导出的原始数据
export declare interface PSDData {
  tree(): {
    descendants(): any;
    export(): PSDExportData;
  };
  image: {
    toPng(): HTMLImageElement;
    toBase64(): string;
  };
  layers: any[];
}
// PSD.tree().export()产生的数据
export declare interface PSDExportData {
  document: BoundInfoOrigin;
  children: PSDLayerData[];
}
export declare interface PSDNode {
  layer: {
    visible: boolean;
  };
}
// boundInfo 的来源数据
export declare interface BoundInfoOrigin {
  opacity?: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export declare interface BoundInfo {
  opacity?: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}

export declare interface TextInfo {
  value: string;
  sizes: number[];
  colors: number[][];
  family: string;
  transform: any;
}
// 经过解析可以用于绘图的热区单元数据的基本接口
export declare interface PSDUnitData {
  type: string;
  bound: BoundInfo;
  name: string;
  text?: TextInfo;
  effect?: Dictionary;
  image: {
    toPng(): HTMLImageElement;
    toBase64(): string;
  };
}
export function PSDUnitDataDefault(): PSDUnitData {
  return {
    type: '',
    bound: { left: 0, top: 0, width: 0, height: 0 },
    name: '',
    image: {
      toBase64() { return ''; },
      toPng() { return new Image(); },
    },
  };
}
// PSD.tree().export() 导出的层数据格式
export declare interface PSDLayerData extends BoundInfoOrigin {
  type: string;
  top: number;
  left: number;
  opacity: number;
}

// 声明psd.js像windows中注入的psd对象
declare global {
  interface Window {
    PSD: PSDObject;
  }
}
