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
        editPassword: (passwordOld, passwordNew) => {
            return $.post('user/changePassword', null, { passwordOld, passwordNew })
        },
        getImportUrl: () => {
            return '/house/user/addByExcel'
        },
        import: (file) => {
            let formData = new FormData();
            formData.append('file', file);
            return $.post('user/addByExcel', null, formData)
        }
    },
    houses: {
        add: (data) => {
            return $.post('houses/add', null, data)
        },
        edit: (data) => {
            return $.post('houses/edit', null, data)
        },
        delete: (uuid) => {
            return $.get('houses/delete', { uuid })
        },
        list: (batchUuid, pageIndex, pageSize) => {
            return $.get('houses/list', { batchUuid, pageIndex, pageSize })
        },
        avaliables: () => {
            return $.get('houses/avaliables')
        },
        getImportUrl :()=>{
            return '/house/houses/add'
        }
    },
    batch: {
        add: (data) => {
            return $.post('batch/add', null, data)
        },
        edit: (data) => {
            return $.post('batch/edit', null, data)
        },
        delete: (uuid) => {
            return $.get('batch/delete', { uuid })
        },
        list: (pageIndex, pageSize) => {
            return $.get('batch/list', { pageIndex, pageSize })
        },
        avaliables: (pageIndex, pageSize) => {
            return $.get('batch/batchAvaliable', { pageIndex, pageSize })
        },
    },
    quota: {
        delete: (quotaUuid) => {
            return $.post('quota/delete', null, { quotaUuid })
        },
        list: (status, queryWord, pageIndex, pageSize) => {
            return $.get('quota/list', { status, queryWord, pageIndex, pageSize })
        },
        listOfCustomer: () => {
            return $.get('quota/listOfCustomer')
        },
        getImportUrl: () => {
            return '/house/quota/add';
        }
    },
    reserve: {
        history: (userUuid, pageIndex, pageSize) => {
            return $.get('reserve/history', { userUuid, pageIndex, pageSize })
        },
        reserve: (batchUuid, quotaUuid) => {
            return $.post('reserve/reserve', null, { batchUuid, quotaUuid })
        },
        results: (queryWord, pageIndex, pageSize) => {
            return $.get('reserve/result', { queryWord, pageIndex, pageSize })
        },
        list: (batchUuid, pageIndex, pageSize) => {
            return $.get('reserve/reserveList', { batchUuid, pageIndex, pageSize })
        },
        import: (batchUuid, file) => {
            return $.post('reserve/reserveExcel', { batchUuid }, file)
        }
    }
}
export {
    api as default
}