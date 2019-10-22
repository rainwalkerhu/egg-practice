import { Controller } from 'egg';
const PSD = require('psd');
import { resolve } from 'path';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const file = resolve(__dirname, './example.psd');
    const psd = PSD.fromFile(file);
    psd.parse();
    const tree = psd.tree().export();
    ctx.body = tree;
  }
}
