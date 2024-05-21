import { blue, cyan, green, presetPalettes, red } from "@ant-design/colors";
import { Col, ColorPicker, ColorPickerProps, Divider, Row } from "antd";

const genColorPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors,
  }));

const customPanelRender: ColorPickerProps["panelRender"] = (
  _: any,
  { components: { Picker, Presets } }: any
) => (
  <Row justify="space-between" wrap={false}>
    <Col span={13}>
      <Presets />
    </Col>
    <Divider type="vertical" style={{ height: "auto" }} />
    <Col flex="auto">
      <Picker />
    </Col>
  </Row>
);

function horizontalColorPicker(props: ColorPickerProps = {}) {
  const colorsPresets = genColorPresets({ red, green, blue, cyan });
  return (
    <ColorPicker
      presets={colorsPresets}
      styles={{ popupOverlayInner: { width: 480 } }}
      panelRender={customPanelRender}
      {...props}
    />
  );
}

export default horizontalColorPicker;
