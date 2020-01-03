import UserStore from "./userStore";
import GlobalStore from "./globalStore";
import HouseStore from "./houseStore";
import RoomStore from "./roomStore";
import BatchStore from "./batchStore";
import PermitStore from "./permitStore";
import QuotaStore from "./quotaStore";
import AppointmentStore from "./appointmentStore";
import ChooseDateStore from "./chooseDateStore";
import MessageStore from "./messageStore";

export default {
  globalStore: new GlobalStore(),
  userStore: new UserStore(),
  houseStore: new HouseStore(),
  roomStore: new RoomStore(),
  batchStore: new BatchStore(),
  permitStore: new PermitStore(),
  quotaStore: new QuotaStore(),
  appointmentStore: new AppointmentStore(),
  chooseDateStore: new ChooseDateStore(),
  messageStore: new MessageStore()
};
