import { observable, action } from 'mobx';

export default class DataStore {
  @observable test = 5;

  @action testFunc = () => {
    this.test += 1;
  };
}
