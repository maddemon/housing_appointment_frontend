import { observable, action } from 'mobx';

export default class StoreBase {
    @observable list = [];
    @observable page = {};
    @observable loading = false;
    @observable parameter = {}
    @observable model = null;

    getListFunc = null;
    saveModelFunc = null;
    deleteFunc = null

    @action async getList(parameter) {
        this.loading = true;
        const response = await this.getListFunc(parameter);
        if (response && response.ok) {
            if (response.data.list) {
                this.page = response.data.page
                this.list = response.data.list
                this.parameter = parameter
            }
            else {
                this.list = response.data
            }
        }
        this.loading = false;
        return this.list
    }

    @action async save(model) {
        this.loading = true;
        const result = await this.saveModelFunc(model)
        this.loading = false;
        return result;
    }

    @action async delete(id) {
        if (this.deleteFunc) {
            await this.deleteFunc(id)
        }
    }

    @action getModel(id) {
        const model = (this.list || []).find(e => e.id === id);
        this.model = model;
        return model;
    }

    @action selectModel(model) {
        this.model = model
    }
}