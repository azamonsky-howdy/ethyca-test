import { Card, Col, Flex, Row, Select } from "antd";
import { useContext } from "react";
import { SystemContext } from "../contexts/systemContext";
import Category from "../models/category";
import { Layout } from "../models/layout";
interface FiltersSectionParams {
  className: string;
  setCategories: (categories: string[]) => void;
  setDataUseItem: (dataUseItem: string) => void;
  setLayout: (layout: Layout) => void;
  layout: Layout;
}

export interface FilterModel {
  categories: string[];
  dataUse: string;
}
function FiltersSection({
  className,
  layout,
  setCategories,
  setDataUseItem,
  setLayout,
}: FiltersSectionParams) {
  const { parametrizedData } = useContext(SystemContext);
  const handleDataCategoriesChange = (categories: string[]) => {
    setCategories(categories);
  };

  const handleDataUseChange = (dataUseItem: string) => {
    setDataUseItem(dataUseItem);
  };

  const handleLayoutChange = (layout: Layout) => {
    setLayout(layout);
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Row gutter={16} justify="center" align="middle" className="w-full">
        <Col xs={24} sm={24} md={16} lg={8}>
          <Card title="Filters">
            <Flex gap="0px 10px" wrap>
              <Select
                allowClear
                className="min-w-40"
                placeholder="Data Categories"
                mode="multiple"
                onChange={handleDataCategoriesChange}
                options={Object.values(parametrizedData.dataCategories).map(
                  (category: Category) => {
                    return {
                      value: category.id,
                      label: <span>{category.name}</span>,
                    };
                  }
                )}
              />

              <Select
                className="min-w-60"
                placeholder="Data Use"
                onChange={handleDataUseChange}
                options={Object.values(parametrizedData.dataUse).map(
                  (dataUseItem: string) => {
                    return {
                      value: dataUseItem,
                      label: <span>{dataUseItem}</span>,
                    };
                  }
                )}
                allowClear
              />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={4}>
          <Card title="Layout">
            <Flex gap="0px 10px" wrap>
              <Select
                options={[
                  { value: "system-type", label: "System Type" },
                  { value: "data-use", label: "Data Use" },
                ]}
                value={layout}
                onChange={handleLayoutChange}
              />
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FiltersSection;
