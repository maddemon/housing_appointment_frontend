import $ from './utils'
const api = {
    user: {
        login: (account, password) => {
            return $.post('user/login', null, { account, password })
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
        edit: (data) => {
            return $.put('houses/edit', null, data)
        },
        delete: (uuid) => {
            return $.get('houses/delete', { uuid })
        },
        list: (pageIndex, pageSize) => {
            return $.get('houses/housesList', { pageIndex, pageSize })
        },
        avaliables: () => {
            return $.get('houses/houses')
        },
        getImportUrl: () => {
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
        successAppointment: (batchUuid) => {
            return $.get('batch/successAppointment', { batchUuid })
        },
        getRooms: (batchUuid) => {
            return $.get('batch/batchRoom', { batchUuid })
        },
        getUsers: (batchUuid) => {
            //return $.get('batch/batchUser', { batchUuid })
            return {
                "data": [
                    {
                        "batchQuotaUuid": "1",
                        "idCard": "1122334455",
                        "permitCode": "00161678",
                        "userName": "langxing"
                    },
                ],
                "message": "",
                "status": "200"
            }
        }
    },
    quota: {
        delete: (quotaUuid) => {
            return $.post('quota/delete', null, { quotaUuid })
        },
        list: (status, queryWord, pageIndex, pageSize) => {
            return $.get('quota/list', { status, queryWord, pageIndex, pageSize })
        },
        userQuotas: () => {
            return $.get('quota/userQuota')
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