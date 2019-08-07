import $ from './utils'
const api = {
    user: {
        login: (data) => {
            let path = "user/login";
            if (data.code && !data.password) {
                path = "user/phoneLogin";
            }
            return $.post(path, null, data)
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
        sendVerifyCode: (phone) => {
            return $.get('user/sendVerifyCode', { phone })
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
        list: () => {
            return $.get('batch/list', { pageIndex: 1, pageSize: 999 })
        },
        avaliables: () => {
            return $.get('batch/batchAvaliable', { pageIndex: 1, pageSize: 999 })
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
                        "userName": "langxing",
                        "flag": "3"
                    },
                ],
                "message": "",
                "status": "200"
            }
        },
        chooseRoom: (batchQuotaUuid, roomUuid) => {
            return $.put('batch/chooseRoom', null, { batchQuotaUuid, roomUuid })
        }
    },
    permit: {
        list: (searchKey, pageIndex, pageSize) => {
            return $.get('permit/permit', { searchKey, pageIndex, pageSize })
        },
        statistic: () => {
            return $.get('permit/statistical')
        },
        add: (data) => {
            return $.post('permit/permit', null, data)
        },
        edit: (data) => {
            return $.put('permit/permit', data)
        },
        delete: (permitUuid) => {
            return $.get('permit/delete', { permitUuid })
        },
        userPermits: () => {
            return $.get('quota/userQuota')
        }
    },
    quota: {
        delete: (quotaUuid) => {
            return $.post('quota/delete', null, { quotaUuid })
        },
        list: (permitUuid, pageIndex, pageSize) => {
            return $.get('quota/list', { permitUuid, pageIndex, pageSize })
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