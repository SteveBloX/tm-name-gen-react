import React, { useEffect, useState } from "react";
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
import {
  applyColorsToHTMLString,
  generateGradient,
  randomHue,
  shortenHex,
} from "./colors";
import HorizontalColorPicker from "./components/horizontalColorPicker";
import { nanoid } from "nanoid";
import SavedUsernamesDrawer from "./components/savedUsernamesDrawer";
import GradientUsername from "./components/gradientUsername";
import ShadesContext from "./components/shadesContext";
import {
  faCopy,
  faDatabase,
  faDice,
  faMoon,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Values from "values.js";
import { randomInRange } from "./utils";
import FormatEditor from "./components/formatEditor";

library.add(faCopy, faSave, faDatabase, faTrash, faPlus, faMoon, faDice);

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
    React.useState<number>(NaN);

  const [usernameHTML, setUsernameHTML] = useState(defaultUsername);
  const usernameText = usernameHTML.replace(/<[^>]*>/g, "");
  const previewHTML = applyColorsToHTMLString(gradient, usernameHTML);
  useEffect(() => {
    const minLen = middleColorEnabled ? 3 : 2;
    if (!username) {
      setGradient(
        generateGradient(
          startColor,
          middleColor,
          middleColorEnabled,
          endColor,
          usernameText.length
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
          usernameText.length
        )
      );
  }, [usernameText, startColor, middleColor, middleColorEnabled, endColor]);

  function genCode() {
    let cd = previewHTML
      .replaceAll(/<b style="font-weight: italic;">(.*?)<\/b>/g, "$o$i$1$i$o")
      .replaceAll(/<i style="font-weight: bold;">(.*?)<\/i>/g, "$i$o$1$o$i")
      .replaceAll(/<b style="">(.*?)<\/b>/g, "$o1$o")
      .replaceAll(/<i style="">(.*?)<\/i>/g, "$i1$i")
      .replaceAll(/<b>(.*?)<\/b>/g, "$o$1$o")
      .replaceAll(/<i>(.*?)<\/i>/g, "$i$1$i");

    const spanRegex = /<span style="color: #([0-9A-F]{3,6})">([^<]+)<\/span>/g;
    cd = cd.replaceAll(
      spanRegex,
      (_: any, color: string, char: string) => `$${color}${char}`
    );
    console.log("code", cd);
    return cd;
  }

  const tmCode = genCode();

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

  const [darkMode, setDarkMode] = React.useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", (!darkMode).toString());
  }

  const [middleColorRandomWarning, setMiddleColorRandomWarning] =
    useState<boolean>(false);

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
            <FormatEditor
              colors={gradient}
              usernameHTML={usernameHTML}
              setUsernameHTML={setUsernameHTML}
              usernameText={usernameText}
              previewHTML={previewHTML}
              defaultUsername={defaultUsername}
            />
            {/*<Input
              status={username.length === 0 ? "error" : ""}
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
                    : NaN
                );
              }}
            />*/}
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
            className="mb-2"
          >
            Enable middle color
          </Checkbox>
          <br />
          <div className="flex">
            <Button
              type="default"
              icon={<FontAwesomeIcon icon={faDice} />}
              iconPosition="end"
              className="mr-2"
              onClick={() => {
                const color = randomHue();
                const col = new Values(color);
                const colors = col
                  .all(21)
                  .map((c) => c.hexString())
                  .filter((c) => c !== color);
                const midColor = colors[randomInRange(0, colors.length - 1)];
                const ndColor = colors[randomInRange(0, colors.length - 1)];
                setStartColor(color);
                if (middleColorEnabled) {
                  setMiddleColor(midColor);
                  if (!middleColorRandomWarning) {
                    messageApi.warning(
                      "Middle color may not look good with random colors",
                      5
                    );
                    setMiddleColorRandomWarning(true);
                  }
                }
                setEndColor(ndColor);
              }}
            >
              Randomize
            </Button>
            <ShadesContext
              setStartColor={setStartColor}
              setMiddleColor={(c) => {
                setMiddleColor(c);
                setMiddleColorEnabled(true);
              }}
              setEndColor={setEndColor}
            />
          </div>
          <div
            className="gradientPrev rounded-full w-full h-2 mt-4"
            style={{
              background: `linear-gradient(to right, ${gradient.join(", ")})`,
            }}
          />
          <Divider plain>Result</Divider>
          <p className="text-lg dark:text-light">Preview</p>
          <div
            className="mb-3 fa-font-bold preview"
            dangerouslySetInnerHTML={{
              __html: previewHTML,
            }}
          ></div>
          <p className="text-lg mb-1 dark:text-light">Trackmania Code</p>
          <Space.Compact>
            <Input readOnly value={tmCode} className="fa-input" />
            <Button
              type="primary"
              onClick={() => {
                navigator.clipboard
                  .writeText(tmCode)
                  .then(() => messageApi.success("Copied to clipboard"));
              }}
              icon={<FontAwesomeIcon icon={faCopy} />}
              iconPosition="end"
            >
              Copy
            </Button>
          </Space.Compact>
          <Divider plain>Storage</Divider>
          <Button
            type="dashed"
            onClick={save}
            className="mr-3"
            icon={<FontAwesomeIcon icon={faSave} />}
            iconPosition="start"
          >
            {storageNanoid ? "Update" : "Save"}
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
                <Button
                  type="dashed"
                  className="mr-3"
                  danger
                  icon={<FontAwesomeIcon icon={faTrash} />}
                >
                  Delete
                </Button>
              </Popconfirm>
              <Button
                type="dashed"
                onClick={() => {
                  // reload page
                  window.location.reload();
                }}
                icon={<FontAwesomeIcon icon={faPlus} />}
              >
                New
              </Button>
            </>
          )}
          <FloatButton.Group shape="square">
            <FloatButton
              icon={
                darkMode ? (
                  <FontAwesomeIcon icon={faMoon} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} />
                )
              }
              onClick={toggleDarkMode}
            />
            <FloatButton
              onClick={() => setStorageDrawerVisible(true)}
              icon={<FontAwesomeIcon icon={faDatabase} />}
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
              setUsernameHTML(username);
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
