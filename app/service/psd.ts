import { Service } from 'egg';
import { join, extname, resolve, dirname } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';
import { sendToWormhole } from 'stream-wormhole';
const PSD = require('psd');
const dayjs = require('dayjs');
const awaitWriteStream = require('await-stream-ready').write;

/**
 * Psd Service
 */
export default class Psd extends Service {

  public async parseTree() {
    const file = resolve(__dirname, '../public/example.psd');
    const psd = PSD.fromFile(file);
    psd.parse();
    const tree = psd.tree().export();
    return tree;
  }
  public async upload() {
      const stream = await this.ctx.getFileStream();
      // 基础的目录
      const uplaodBasePath = 'app/public/uploads';
      // 生成文件名
      const filename = `${Date.now()}${extname(stream.filename).toLocaleLowerCase()}`;
      // 生成文件夹
      const dir = dayjs(Date.now()).format('YYYY/MM/DD');
      function mkdirsSync(dir) {
        if (existsSync(dir)) {
          return true;
        } else {
          if (mkdirsSync(dirname(dir))) {
            mkdirSync(dir);
            return true;
          }
        }
      }
      mkdirsSync(join(uplaodBasePath, dir));
      // 生成写入路径
      const target = join(uplaodBasePath, dir, filename);
      // 写入流
      const writeStream = createWriteStream(target);
      try {
        await awaitWriteStream(stream.pipe(writeStream));
      } catch (err) {
        await sendToWormhole(stream);
        return err;
      }
      return { url: join('/public/uploads', dir, filename) };
  }
}
