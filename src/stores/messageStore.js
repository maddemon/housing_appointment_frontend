import api from "../common/api";
import StoreBase from "./storeBase";
export default class MessageStore extends StoreBase {
  sendVerifyCodeMessage(mobile) {
    return this.invokeApi(() => api.message.sendVerifyCodeMessage(mobile));
  }

  sendEnterMessage(batchId) {
    return this.invokeApi(() => api.message.sendEnterMessage(batchId));
  }
  sendNotEnterMessage(batchId) {
    return this.invokeApi(() => api.message.sendNotEnterMessage(batchId));
  }

  sendAppointmentMessage(batchId) {
    return this.invokeApi(() => api.message.sendAppointmentMessage(batchId));
  }
  sendFailMessage(batchId) {
    return this.invokeApi(() => api.message.sendFailMessage(batchId));
  }
  sendChooseMessage(batchId, quotaIds) {
    return this.invokeApi(() =>
      api.message.sendChooseMessage(batchId, quotaIds)
    );
  }
}
