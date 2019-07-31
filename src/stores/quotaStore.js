import { observable, action } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selectedModel = null;
    @observable loading = false;

    @action async getList(status, searchKey, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.quota.list(status, searchKey, pageIndex, pageSize);
        if (response && response.data) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
            this.list = response.data.list;
        }
        this.loading = false;
        return this.list
    }

    @action async getMyList() {
        this.loading = true;
        const response = await api.quota.userQuotas()
        /*
            "my": true,
            "permitCode": "string",
            "quotaUuid": "string",
            "state": "string",
            "userName": "string"
        */
        if (response && response.data) {
            let permits = []
            response.data.map(item => {
                let permit = null
                let where = permits.filter(e => e.permitCode === item.permitCode)
                if (where.length === 0) {
                    permit = { permitCode: item.permitCode, quotas: [] }
                    permits.push(permit);
                } else {
                    permit = where[0]
                }
                permit.quotas.push(item);
                return item;
            })
            console.log(permits)
            this.myList = permits;
        }

        this.loading = false;
    }

    get importUrl() {
        return api.quota.getImportUrl();
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