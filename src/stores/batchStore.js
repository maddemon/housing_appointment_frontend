import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'
class BatchStore extends StoreBase {


    @observable rooms = []
    @observable house = []
    @observable permits = []
    @observable selectedPermit = null;
    @observable selectedHouse = null;
    @observable selectedBuilding = null;
    @observable selectedUser = null

    constructor() {
        super()
        this.getListFunc = (parameter) => api.batch.list(parameter);
        this.saveModelFunc = (model) => api.batch.save(model);
        this.deleteFunc = (id) => api.batch.delete(id);
    }

    @action async selectModel(model) {
        if (!model) {
            if (this.avaliables.length === 0) {
                await this.getAvaliables();
            }
            model = this.avaliables[0]
        }
        this.selectedModel = model;
    }

    @action getAvaliables() {
        return this.invokeApi(() => api.batch.avaliables(), (response) => {
            this.avaliables = response.list
        });
    }

    notify(batchId) {
        return this.invokeApi(() => api.batch.notify(batchId))
    }

    @action async getRooms(batchId) {
        return this.invokeApi(() => api.batch.getRooms(batchId), (response) => {
            this.rooms = response.data
        })
    }

    @action async getHouses(batchId) {
        this.loading = true;
        await this.getRooms(batchId);
        let list = [];
        this.rooms.map(room => {
            let house = list.find(e => e.name === room.name);
            if (!house) {
                house = { name: room.name, buildings: [] };
                list.push(house);
            }
            let building = house.buildings.find(e => e.name === room.building);
            if (!building) {
                building = { name: room.building, units: [] }
                house.buildings.push(building);
            }
            let unit = building.units.find(e => e.name === room.unit);
            if (!unit) {
                unit = { name: room.unit, floors: [] }
                building.units.push(unit);
            }
            let floor = unit.floors.find(e => e.name === room.floor);
            if (!floor) {
                floor = { name: room.floor, rooms: [] }
                unit.floors.push(floor);
            }
            floor.rooms.push(room);
            return room;
        });
        this.house = list;
        this.loading = false;
    }

    @action async getPermits(batchId) {
        this.loading = true;
        const response = await api.batch.getPermits(batchId);
        if (response && response.ok) {
            let list = []
            response.list.map(user => {
                let item = list.find(e => e.permitCode === user.permitCode);
                if (!item) {
                    item = { permitCode: user.permitCode, users: [] }
                    list.push(item)
                }
                item.users.push(user);
                return item;
            });
            this.permits = list;
        }
        this.loading = false
    }
    @action selectPermit(permit) {
        this.selectedPermit = permit;
        if (permit.users.length > 0) {
            this.selectUser()
        }
    }
    @action selectHouse(name) {
        if (!name) {
            if (this.house.length > 0) {
                this.selectedHouse = this.house[0]
            }
        } else {
            this.selectedHouse = this.house.find(e => e.name === name)
        }
    }
    @action selectBuilding(name) {
        if (!this.selectedHouse || !this.selectedHouse.name) {
            this.selectHouse();
        }
        if (!name) {
            this.selectedBuilding = this.selectedHouse.buildings[0]
        } else {
            this.selectedBuilding = this.selectedHouse.buildings.find(e => e.name === name)
        }
    }
    @action async selectUser(user) {
        if (!user) {
            user = this.selectedPermit.users.find(e => e.flag === "3");
            this.selectedUser = user;
        }
        else {
            this.selectedUser = user
        }
    }
    @action async selectRoom(room) {
        return await api.batch.chooseRoom(this.selectedUser.batchQuotaId, room.id)
    }
}

const store = new BatchStore();
export default store;