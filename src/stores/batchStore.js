import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {

    @observable list = [];
    @observable avaliables =[];
    @observable page = null;
    @observable loading = false;
    @observable model = {}

    @action setModel(model) {
        this.model = model;
    }

    @action async setMyList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.batch.avaliables(pageIndex, pageSize)
        if (response && response.data) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
            this.avaliables = response.data.list
        }
        this.loading = false;
    }
    
    @action async setList(pageIndex, pageSize) {
        this.loading = true;
        const response = await api.batch.list(pageIndex, pageSize)
        if (response && response.data) {
            this.page = {
                pageSize: pageSize,
                pageIndex: pageIndex,
                total: response.data.total
            };
            this.list = response.data.list
        }
        this.loading = false;
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.uuid) {
            result = await api.batch.edit(data)
        }
        else {
            result = await api.batch.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(batchUuid) {
        this.loading = true;
        const result = await api.batch.delete(batchUuid)
        this.loading = false;
        return result;
    }

    @action async notify() {
        this.loading = true;
        const result = await api.batch.notify()
        this.loading = false;
        return result;
    }

}

const store = new BatchStore();
export default store;