import { observable, action } from 'mobx'
import api from '../common/api'
class BatchStore {

    @observable list = [];
    @observable avaliables = [];
    @observable loading = false;
    @observable selectedModel = {}
    @observable rooms = []
    @observable houses = []
    @observable permits = []
    @observable selectedPermit = null;
    @observable selectedHouse = null;
    @observable selectedBuilding = null;
    @observable selectedUser = null

    @action async selectModel(model) {
        if(!model){
            if(this.avaliables.length === 0){
                await this.getAvaliables();
            }
            model = this.avaliables[0]
        }
        this.selectedModel = model;
    }

    @action async getAvaliables() {
        this.loading = true;
        const response = await api.batch.avaliables()
        if (response && response.data) {

            this.avaliables = response.data.list
        }
        this.loading = false;
        return response.data.list
    }

    @action async getList() {
        this.loading = true;
        const response = await api.batch.list()
        if (response && response.data) {
            this.list = response.data.list
        }
        this.loading = false;
        return this.list
    }

    @action async save(data) {
        this.loading = true;
        let result = null;
        if (data.uuid) {
            result = await api.batch.edit(data)
        }
        else {
            result = await api.batch.add(data)
        }
        this.loading = false;
        return result;
    }

    @action async delete(batchUuid) {
        this.loading = true;
        const result = await api.batch.delete(batchUuid)
        this.loading = false;
        return result;
    }

    @action async notify() {
        this.loading = true;
        const result = await api.batch.notify()
        this.loading = false;
        return result;
    }

    @action async getRooms(batchUuid) {
        const response = await api.batch.getRooms(batchUuid);
        if (response && response.data) {
            this.rooms = response.data
        }
    }

    @action async getHouses(batchUuid) {
        this.loading = true;
        await this.getRooms(batchUuid);
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
        this.houses = list;
        this.loading = false;
    }

    @action async getPermits(batchUuid) {
        this.loading = true;
        const response = await api.batch.getUsers(batchUuid);
        if (response && response.data) {
            let list = []
            response.data.map(user => {
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
            if (this.houses.length > 0) {
                this.selectedHouse = this.houses[0]
            }
        } else {
            this.selectedHouse = this.houses.find(e => e.name === name)
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
            user =  this.selectedPermit.users.find(e => e.flag === "3");
            this.selectedUser =user;
        }
        else{
            this.selectedUser = user
        }
    }
    @action async selectRoom(room) {
        return await api.batch.chooseRoom(this.selectedUser.batchQuotaUuid, room.uuid)
    }
}

const store = new BatchStore();
export default store;