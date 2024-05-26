import { generateGradient } from "../colors";
import React from "react";
import { Button, ColorPicker, Popconfirm } from "antd";
import GradientUsername from "./gradientUsername";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faDownload, faTrash);

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
      <span className="text-xl">
        <GradientUsername username={username} gradient={gradient} />
      </span>
      <div className="mb-3 mt-2">
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
      <Button
        onClick={() => onLoad(id)}
        type="primary"
        className="mr-3"
        icon={<FontAwesomeIcon icon={faDownload} />}
      >
        Load
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
        <Button
          type="dashed"
          className="mr-3"
          danger
          icon={<FontAwesomeIcon icon={faTrash} />}
        >
          Delete
        </Button>
      </Popconfirm>
    </>
  );
}
