import $ from './utils'
const api = {
    user: {
        login: (data) => {
            return $.get("user/login", data)
        },
        save: (user) => {
            return $.post('user/save', null, user)
        },
        list: (searchKey, pageIndex, pageSize) => {
            return $.get('user/list', { searchKey, pageIndex, pageSize })
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
        edit: (data) => {
            return $.put('house/edit', null, data)
        },
        delete: (houseId) => {
            return $.get('house/delete', { houseId })
        },
        list: (pageIndex, pageSize) => {
            return $.get('house/list', { pageIndex, pageSize })
        },
        getImportUrl: () => {
            return '/api/house/import'
        }
    },
    batch: {
        save: (data) => {
            return $.post('batch/add', null, data)
        },
        delete: (id) => {
            return $.get('batch/delete', { id })
        },
        list: () => {
            return $.get('batch/list', { pageIndex: 1, pageSize: 999 })
        },
        avaliables: () => {
            return $.get('batch/list', { avaliable: true, pageIndex: 1, pageSize: 999 })
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
        list: (key, pageIndex, pageSize) => {
            return $.get('permit/list', { key, pageIndex, pageSize })
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
        delete: (quotaId) => {
            return $.post('quota/delete', null, { quotaId })
        },
        list: (permitId, pageIndex, pageSize) => {
            return $.get('quota/list', { permitId, pageIndex, pageSize })
        },
    },
    appointment: {
        history: () => {
            return $.get('appointment/list')
        },
        make: (batchId, quotaId) => {
            return $.post('appointment/make', null, { batchId, quotaId })
        },
        list: (batchId, pageIndex, pageSize) => {
            return $.get('appointment/list', { batchId, pageIndex, pageSize })
        }
    }
}
export {
    api as default
}