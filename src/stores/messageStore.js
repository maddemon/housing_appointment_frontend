import api from '../common/api'
import StoreBase from './storeBase'
export default class MessageStore extends StoreBase {

    sendVerifyCodeMessage(mobile) {
        return this.invokeApi(() => api.message.sendVerifyCodeMessage(mobile))
    }

    sendEnterMessage(batchId) {
        return this.invokeApi(() => api.message.sendEnterMessage(batchId))
    }

    sendAppointmentMessage(batchId) {
        return this.invokeApi(() => api.message.sendAppointmentMessage(batchId))
    }

    sendChooseMessage(appointmentIds) {
        return this.invokeApi(() => api.message.sendChooseMessage(appointmentIds))
    }
}