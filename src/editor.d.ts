import { printessAttachParameters, iPrintessApi } from './types';

export interface PrintessLoader {
  attachPrintess: (p: printessAttachParameters) => Promise<api>;
}

export type Printess = iPrintessApi;