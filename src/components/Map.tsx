import { useContext, useEffect, useState } from "react";
import System from "../models/system";
import { SystemContext } from "../contexts/systemContext";
import { Col, Row } from "antd";
import MapCard from "./MapCard";
import FiltersSection, { FilterModel } from "./FiltersSection";
import { Layout } from "../models/layout";
import { motion, AnimatePresence } from "framer-motion";

interface MapData {
  [groupKey: string]: System[];
}

// Function to build the map data based on system type.
const buildMapDataBasedOnSystemType = (systems: System[]): MapData => {
  const mapData: MapData = {};

  systems.forEach((system: System) => {
    if (!mapData[system.type]) {
      mapData[system.type] = [];
    }

    mapData[system.type].push(system);
  });

  return mapData;
};

// Function to build the map data based on data use.
// Since we can have more than one data use per system, this means that if we group by data use, we can have the same system repeated in more than one group
const buildMapDataBasedOnDataUse = (systems: System[]): MapData => {
  const mapData: MapData = {};

  systems.forEach((system: System) => {
    Object.keys(system.dataUseMap).forEach((dataUseItem) => {
      if (!mapData[dataUseItem]) {
        mapData[dataUseItem] = [];
      }

      mapData[dataUseItem].push(system);
    });
  });

  return mapData;
};

// Function to build the mapdata based on whatever the layout filter is setted.
const buildMapData = (layout: Layout, systems: System[]): MapData => {
  if (layout === "system-type") {
    return buildMapDataBasedOnSystemType(systems);
  }

  if (layout === "data-use") {
    return buildMapDataBasedOnDataUse(systems);
  }

  return {};
};

function Map() {
  const { systems } = useContext(SystemContext);
  const [layout, setLayout] = useState<Layout>("system-type");
  const [data, setData] = useState<MapData>({});
  const [filterModel, setFilterModel] = useState<FilterModel>({
    categories: [],
    dataUse: "",
  });

  useEffect(() => {
    const filteredSystems = systems.filter((system) => {
      let include: boolean =
        !filterModel.categories.length ||
        filterModel.categories.every(
          // Fast search thanks to the map.
          (category) => !!system.dataCategoriesMap[category]
        );

      if (!include) {
        return false;
      }

      include =
        // Fast search thanks to the map.
        !filterModel.dataUse || !!system.dataUseMap[filterModel.dataUse];

      return include;
    });
    setData(buildMapData(layout, filteredSystems));
  }, [layout, systems, filterModel]);

  const handleFilterCategoriesChange = (categories: string[]) => {
    setFilterModel((prev) => {
      return { ...prev, categories };
    });
  };

  const handleFilterDataUseChange = (dataUseItem: string) => {
    setFilterModel((prev) => {
      return { ...prev, dataUse: dataUseItem };
    });
  };

  const groups: (keyof MapData)[] = Object.keys(data);

  return (
    <>
      <FiltersSection
        className="mb-6"
        setCategories={handleFilterCategoriesChange}
        setDataUseItem={handleFilterDataUseChange}
        setLayout={setLayout}
        layout={layout}
      />
      <div>
        <Row gutter={16}>
          {groups.map((group: keyof MapData, groupIndex: number) => {
            return (
              <Col xs={24} sm={12} md={24 / groups.length} key={groupIndex}>
                <h1 className="text-center mb-2">{group}</h1>
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {data[group].map((system: System, systemIndex: number) => (
                      <motion.div
                        key={`${groupIndex}-${systemIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MapCard system={system} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
}

export default Map;
