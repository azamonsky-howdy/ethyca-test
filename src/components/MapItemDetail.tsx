import { Tag } from "antd";

interface MapItemDetailParams {
  title: string;
  color: string;
  details: string[];
}

function MapItemDetail({ title, color, details = [] }: MapItemDetailParams) {
  return (
    <>
      <h2 className="mt-1">{title}</h2>
      {details.length ? (
        details.map((detail) => (
          <Tag key={detail} color={color}>
            {detail}
          </Tag>
        ))
      ) : (
        <span>No Data</span>
      )}
    </>
  );
}

export default MapItemDetail;
