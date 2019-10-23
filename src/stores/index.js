import UserStore from './userStore'
import GlobalStore from './globalStore'
import HouseStore from './houseStore'
import BatchStore from './batchStore'
import PermitStore from './permitStore'
import QuotaStore from './quotaStore'
import AppointmentStore from './appointmentStore'
import ChooseDateStore from './chooseDateStore'

export default {
    globalStore: new GlobalStore(),
    userStore: new UserStore(),
    houseStore: new HouseStore(),
    batchStore: new BatchStore(),
    permitStore: new PermitStore(),
    quotaStore: new QuotaStore(),
    appointmentStore: new AppointmentStore(),
    chooseDateStore : new ChooseDateStore()
}