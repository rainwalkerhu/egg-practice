import { Dictionary, PSDData, PSDNode, PSDExportData, PSDUnitData, PSDUnitDataDefault, BoundInfoOrigin, BoundInfo } from './declare';
import Effect from './effect';

class Decoder {
  originData: PSDData;
  data: PSDExportData;
  nodes: PSDNode[];
  mainUnit: PSDUnitData;
  childUnits: PSDUnitData[];
  constructor(data: PSDData) {
    this.originData = data;
    this.data = data.tree().export();
    // console.log('===>', this.data);
    // console.log('=====>', data.layers)
    this.nodes = [];
    for (const layer of data.layers) {
      if (layer.node) this.nodes.push(layer.node);
    }
    this.mainUnit = this.getMainInfo();
    this.childUnits = this.getChildrenInfo();
  }
  getBoundInfo(target: BoundInfoOrigin): BoundInfo {
    const bound: BoundInfo = { left: 0, top: 0, width: 0, height: 0 };
    bound.width = target.width;
    bound.height = target.height;
    if (target.left) bound.left = target.left;
    if (target.top) bound.top = target.top;
    if (target.hasOwnProperty('opacity')) bound.opacity = target.opacity;
    return bound;
  }
  getMainInfo(): PSDUnitData {
    const bound: BoundInfo = this.getBoundInfo(this.data.document);
    const image = this.originData.image;
    console.log('主数据解析完毕');
    return {
      type: 'main',
      name: 'main',
      bound,
      image,
    };
  }
  getChildrenInfo(): PSDUnitData[] {
    const childrenInfo: PSDUnitData[] = [];
    for (const node of this.nodes) {
      if (!node.layer.visible) continue;
      const data = this.getChildInfo(node);
      childrenInfo.push(data);
    }
    console.log('子数据解析完毕');
    return childrenInfo;
  }
  getChildInfo(node: any): PSDUnitData {
    const data: PSDUnitData = PSDUnitDataDefault();
    const layer: any = node.export();
    switch (layer.type) {
      case 'layer':
        data.bound = this.getBoundInfo(layer);
        data.name = layer.name;
        this.sortLayer(layer, data); // 注入type和额外数据
        data.image = node.layer.image;
        break;
      default:
        break;
    }
    return this.getEffectData(node, data);
  }
  sortLayer(layer: any, data: PSDUnitData): void {
    if (layer.text) {
      data.type = 'text';
      data.text = {
        value: layer.text.value,
        sizes: layer.text.font.sizes,
        colors: layer.text.font.colors,
        family: layer.text.font.name,
        transform: layer.text.transform,
      };
    } else data.type = 'image';
  }
  getEffectData(node: any, data: PSDUnitData): PSDUnitData {
    if (!node.layer.objectEffects) return data;
    const effect = new Effect(node.layer.objectEffects().data);
    data.effect = effect.export();
    return data;
  }
  export(): Dictionary {
    return {
      main: this.mainUnit,
      children: this.childUnits,
    };
  }
}
export default Decoder;
