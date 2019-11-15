import { observable, action } from "mobx";

export default class StoreBase {
  @observable list = [];
  @observable page = {};
  @observable loading = false;
  @observable parameter = {};
  @observable model = null;

  invokeListApi = null;
  invokeGetModelApi = null;
  invokeSaveApi = null;
  invokeDeleteApi = null;

  async invokeApi(invoke, success) {
    this.loading = true;
    const response = await invoke();
    if (success) {
      if (response && response.ok) {
        success(response);
      }
    }
    this.loading = false;
    return response;
  }

  @action getList(parameter) {
    return this.invokeApi(
      () => this.invokeListApi(parameter),
      response => {
        if (response.data.list) {
          this.page = response.data.page;
          this.list = response.data.list;
          this.parameter = parameter;
        } else {
          this.list = response.data;
        }
      }
    );
  }

  @action save(model) {
    return this.invokeApi(() => this.invokeSaveApi(model));
  }

  @action delete(id) {
    return this.invokeApi(() => this.invokeDeleteApi(id));
  }

  @action getModel(id) {
    let model = null;
    if (this.list.length > 0 && id) {
      model = (this.list || []).find(
        e => e.id && e.id.toString() === id.toString()
      );
      if (model) {
        this.model = model;
        return model;
      }
    }
    if (this.invokeGetModelApi) {
      return this.invokeApi(
        () => this.invokeGetModelApi(id),
        response => {
          this.model = response.data;
        }
      );
    }
  }

  @action selectModel(model) {
    this.model = model;
  }
}
