import React from "react";
import { Tabs } from "antd";
import { RoomTypeNames } from "../../common/config";
import BuildingList from "./_buildingList";

const HouseDetail = ({ loading, house, buildings }) => (
  <>
    {buildings ? (
      <Tabs>
        {Object.keys(buildings).map(type => (
          <Tabs.TabPane key={type} tab={RoomTypeNames[type]}>
            <BuildingList roomType={type} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    ) : null}
  </>
);
export { HouseDetail as default };
