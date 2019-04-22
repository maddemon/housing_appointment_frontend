import { observable } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selected = null;

    async setList(pageIndex, pageSize) {
        const response = await api.quota.list(pageIndex, pageSize);
        if (!response) return;
        this.page = {
            pageSize: pageSize,
            pageIndex: pageIndex,
            total: response.data.total
        };
        this.list = response.data.list
    }

    async setMyList() {
        const data = await api.quota.listOfCustomer()
        this.myList = JSON.parse(data.data);
    }

    get importUrl() {
        return api.quota.getImportUrl();
    }

    setSelected(model) {
        this.selected = model;
    }

    async save(data) {
        await api.quota.add(data);
    }

    async delete(quotaUuid) {
        return await api.quota.delete(quotaUuid)
    }

}

const store = new QuotaStore();
export default store;