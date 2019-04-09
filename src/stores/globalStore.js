import { observable, action } from 'mobx'
import { createBrowserHistory } from 'history'
import Config from '../common/config'
class GlobalStore {

    @observable title = Config.SystemName;

    @observable history = createBrowserHistory();

    @action setTitle(title) {
        this.title = title + ' ' + Config.SystemName;
    }
}
const globalStore = new GlobalStore();
export default globalStore;