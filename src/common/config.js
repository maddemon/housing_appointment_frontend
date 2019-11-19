const config = {
  SystemName: "临安区在线预约选房系统",
  Version: "2.0",
  Host: "",
  ApiPath: "/api/",
  CookieName: "token"
};
const RoomTypeNames = {
  dwelling: "住宅",
  parking: "停车位",
  storeroom: "贮藏室",
  terrace: "露台"
};
const RoomTypes = {
  1: "dwelling",
  2: "parking",
  3: "storeroom",
  4: "terrace"
};
const QuotaStats = {
  0: "未预约",
  1: "等待他人预约",
  2: "已预约",
  3: "已入围",
  4: "已选房",
  5: "尾批"
};
export { config as default, RoomTypeNames, RoomTypes, QuotaStats };
