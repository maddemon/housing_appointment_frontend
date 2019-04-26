import { observable, action } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selected = null;
    @observable loading = false;

    @action async setList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.quota.list(pageIndex, pageSize);
        if (response && response.data) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
            this.list = response.data.list;
        }
        this.loading = false;
    }

    @action async setMyList() {
        this.loading = true;
        const data = await api.quota.listOfCustomer()
        if (data) {
            this.myList = JSON.parse(data.data);
        }
        this.loading = false;
    }

    get importUrl() {
        return api.quota.getImportUrl();
    }

    setSelected(model) {
        this.selected = model;
    }

    @action async save(data) {
        this.loading = true;
        const result = await api.quota.add(data);
        this.loading = false;
        return result;
    }

    @action async delete(quotaUuid) {
        this.loading = true;
        const result = await api.quota.delete(quotaUuid)
        this.loading = false;
        return result;
    }

}

const store = new QuotaStore();
export default store;