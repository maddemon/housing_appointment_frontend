import { observable, action } from "mobx";
import api from "../common/api";
import StoreBase from "./storeBase";

export default class PermitStore extends StoreBase {
  @observable statistic = [];

  constructor() {
    super();
    this.invokeListApi = parameter => api.permit.list(parameter);
    this.invokeSaveApi = model => api.permit.save(model);
    this.invokeGetModelApi = id => api.permit.getModel(id);
    this.invokeDeleteApi = id => api.permit.delete(id);
  }

  @action async getStatistic() {
    return this.invokeApi(
      () => api.permit.statistic(),
      response => (this.statistic = response.data)
    );
  }

  @action async getEnterList(parameter) {
    return this.invokeApi(
      () => api.permit.enterList(parameter),
      response => {
        this.parameter = parameter;
        this.page = response.data.page;
        this.list = response.data.list;
        return this.list;
      }
    );
  }
}
