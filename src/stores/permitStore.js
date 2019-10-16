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
        if (response.status === 200) {
            this.page = {
                searchKey: searchKey,
                pageSize: this.pageSize,
                pageIndex: pageIndex,
                total: response.page.total
            };
            this.list = response.list;
        }
        this.loading = false;
        return this.list
    }
    @action async getStatistic() {
        this.loading = true;
        const response = await api.permit.statistic();
        if (response.status === 200) {
            this.statistic = response;
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
            "permitId": "string",
            "state": "string",
            "userName": "string"
        */
        if (response.status === 200) {
            let permits = []
            response.map(item => {
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
        if (data.id) {
            result = await api.permit.edit(data)
        }
        else {
            result = await api.permit.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(id) {
        this.loading = true;
        const result = await api.permit.delete(id)
        this.loading = false;
        return result;
    }

}

const store = new PermitStore();
export default store;