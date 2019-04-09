import { observable, action } from 'mobx'
import Config from '../common/config'
class GlobalStore {

    @observable title = Config.SystemName;

    @action setTitle(title) {
        this.title = title + ' ' + Config.SystemName;
    }
}
const globalStore = new GlobalStore();
export default globalStore;