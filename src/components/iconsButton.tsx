import iconsList from "../fontAwesomeIcons.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Input, Popover } from "antd";

export default function IconsButton({
  onIconSelect,
}: {
  onIconSelect: (icon: { name: string; unicode: string }) => void;
}) {
  library.add(fas);
  const [search, setSearch] = useState<string>("");
  const content = (
    <>
      <Input
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icon..."
      />
      <div className="grid grid-cols-12 overflow-auto h-40 mt-2">
        {iconsList
          .filter((icon) => icon.name.includes(search.toLowerCase()))
          .map((icon) => {
            // @ts-ignore
            const ic: IconProp = "fa-solid fa-" + icon.name;
            return (
              <FontAwesomeIcon
                icon={ic}
                key={icon.unicode}
                style={{ margin: "5px", cursor: "pointer" }}
                onClick={() => onIconSelect(icon)}
              />
            );
          })}
      </div>
    </>
  );
  const btnIcon: IconProp = ["fas", "icons"];
  return (
    <>
      <Popover
        content={content}
        title="Font Awesome Icons"
        trigger="click"
        placement="bottom"
      >
        <Button>
          <FontAwesomeIcon icon={btnIcon} />
        </Button>
      </Popover>
    </>
  );
}
