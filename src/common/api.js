import $ from './utils'
const api = {
    user: {
        login: async (account, password) => {
            return await $.post('user/login', null, { account, password })
        },
        add: (user) => {
            return $.post('user/add', null, user)
        },
        edit: (data) => {
            return $.post('user/edit', null, data)
        },
        list: (pageIndex, pageSize) => {
            return $.get('user/list', { pageIndex, pageSize })
        },
        resetPassword: (userUuid) => {
            return $.get('user/reset', { userUuid })
        },
        editPassword: (oldPassword, newPassword) => {
            return $.get('user/changepasswrod', { oldPassword, newPassword })
        },
        import: (formData) => {
            console.log(formData)
            return $.post('user/addByExcel', null, formData)
        }
    },
    batch: {
        add: (data) => {
            return $.post('batch/add', null, data)
        },
        edit: (data) => {
            return $.post('batch/edit', null, data)
        },
        list: (pageIndex, pageSize) => {
            return $.get('batch/list', { pageIndex, pageSize })
        },
        avaliables: (pageIndex, pageSize) => {
            return $.get('batch/batchAvaliable', { pageIndex, pageSize })
        },
    },
    quota: {
        add: (data) => {
            return $.post('quota/add', null, data)
        },
        delete: (quotaUuid) => {
            return $.get('quota/delete', { quotaUuid })
        },
        list: (pageIndex, pageSize) => {
            return $.get('quota/list', { pageIndex, pageSize })
        },
        listOfCustomer: () => {
            return $.get('quota/listOfCustomer')
        },
    },
    reserve: {
        history: (userUuid, pageIndex, pageSize) => {
            return $.post('reserve/history', { userUuid, pageIndex, pageSize })
        },
        reserve: (batchUuid, quotaUuid) => {
            return $.post('reserve/reserve', { batchUuid, quotaUuid })
        },
        list: (batchUuid, pageIndex, pageSize) => {
            return $.post('reserve/reserveList', { batchUuid, pageIndex, pageSize })
        },
        import: (batchUuid, file) => {
            return $.post('reserve/reserveExcel', { batchUuid }, file)
        }
    }
}
export {
    api as default
}