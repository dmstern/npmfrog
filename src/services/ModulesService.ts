import Api from '@/services/Api';
import { AxiosPromise } from 'axios';

export default class ModulesService {

  public static fetchModules(): AxiosPromise<string> {
    return new Api().get('modules');
  }
}
