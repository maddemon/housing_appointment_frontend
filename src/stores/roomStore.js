import api from "../common/api";
import StoreBase from "./storeBase";
import { observable, action } from "mobx";
import { RoomTypes } from "../common/config";

export default class RoomStore extends StoreBase {
  @observable rooms = null;
  @observable resultList = [];
  @observable buildings = null;
  @observable selectedBuildings = {};
  @observable selectedHouse = null;
  @observable selectedRoom = null;
  @observable chooseResult = null;

  @action getResultList(enterList) {
    var quotaIds = [];
    enterList.forEach(permit => {
      quotaIds = quotaIds.concat(permit.quotas.map(q => q.id))
    }
    )
    this.invokeApi(
      () => api.room.resultList(quotaIds),
      response => (this.resultList = response.data)
    );
  }

  getResult(quotaId) {
    return this.resultList.filter(e => e.quotaID === quotaId);
  }

  @action clearAllSelected() {
    this.selectedBuildings = {};
    this.selectedHouse = null;
    this.chooseResult = null;
    this.selectedRoom = null;
  }

  @action async confirmChoose(batchId, quotaId) {
    return await this.invokeApi(
      () =>
        api.room.choose({
          batchId,
          quotaId,
          roomIds: Object.keys(this.selectedRoom).map(
            formType => this.selectedRoom[formType].id
          )
        }),
      response => {
        this.chooseResult = {
          houseId: this.selectedHouse.id,
          batchId,
          quotaId
        };
      }
    );
  }

  @action async giveupChoose(batchId, quotaId) {
    return await this.invokeApi(
      () => api.room.giveup(batchId, quotaId),
      response => {
        this.chooseResult = {
          batchId,
          quotaId
        };
      }
    );
  }

  @action getRooms(houseId) {
    this.invokeApi(
      () => api.room.list(houseId),
      response => {
        this.rooms = response.data;
        this.getBuildings();
      }
    );
  }

  @action getTerrace(room) {
    if (this.rooms.terrace) {
      return this.rooms.terrace.find(
        e =>
          e.profile.building === room.profile.building &&
          e.profile.number === room.profile.number
      );
    }
  }

  @action selectBuilding(roomType, number) {
    this.selectedBuildings[roomType] = number;
  }

  @action selectHouse(house) {
    this.selectedHouse = house;
    if (house) {
      this.getRooms(house.id);
    } else {
      this.selectRoom(null);
    }
  }

  @action selectRoom(room) {
    if (room) {
      if (!this.selectedRoom) {
        this.selectedRoom = {};
      }
      this.selectedRoom[RoomTypes[room.type]] = room;
      //如果是住宅且有露台，则自动选中露台
      if (room.type === 1) {
        const terrace = this.getTerrace(room);
        if (terrace) {
          this.selectRoom(terrace);
        }
      }
      this.selectedBuildings[room.type] = room.profile.building || room.profile.area ;
    } else {
      this.selectedRoom = null;
      this.selectedBuildings = {};
    }
  }

  @action getBuildings() {
    let buildings = {};
    if (!this.rooms) return;
    Object.keys(this.rooms).forEach(roomType => {
      buildings[roomType] = {};
      this.rooms[roomType].forEach(room => {
        let key = room.profile.building || room.profile.area;
        if (!buildings[roomType][key]) {
          buildings[roomType][key] = [room];
        } else {
          buildings[roomType][key].push(room);
        }
      });
    });
    return (this.buildings = buildings);
  }

  @action resetResult(quotaId) {
    this.chooseResult = false;
    this.selectedHouse = null;
    this.selectedRoom = null;
    this.invokeApi(() => api.room.resetResult(quotaId), () => {
    })
  }
}
