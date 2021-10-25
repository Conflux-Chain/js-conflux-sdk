import { Provider } from './index';

export class BatchRequester {
  constructor(provider: Provider);

  add(request: object): void;

  execute(): Promise<any[]>;
}