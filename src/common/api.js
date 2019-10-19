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
        },
        sendVerifyCode: (phone) => {
            return $.get('user/getVerifyCode', { phone })
        }
    },
    house: {
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
        }
    },
    permit: {
        list: (parameter) => {
            return $.get('permit/list', parameter)
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
        userPermits: () => {
            return $.get('quota/userQuota')
        }
    },
    quota: {
        getModel: (id) => {
            return $.get('quota/GetUserQuota', { id })
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
        list: (parameter) => {
            return $.get('appointment/list', parameter)
        }
    }
}
export {
    api as default
}