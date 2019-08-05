import { observable, action } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selectedModel = null;
    @observable loading = false;

    @action async getList(permitUuid, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.quota.list(permitUuid, pageIndex, pageSize);
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

    @action selectModel(model) {
        this.selectedModel = model;
    }

    @action async save(data) {
        this.loading = true;
        const result = await api.quota.add(data);
        this.loading = false;
        return result;
    }

    @action async delete(uuids) {
        this.loading = true;
        const result = await api.quota.delete(uuids)
        this.loading = false;
        return result;
    }

}

const store = new QuotaStore();
export default store;