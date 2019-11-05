import $ from './utils'
const api = {
    user: {
        login: (data) => {
            return $.get("user/login", data)
        },
        save: (user) => {
            return $.post('user/save', null, user)
        },
        list: (parameter) => {
            return $.get('user/list', parameter)
        },
        resetPassword: (id) => {
            return $.get('user/resetPassword', { id })
        },
        editPassword: (oldPassword, newPassword) => {
            return $.post('user/changePassword', null, { oldPassword, newPassword })
        }
    },
    house: {
        getModel: (id) => {
            return $.get('house/getModel', { id })
        },
        save: (data) => {
            return $.post('house/save', null, data)
        },
        delete: (id) => {
            return $.get('house/delete', { id })
        },
        list: (parameter) => {
            return $.get('house/list', parameter)
        },
        getImportUrl: () => {
            return '/api/house/import'
        }
    },
    batch: {
        getModel: (id) => {
            return $.get('batch/getmodel', { id })
        },
        save: (data) => {
            return $.post('batch/save', null, data)
        },
        delete: (id) => {
            return $.get('batch/delete', { id })
        },
        list: (parameter) => {
            return $.get('batch/list', parameter)
        },
        successAppointment: (batchId) => {
            return $.get('room/batchStatus', { batchId })
        },
        getRooms: (batchId) => {
            return $.get('room/list', { batchId })
        },
        getPermits: (batchId) => {
            return $.get('permit/list', { batchId })
        },
        chooseRoom: (appointmentId, roomId) => {
            return $.put('room/choose', null, { appointmentId, roomId })
        },
    },
    permit: {
        list: (parameter) => {
            return $.get('permit/list', parameter)
        },
        //入围准购证列表
        enterList: (parameter) => {
            return $.get('permit/enterList', parameter)
        },
        statistic: () => {
            return $.get('permit/statistical')
        },
        save: (data) => {
            return $.post('permit/save', null, data)
        },
        delete: (permitId) => {
            return $.get('permit/delete', { permitId })
        },
        getModel: (id) => {
            return $.get('permit/getmodel', { id });
        },
        userPermits: () => {
            return $.get('quota/userQuota')
        },
    },
    quota: {
        getModel: (id) => {
            return $.get('quota/GetUserQuota', { id })
        },
        save: (model) => {
            return $.post('quota/save', null, model)
        },
        delete: (id) => {
            return $.get('quota/delete', { id })
        },
        list: (parameter) => {
            return $.get('quota/list', parameter)
        },
    },
    appointment: {
        history: () => {
            return $.get('appointment/list')
        },
        make: (batchId, userQuotaId) => {
            return $.get('appointment/make', { batchId, userQuotaId })
        },
        confirm: (batchId) => {
            return $.get('appointment/confirm', { batchId })
        },
        list: (parameter) => {
            return $.get('appointment/list', parameter)
        },
        giveup: (id) => {
            return $.get('appointment/giveup', { id })
        }
    },
    chooseDate: {
        save: (formData) => {
            return $.post('chooseDate/save', null, formData)
        },
        list: (batchId) => {
            return $.get('chooseDate/list', { batchId })
        }
    },
    message: {
        sendVerifyCodeMessage: (name) => {
            return $.get('message/sendVerifyCodeMessage', { idcard: name })
        },
        sendAppointmentMessage: (batchId) => {
            return $.get('message/sendAppointmentMessage', { batchId })
        },
        sendEnterMessage: (batchId) => {
            return $.get('message/sendEnterMessage', { batchId })
        },
        sendFailMessage: (batchId) => {
            return $.get('message/sendFailMessage', { batchId })
        },
        sendNotEnterMessage: (batchId) => {
            return $.get('message/sendNotEnterMessage', { batchId })
        },
        sendChooseMessage: (batchId, appointmentIds) => {
            return $.get('message/sendChooseMessage', { batchId, appointmentIds })
        }
    }
}
export {
    api as default
}