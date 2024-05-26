import { useState } from "react";
import Values from "values.js";
import { Button, ColorPicker, Dropdown, MenuProps, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice, faDroplet } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { randomHue } from "../colors";

library.add(faDice, faDroplet);

export default function ShadesContext({
  setStartColor,
  setMiddleColor,
  setEndColor,
}: {
  setStartColor: (color: string) => void;
  setMiddleColor: (color: string) => void;
  setEndColor: (color: string) => void;
}) {
  const [color, setColor] = useState<string>(randomHue());
  const col = new Values(color);
  const colors = col.all(21).map((color) => "#" + color.hex);
  return (
    <Popover
      placement="bottom"
      content={() => (
        <div>
          <div className="flex justify-between gap-1.5 mb-3">
            {colors.map((color, i) => {
              const items: MenuProps["items"] = [
                {
                  key: "1",
                  label: "Use as",
                  children: [
                    {
                      key: "1-1",
                      label: "Start color",
                      onClick: () => setStartColor(color),
                    },
                    {
                      key: "1-2",
                      label: "Middle color",
                      onClick: () => setMiddleColor(color),
                    },
                    {
                      key: "1-3",
                      label: "End color",
                      onClick: () => setEndColor(color),
                    },
                  ],
                },
                {
                  key: "2",
                  label: "Generate shades",
                  onClick: () => setColor(color),
                },
                {
                  key: "3",
                  label: "Copy",
                  onClick: () => navigator.clipboard.writeText(color),
                },
              ];
              return (
                <Dropdown menu={{ items }} key={i} trigger={["click"]}>
                  <div
                    style={{
                      backgroundColor: color,
                      width: "37px",
                      height: "30px",
                      borderRadius: "5px",
                    }}
                  ></div>
                </Dropdown>
              );
            })}
          </div>
          <div className="flex">
            <ColorPicker
              value={color}
              onChange={(e) => setColor("#" + e.toHex())}
              showText={(color) => "#" + color.toHex()}
              className="mr-2"
              disabledAlpha
            />
            <Button
              type="default"
              onClick={() => setColor(randomHue())}
              icon={<FontAwesomeIcon icon={faDice} />}
            ></Button>
          </div>
        </div>
      )}
      title="Generate shade"
      trigger="click"
    >
      <Button iconPosition="end" icon={<FontAwesomeIcon icon={faDroplet} />}>
        Shade helper
      </Button>
    </Popover>
  );
}
