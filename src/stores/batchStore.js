import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {

    @observable list = [];

    @action async setList(page, rows) {
        //this.list = await api.batch.list(page, rows)
        let data = {
            "status": "200",
            "message": "查询成功",
            "data": {
                "pageNum": 1,
                "pageSize": 100,
                "size": 2,
                "startRow": 1,
                "endRow": 2,
                "total": 2,
                "pages": 1,
                "list": [
                    {
                        "uuid": "3",
                        "name": "测试",
                        "houseNumber": 100,
                        "address": "杭州",
                        "chooseTime": "2019-01-01",
                        "chooseAddress": "上海1",
                        "appointmentTimeStart": "2019-03-23T00:54:52.000+0000",
                        "appointmentTimeEnd": "2019-03-24T00:54:56.000+0000",
                        "createTime": "2019-03-22T00:55:00.000+0000"
                    },
                    {
                        "uuid": "1",
                        "name": "测试",
                        "houseNumber": 100,
                        "address": "杭州",
                        "chooseTime": "2019-01-01",
                        "chooseAddress": "上海",
                        "appointmentTimeStart": "2019-03-21T00:54:52.000+0000",
                        "appointmentTimeEnd": "2019-03-23T00:54:56.000+0000",
                        "createTime": "2019-03-22T00:55:00.000+0000"
                    }
                ],
                "prePage": 0,
                "nextPage": 0,
                "isFirstPage": true,
                "isLastPage": true,
                "hasPreviousPage": false,
                "hasNextPage": false,
                "navigatePages": 8,
                "navigatepageNums": [
                    1
                ],
                "navigateFirstPage": 1,
                "navigateLastPage": 1,
                "firstPage": 1,
                "lastPage": 1
            }
        };
        this.list = data.data.list
    }

    @action async save(data) {
        if (data.uuid) {
            await api.batch.edit(data)
        }
        else {
            await api.batch.add(data)
        }
    }
}

const store = new BatchStore();
export default store;