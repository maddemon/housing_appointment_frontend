import api from "../common/api";
import StoreBase from "./storeBase";
import { observable, action } from "mobx";

export default class RoomStore extends StoreBase {
  @observable rooms = null;
  @observable resultList = [];
  @observable buildings = null;
  @observable selectedHouse = null;
  @observable selectedRoom = null;
  @observable chooseResult = null;

  @action getResultList(batchId) {
    this.invokeApi(
      () => api.room.resultList(batchId),
      response => (this.resultList = response.data)
    );
  }

  getResult(quotaId) {
    return this.resultList.filter(e => e.quotaID === quotaId);
  }

  @action clearAllSelected() {
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

  @action selectHouse(house) {
    this.selectedHouse = house;
    if (house) {
      this.getRooms(house.id);
    } else {
      this.selectRoom(null);
    }
  }

  getRoomTypeName(type) {
    switch (type) {
      case 1:
        return "dwelling";
      case 2:
        return "parking";
      case 3:
        return "storeroom";
      case 4:
        return "terrace";
      default:
        return "";
    }
  }

  getRoomName(typeName) {
    let roomName = "";
    switch (typeName) {
      case "dwelling":
        roomName = "住宅";
        break;
      case "parking":
        roomName = "停车位";
        break;
      case "storeroom":
        roomName = "贮藏室";
        break;
      case "terrace":
        roomName = "露台";
        break;
      default:
        roomName = "";
        break;
    }
    return roomName;
  }

  @action selectRoom(room) {
    if (room) {
      if (!this.selectedRoom) {
        this.selectedRoom = {};
      }
      this.selectedRoom[this.getRoomTypeName(room.type)] = room;
      //如果是住宅且有露台，则自动选中露台
      if (room.type === 1) {
        const terrace = this.getTerrace(room);
        if (terrace) {
          this.selectRoom(terrace);
        }
      }
    } else {
      this.selectedRoom = null;
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
}
