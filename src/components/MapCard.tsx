import { Card, Collapse, Flex, Tag } from "antd";
import System from "../models/system";
import MapItemDetail from "./MapitemDetail";

interface MapCardParams {
  system: System;
}

function MapCard({ system }: MapCardParams) {
  const categories: string[] = Object.keys(system.dataCategoriesMap);
  return (
    <Card title={system.name}>
      <h2 className="mb-1">Data Categories</h2>
      <Flex gap="4px 0" wrap>
        {categories.map((categorKey) => (
          <Tag key={categorKey} color="blue">
            {system.dataCategoriesMap[categorKey]}
          </Tag>
        ))}
        {!categories.length && (
          <span className="text-red-500">No categories to show</span>
        )}
      </Flex>

      <div className="mt-2">
        <Collapse
          style={{ background: "transparent", border: "none" }}
          items={[
            {
              key: "1",
              label: "Details",

              children: (
                <div>
                  <p>{system.description}</p>
                  <MapItemDetail
                    title="Privacy Declarations"
                    color="gold"
                    details={system.privacyDeclarations}
                  />

                  <MapItemDetail
                    title="Data Use"
                    color="red"
                    details={Object.values(system.dataUseMap)}
                  />
                  <MapItemDetail
                    title="Dependencies"
                    color="green"
                    details={system.systemDependencies}
                  />
                </div>
              ),
              style: {
                color: "red",
              },
            },
          ]}
        ></Collapse>
      </div>
    </Card>
  );
}
export default MapCard;
