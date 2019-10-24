import { observable, action } from 'mobx'
import api from '../common/api'
import StoreBase from './storeBase'
export default class BatchStore extends StoreBase {

    @observable avaliables = []

    @observable rooms = []
    @observable house = []
    @observable permits = []
    @observable selectedPermit = null;
    @observable selectedHouse = null;
    @observable selectedBuilding = null;
    @observable selectedUser = null

    constructor() {
        super()
        this.invokeListApi = (parameter) => api.batch.list(parameter);
        this.invokeSaveApi = (model) => api.batch.save(model);
        this.invokeGetModelApi = (id) => api.batch.getModel(id);
        this.invokeDeleteApi = (id) => api.batch.delete(id);
    }

    @action async getAvaliables() {
        return await this.invokeApi(() => api.batch.list({ canAppointment: 1 }), (response) => {
            this.avaliables = response.data.list
        });
    }

    @action async getModel(id) {
        if (!id) {
            if (this.avaliables.length === 0) {
                await this.getAvaliables();
            }
            this.model = this.avaliables.length === 0 ? null : this.avaliables[0]
        } 
        else if(this.model == null || id != this.model.id){
            await super.getModel(id)
        }
        return this.model;
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