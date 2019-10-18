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

    async invokeApi(invoke, success) {
        this.loading = true;
        const response = await invoke();
        if (success) {
            if (response && response.ok) {
                success(response)
            }
        }
        this.loading = false;
        return response
    }

    @action async getList(parameter) {
        return await this.invokeApi(() => this.getListFunc(parameter),
            (response) => {
                if (response.data.list) {
                    this.page = response.data.page
                    this.list = response.data.list
                    this.parameter = parameter
                }
                else {
                    this.list = response.data
                }
            }
        )
    }

    @action async save(model) {
        return await this.invokeApi(() => this.saveModelFunc(model))
    }

    @action async delete(id) {
        return await this.invokeApi(() => this.deleteFunc(id))
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