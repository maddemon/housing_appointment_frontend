import { observable, action } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selectedModel = null;
    @observable loading = false;

    @action async getList(permitId, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.quota.list(permitId, pageIndex, pageSize);
        if (response.status === 200) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.page.total
            };
            this.list = response.list;
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

    @action async delete(ids) {
        this.loading = true;
        const result = await api.quota.delete(ids)
        this.loading = false;
        return result;
    }

}

const store = new QuotaStore();
export default store;