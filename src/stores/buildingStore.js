import { observable, action } from 'mobx'
import api from '../common/api'
class BuildingStore {

    @observable list = [];
    @observable page = null;
    @observable loading = false;
    @observable model = {}

    @action setModel(model) {
        this.model = model;
    }

    @action async setList(batchId, pageIndex, pageSize) {
        this.loading = true;
        const response = await api.building.list(batchId, pageIndex, pageSize)
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
            result = await api.building.edit(data)
        }
        else {
            result = await api.building.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(buildingUuid) {
        this.loading = true;
        const result = await api.building.delete(buildingUuid)
        this.loading = false;
        return result;
    }
}

const store = new BuildingStore();
export default store;