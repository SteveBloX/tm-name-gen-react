import React, { useEffect } from "react";
import "./App.css";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  FloatButton,
  Input,
  message,
  Popconfirm,
  Space,
  theme,
} from "antd";
import { generateGradient, shortenHex } from "./colors";
import HorizontalColorPicker from "./components/horizontalColorPicker";
import {
  CopyFilled,
  DeleteFilled,
  MoonFilled,
  MoonOutlined,
  PlusCircleFilled,
  SaveFilled,
} from "@ant-design/icons";
import TextWithIcon from "./components/textWithIcon";
import { nanoid } from "nanoid";
import SavedUsernamesDrawer from "./components/savedUsernamesDrawer";
import GradientUsername from "./components/gradientUsername";
import IconsButton from "./components/iconsButton";

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const defaultUsername = "nickname";
  const [username, setUsername] = React.useState<string>(defaultUsername);
  // colors
  const [startColor, setStartColor] = React.useState<string>("#0958D9");
  const [middleColor, setMiddleColor] = React.useState<string>("#000000");
  const [middleColorEnabled, setMiddleColorEnabled] =
    React.useState<boolean>(false);
  const [endColor, setEndColor] = React.useState<string>("#69B1FF");
  const [gradient, setGradient] = React.useState<string[]>([]);
  const [storageNanoid, setStorageNanoid] = React.useState<string>("");
  const [lastUsernameInputCursor, setLastUsernameInputCursor] =
    React.useState<number>(0);
  useEffect(() => {
    const minLen = middleColorEnabled ? 3 : 2;
    if (!username) {
      setGradient(
        generateGradient(
          startColor,
          middleColor,
          middleColorEnabled,
          endColor,
          defaultUsername.length
        )
      );
    } else if (username.length <= minLen)
      setGradient(
        middleColorEnabled
          ? [
              shortenHex(startColor),
              shortenHex(middleColor),
              shortenHex(endColor),
            ]
          : [shortenHex(startColor), shortenHex(endColor)]
      );
    if (username.length > minLen)
      setGradient(
        generateGradient(
          startColor,
          middleColor,
          middleColorEnabled,
          endColor,
          username.length
        )
      );
  }, [username, startColor, middleColor, middleColorEnabled, endColor]);

  const tmCode = gradient
    .slice(0, username ? username.length : defaultUsername.length)
    .map(
      (c, i) =>
        `$${c.replace("#", "")}${username ? username[i] : defaultUsername[i]}`
    )
    .join("");

  const tmCodeRef = React.useRef<any>(null);

  function save() {
    if (username.length < 2) {
      messageApi.error("Nickname must be at least 2 characters long");
      return;
    }
    if (storageNanoid) {
      localStorage.setItem(
        storageNanoid,
        JSON.stringify({
          id: storageNanoid,
          username,
          startColor,
          middleColor,
          middleColorEnabled,
          endColor,
        })
      );
      messageApi.success("Saved");
    } else {
      const id = `username_${nanoid(11)}`;
      localStorage.setItem(
        id,
        JSON.stringify({
          id,
          username,
          startColor,
          middleColor,
          middleColorEnabled,
          endColor,
        })
      );
      setStorageNanoid(id);
    }
  }

  const [storageDrawerVisible, setStorageDrawerVisible] =
    React.useState<boolean>(false);

  /*useEffect(() => {
    console.log("Added event listener");
    window.addEventListener(
      "beforeunload",
      (e) => {
        if (storageNanoid) {
          const storageData = JSON.parse(
            localStorage.getItem(storageNanoid) || "{}"
          );
          if (
            storageData.username !== username ||
            storageData.startColor !== startColor ||
            storageData.middleColor !== middleColor ||
            storageData.middleColorEnabled !== middleColorEnabled ||
            storageData.endColor !== endColor
          ) {
            console.log("Saved data is different");
            return "You have unsaved changes. Are you sure you want to leave?";
          }
        } else {
          if (username !== defaultUsername) {
            console.log("Username is different");
            e.preventDefault();
            return (e.returnValue = "");
          }
        }
      },
      { capture: true }
    );
  });*/

  const [darkMode, setDarkMode] = React.useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  }
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className={`app ${darkMode && "dark"} dark:bg-[#121212]`}>
        <div className="main-card dark:bg-[#212121]">
          {contextHolder}
          <h1 className="text-xl font-bold mb-5 dark:text-light">
            Trackmania Nickname Generator
          </h1>
          <p className="text-gray-500 text-sm mb-0.5 dark:text-light">
            Nickname
          </p>
          <div className="flex justify-between">
            <Input
              status={username.length === 0 ? "error" : ""}
              placeholder="meow"
              count={{
                show: true,
              }}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="mr-2 fa-input"
              onBlur={(e) => {
                setLastUsernameInputCursor(
                  e.target.selectionStart !== null
                    ? e.target.selectionStart
                    : username.length
                );
              }}
            />
            <IconsButton
              onIconSelect={(icon) => {
                setUsername(
                  username.slice(0, lastUsernameInputCursor) +
                    String.fromCharCode(
                      parseInt(icon.unicode.toUpperCase(), 16)
                    ) +
                    username.slice(lastUsernameInputCursor)
                );
              }}
            />
          </div>
          <Divider plain>Colors</Divider>
          <div className="mb-1 flex justify-between">
            <HorizontalColorPicker
              showText={() => "Start color"}
              value={startColor}
              onChangeComplete={(c) => setStartColor(c.toHex())}
              disabledAlpha
            />
            <HorizontalColorPicker
              showText={() => "Middle color"}
              value={middleColor}
              onChangeComplete={(c) => setMiddleColor(c.toHex())}
              disabledAlpha
              disabled={!middleColorEnabled}
            />
            <HorizontalColorPicker
              showText={() => "End color"}
              value={endColor}
              onChangeComplete={(c) => setEndColor(c.toHex())}
              disabledAlpha
            />
          </div>
          <Checkbox
            onChange={(e) => setMiddleColorEnabled(e.target.checked)}
            checked={middleColorEnabled}
          >
            Enable middle color
          </Checkbox>
          <div
            className="gradientPrev rounded-full w-full h-2 mt-4"
            style={{
              background: `linear-gradient(to right, ${gradient.join(", ")})`,
            }}
          />
          <Divider plain>Result</Divider>
          <p className="text-lg dark:text-light">Preview</p>
          <div className="font-bold mb-3 fa-font">
            {gradient
              .slice(0, username ? username.length : defaultUsername.length)
              .map((color, i) => (
                <span style={{ color }} key={i}>
                  {username ? username[i] : defaultUsername[i]}
                </span>
              ))}
          </div>
          <p className="text-lg mb-1 dark:text-light">Trackmania Code</p>
          <Space.Compact>
            <Input
              readOnly
              value={tmCode}
              ref={tmCodeRef}
              // select all text on focus
              onFocus={(e) =>
                tmCodeRef.current.focus({
                  cursor: "all",
                })
              }
              className="fa-input"
            />
            <Button
              type="primary"
              onClick={() => {
                navigator.clipboard
                  .writeText(tmCode)
                  .then(() => messageApi.success("Copied to clipboard"));
              }}
            >
              <TextWithIcon text="Copy" icon={<CopyFilled />} reverse={false} />
            </Button>
          </Space.Compact>
          <Divider plain>Storage</Divider>
          <Button type="dashed" onClick={save} className="mr-3">
            <TextWithIcon
              text={storageNanoid ? "Update" : "Save"}
              icon={<SaveFilled />}
              reverse={true}
            />
          </Button>
          {storageNanoid && (
            <>
              <Popconfirm
                title="Delete nickname?"
                onConfirm={() => {
                  localStorage.removeItem(storageNanoid);
                  setStorageNanoid("");
                }}
                description={
                  <p>
                    Are you sure you want to delete nickname{" "}
                    <GradientUsername username={username} gradient={gradient} />{" "}
                    from storage?
                  </p>
                }
                okText="Yes"
                cancelText="No"
              >
                <Button type="dashed" className="mr-3" danger>
                  <TextWithIcon text="Delete" icon={<DeleteFilled />} />
                </Button>
              </Popconfirm>
              <Button
                type="dashed"
                onClick={() => {
                  // reload page
                  window.location.reload();
                }}
              >
                <TextWithIcon text="New" icon={<PlusCircleFilled />} />
              </Button>
            </>
          )}
          <FloatButton.Group shape="square">
            <FloatButton
              icon={darkMode ? <MoonOutlined /> : <MoonFilled />}
              onClick={toggleDarkMode}
            />
            <FloatButton
              onClick={() => setStorageDrawerVisible(true)}
              icon={<SaveFilled />}
            />
          </FloatButton.Group>
          <SavedUsernamesDrawer
            open={storageDrawerVisible}
            setOpen={setStorageDrawerVisible}
            onLoad={(id) => {
              const {
                username,
                startColor,
                middleColor,
                middleColorEnabled,
                endColor,
              } = JSON.parse(localStorage.getItem(id) || "{}");
              setMiddleColorEnabled(middleColorEnabled);
              setMiddleColor(middleColor);
              setStartColor(startColor);
              setEndColor(endColor);
              setUsername(username);
              setStorageNanoid(id);
              setStorageDrawerVisible(false);
            }}
            messageApi={messageApi}
            onDelete_={(id) => {
              if (id === storageNanoid) {
                setStorageNanoid("");
              }
            }}
          />
          <p className="text-sm text-gray-500 italic dark:text-light mt-4">
            Made with React by{" "}
            <a
              href="https://bloax.xyz"
              className="underline dark:text-light"
              target="_blank"
              rel="noreferrer"
            >
              SteveBloX
            </a>
          </p>
          {/*<FormatTest />*/}
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
