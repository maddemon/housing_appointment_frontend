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
        return api.house.getImportUrl();
    }

    @action async getAvaliables() {
        this.loading = true;
        const response = await api.house.avaliables();
        if (response.status === 200) {
            this.avaliables = response
        }
        this.loading = false
    }

    @action async getList(pageIndex) {
        this.loading = true;
        const response = await api.house.list(pageIndex, this.pageSize)
        if (response.status === 200) {
            this.page = {
                pageSize: response.pageSize,
                pageIndex: response.pageNum,
                total: response.page.total
            };
            this.list = response.list
        }
        this.loading = false;
        return this.list
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.houseId) {
            result = await api.house.edit(data)
        }
        else {
            result = await api.house.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(houseId) {
        this.loading = true;
        const result = await api.house.delete(houseId)
        this.loading = false;
        return result;
    }
}

const store = new HousesStore();
export default store;