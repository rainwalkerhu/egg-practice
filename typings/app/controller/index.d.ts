// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPsd from '../../../app/controller/psd';

declare module 'egg' {
  interface IController {
    psd: ExportPsd;
  }
}
