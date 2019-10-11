import { observable, action } from 'mobx'
import api from '../common/api'
class PermitStore {

    @observable list = [];
    @observable page = {};
    @observable myList = [];
    @observable selectedModel = null;
    @observable loading = false;
    @observable statistic = []

    @observable subList = {}

    pageSize = 20;

    @action async getList(searchKey, pageIndex) {
        this.loading = true;

        const response = await api.permit.list(searchKey, pageIndex, this.pageSize);
        if (response && response.data) {
            this.page = {
                searchKey: searchKey,
                pageSize: this.pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
            this.list = response.data.list;
        }
        this.loading = false;
        return this.list
    }
    @action async getStatistic() {
        this.loading = true;
        const response = await api.permit.statistic();
        if (response && response.data) {
            this.statistic = response.data;
        }
        this.loading = false;
        return this.list
    }

    @action async getMyList() {
        this.loading = true;
        const response = await api.permit.userPermits()
        /*
            "my": true,
            "permitCode": "string",
            "permitUuid": "string",
            "state": "string",
            "userName": "string"
        */
        if (response && response.data) {
            let permits = []
            response.data.map(item => {
                let permit = permits.find(e => e.code === item.permitCode);
                if (!permit) {
                    permit = { code: item.permitCode, quotas: [] }
                    permits.push(permit);
                }
                permit.quotas.push(item);
                return item;
            })
            this.myList = permits;
        }

        this.loading = false;
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.uuid) {
            result = await api.permit.edit(data)
        }
        else {
            result = await api.permit.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(uuid) {
        this.loading = true;
        const result = await api.permit.delete(uuid)
        this.loading = false;
        return result;
    }

    @action async expanded(uuid) {
        this.loading = true;
        const response = await api.quota.list(uuid, 1, 100);
        if (response && response.data) {
            this.page = {
                pageSize: response.data.pageSize,
                pageIndex: response.data.pageNum,
                total: response.data.total
            };
            this.expandedRows[uuid] = response.data.list;
        }
        this.loading = false;
        return this.list
    }
}

const store = new PermitStore();
export default store;