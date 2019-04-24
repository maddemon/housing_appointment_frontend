import { observable } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selected = null;
    @observable loading = false;

    async setList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.quota.list(pageIndex, pageSize);
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list;
        this.loading = false;
    }

    async setMyList() {
        this.loading = true;
        const data = await api.quota.listOfCustomer()
        this.myList = JSON.parse(data.data);
        this.loading = false;
    }

    get importUrl() {
        return api.quota.getImportUrl();
    }

    setSelected(model) {
        this.selected = model;
    }

    async save(data) {
        this.loading = true;
        const result = await api.quota.add(data);
        this.loading = false;
        return result;
    }

    async delete(quotaUuid) {
        return await api.quota.delete(quotaUuid)
    }

}

const store = new QuotaStore();
export default store;