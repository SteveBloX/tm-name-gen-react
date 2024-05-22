import { Input } from "antd";
import { useRef, useState } from "react";

export default function FormatTest() {
  const [text, setText] = useState<{ letter: string; style: string }[]>([]);
  const textAreaRef = useRef(null);

  /*const applyStyle = (tag: any) => {
    const textarea: any = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (selectedText) {
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
      setText(newText);
    }
  };*/

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Input.TextArea
        rows={10}
        value={text.map((letter) => letter.letter).join("")}
        onChange={(e) =>
          setText([
            ...text,
            ...e.target.value
              .split("")
              .map((letter) => ({ letter, style: "" })),
          ])
        }
        ref={textAreaRef}
        style={{ marginBottom: "10px" }}
      />
      {/*<Button icon={<BoldOutlined />} onClick={() => applyStyle("b")}>
        Bold
      </Button>
      <Button icon={<ItalicOutlined />} onClick={() => applyStyle("i")}>
        Italic
      </Button>
      <Button icon={<UnderlineOutlined />} onClick={() => applyStyle("u")}>
        Underline
      </Button>*/}
    </div>
  );
}
