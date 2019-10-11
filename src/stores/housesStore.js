import { observable, action } from 'mobx'
import api from '../common/api'
class HousesStore {

    @observable list = [];
    @observable avaliables = [];
    @observable page = null;
    @observable loading = false;
    @observable model = {}
    pageSize = 20

    @action selectModel(model) {
        this.model = model;
    }

    get importUrl() {
        return api.houses.getImportUrl();
    }

    @action async getAvaliables() {
        this.loading = true;
        const response = await api.houses.avaliables();
        if (response && response.data) {
            this.avaliables = response.data
        }
        this.loading = false
    }

    @action async getList(pageIndex) {
        this.loading = true;
        const response = await api.houses.list(pageIndex, this.pageSize)
        if (response && response.data) {
            this.page = {
                pageSize: response.data.pageSize,
                pageIndex: response.data.pageNum,
                total: response.data.total
            };
            this.list = response.data.list
        }
        this.loading = false;
        return this.list
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.housesUuid) {
            result = await api.houses.edit(data)
        }
        else {
            result = await api.houses.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(housesUuid) {
        this.loading = true;
        const result = await api.houses.delete(housesUuid)
        this.loading = false;
        return result;
    }
}

const store = new HousesStore();
export default store;