import api from "../common/api";
import StoreBase from "./storeBase";

export default class HousesStore extends StoreBase {
  constructor() {
    super();
    this.invokeListApi = parameter => api.house.list(parameter);
    this.invokeSaveApi = model => api.house.save(model);
    this.invokeDeleteApi = id => api.house.delete(id);
    this.invokeGetModelApi = id => api.house.getModel(id);
  }

  get importUrl() {
    return api.house.getImportUrl();
  }
}
