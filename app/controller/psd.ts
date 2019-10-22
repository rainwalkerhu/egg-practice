import { Controller } from 'egg';

export default class PsdController extends Controller {
  public async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.psd.parseTree();
  }
  public async upload() {
    const { ctx } = this;
    ctx.body = await ctx.service.psd.upload();
  }
}
