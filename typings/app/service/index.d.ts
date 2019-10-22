// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPsd from '../../../app/service/psd';

declare module 'egg' {
  interface IService {
    psd: ExportPsd;
  }
}
