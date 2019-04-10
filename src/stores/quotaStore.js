import { observable } from 'mobx'
import api from '../common/api'
class QuotaStore {

    @observable list = [];
    @observable myList = [];

    async setList(page, rows) {
        this.list = await api.quota.list(page, rows)
    }

    async setMyList() {
        //const data =  await api.quota.listOfCustomer()
        const data = {
            "status": "200",
            "message": "操作成功",
            "data": "[{\"createTime\":1553218997000,\"quotaStatus\":1,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"},{\"createTime\":1553218997000,\"quotaStatus\":0,\"userUuid\":\"1\",\"uuid\":\"1\"}]"
        };
        this.myList = JSON.parse(data.data);
    }

    async save(data) {
        await api.quota.add(data);
    }

    async delete(quotaUuid) {
        await api.quota.delete(quotaUuid)
    }

}

const store = new QuotaStore();
export default store;