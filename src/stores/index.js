import UserStore from "./userStore";
import GlobalStore from "./globalStore";
import PermitStore from "./permitStore";
import QuotaStore from "./quotaStore";

export default {
  globalStore: new GlobalStore(),
  userStore: new UserStore(),
  permitStore: new PermitStore(),
  quotaStore: new QuotaStore(),
};
