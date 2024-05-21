import { generateGradient } from "../colors";
import React from "react";
import { Button, ColorPicker, Popconfirm } from "antd";
import TextWithIcon from "./textWithIcon";
import { DeleteFilled, DownloadOutlined } from "@ant-design/icons";
import GradientUsername from "./gradientUsername";

export default function SavedUsernameView({
  id,
  onDelete,
  onLoad,
}: {
  id: string;
  onDelete: (id: string) => void;
  onLoad: (id: string) => void;
}) {
  const { username, startColor, middleColor, middleColorEnabled, endColor } =
    JSON.parse(localStorage.getItem(id) || "{}");
  const gradient = generateGradient(
    startColor,
    middleColor,
    middleColorEnabled,
    endColor,
    username.length
  );

  return (
    <>
      <p className="font-bold text-xl mb-4">
        {gradient.map((color, i) => (
          <span style={{ color }} key={i}>
            {username[i]}
          </span>
        ))}
      </p>
      <div className="mb-3">
        <ColorPicker
          disabled
          value={startColor}
          showText={(c) => `#${c.toHex()}`}
          className="mr-2"
        />
        {middleColorEnabled && (
          <ColorPicker
            disabled
            value={middleColor}
            showText={(c) => `#${c.toHex()}`}
            className="mr-2"
          />
        )}
        <ColorPicker
          disabled
          value={endColor}
          showText={(c) => `#${c.toHex()}`}
        />
      </div>
      <Button onClick={() => onLoad(id)} type="primary" className="mr-3">
        <TextWithIcon text="Load" icon={<DownloadOutlined />} />
      </Button>
      <Popconfirm
        title="Delete nickname?"
        onConfirm={() => {
          onDelete(id);
        }}
        description={
          <p>
            Are you sure you want to delete nickname{" "}
            <GradientUsername username={username} gradient={gradient} /> from
            storage?
          </p>
        }
        okText="Yes"
        cancelText="No"
      >
        <Button type="dashed" className="mr-3" danger>
          <TextWithIcon text="Delete" icon={<DeleteFilled />} />
        </Button>
      </Popconfirm>
    </>
  );
}
