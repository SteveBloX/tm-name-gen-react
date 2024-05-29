import ContentEditable from "react-contenteditable";
import { Button } from "antd";
import IconsButton from "./iconsButton";
import React from "react";

const getCaretCharacterOffsetWithin = (element: HTMLElement) => {
  let caretOffset = 0;
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    caretOffset = preCaretRange.toString().length;
  }

  return caretOffset;
};

export default function FormatEditor({
  colors,
  usernameHTML,
  setUsernameHTML,
  usernameText,
  previewHTML,
  defaultUsername,
}: {
  colors: string[];
  usernameHTML: string;
  setUsernameHTML: (username: string) => void;
  usernameText: string;
  previewHTML: string;
  defaultUsername: string;
}) {
  function applyFormat(format: string, e: any) {
    e.preventDefault();
    document.execCommand(format, false);
  }

  // Apply the colors to the HTML string

  function resetAll(e: any) {
    e.preventDefault();
    setUsernameHTML(usernameHTML.replace(/<[^>]*>/g, ""));
  }

  const [lastUsernameInputCursor, setLastUsernameInputCursor] = React.useState(
    usernameHTML.length
  );

  const contentEditableRef = React.useRef<HTMLDivElement>(null);
  const insertCharacterAtCursor = (char: string, cursorPosition: number) => {
    if (contentEditableRef.current) {
      const contentEditable = contentEditableRef.current;
      const textContent = contentEditable.textContent ?? "";

      // Split the text content at the cursor position
      const beforeCursor = textContent.slice(0, cursorPosition);
      const afterCursor = textContent.slice(cursorPosition);

      // Set the new content with the character inserted
      contentEditable.innerHTML = `${beforeCursor}${char}${afterCursor}`;

      // Restore the cursor position
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(contentEditable.childNodes[0], cursorPosition + 1);
      range.setEnd(contentEditable.childNodes[0], cursorPosition + 1);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <ContentEditable
          html={usernameHTML}
          onChange={(e) => {
            setUsernameHTML(e.target.value);
            console.log(e.target.value);
          }}
          onSelect={(e) => {
            console.log("window", window.getSelection()?.anchorOffset ?? NaN);
            const offset = getCaretCharacterOffsetWithin(
              document.querySelector(".username-input") ?? document.body
            );
            console.log("offset", offset);
            setLastUsernameInputCursor(offset);
          }}
          className="username-input fa-font w-full px-2 py-[.1rem] mr-2 inline-flex items-baseline"
          innerRef={contentEditableRef}
        />
        <IconsButton
          onIconSelect={(icon) => {
            const usern = usernameHTML ? usernameHTML : defaultUsername;
            insertCharacterAtCursor(
              String.fromCharCode(parseInt(icon.unicode.toUpperCase(), 16)),
              isNaN(lastUsernameInputCursor)
                ? usern.length
                : lastUsernameInputCursor
            );
            /*setUsernameHTML(
                  usern.slice(
                    0,
                    isNaN(lastUsernameInputCursor)
                      ? usern.length
                      : lastUsernameInputCursor
                  ) +
                    String.fromCharCode(parseInt(icon.unicode.toUpperCase(), 16)) +
                    usern.slice(
                      isNaN(lastUsernameInputCursor)
                        ? usern.length
                        : lastUsernameInputCursor
                    )
                );*/
          }}
        />
      </div>

      <div className="actions mt-2.5 flex gap-2">
        <Button type="default" onMouseDown={(e) => applyFormat("bold", e)}>
          Bold
        </Button>
        <Button type="default" onMouseDown={(e) => applyFormat("italic", e)}>
          Italic
        </Button>
        <Button type="default" onMouseDown={resetAll}>
          Reset all styles
        </Button>
      </div>
    </div>
  );
}
