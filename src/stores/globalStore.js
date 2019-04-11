import { observable, action } from 'mobx'
import Config from '../common/config'
class GlobalStore {

    @observable title = Config.SystemName;
    @observable breadcrumb = null;

    @action setTitle(title) {
        this.title = title + ' ' + Config.SystemName;
        this.breadcrumb = ['首页'].concat(title.split());
    }
    @action setBreadcrumb(title) {
    }

}
const globalStore = new GlobalStore();
export default globalStore;