import React, { useEffect, useRef, useState } from "react";

interface EditableContentProps {
  data: any[];
  onChange: (newData: any[]) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({
  data,
  onChange,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.innerHTML = "";
      data.forEach((block) => {
        const element: any = document.createElement(
          block.type === "input" ? "input" : "text",
        );
        if (block.type === "input") {
          element["value"] = block.value;
          addInputEventListeners(element);
        } else {
          element.textContent = block.value;
        }
        editableRef.current!.appendChild(element);
      });
      editableRef.current.focus();
    }
  }, [data]);
  const addInputEventListeners = (input: HTMLInputElement) => {
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value === "") {
        event.preventDefault();
        const parent = input.parentElement;
        if (parent) {
          const index = Array.prototype.indexOf.call(parent.children, input);
          parent.removeChild(input);
          const range = document.createRange();
          const selection: any = window.getSelection();
          if (index > 0) {
            const previousSibling = parent.children[index - 1];
            range.setStartAfter(previousSibling);
          } else {
            range.setStart(parent, 0);
          }
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  };
  const handleInput = () => {
    const newData = Array.from(editableRef.current!.childNodes).map((child) => {
      if (child.nodeName === "INPUT") {
        return { type: "input", value: (child as HTMLInputElement).value };
      }
      return { type: "text", value: child.nodeValue || "" };
    });
    onChange(newData);
  };
  const insertInputAtCursor = () => {
    const editableDiv = editableRef.current;
    if (editableDiv) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type here...";
      addInputEventListeners(input);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Remove any selected text
        range.insertNode(input); // Insert the input at the cursor position
        range.setStartAfter(input);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        input.focus(); // Focus the new input
      }
      setMenuPosition(null); // Close context menu after inserting
    }
  };
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setMenuPosition({ x: clientX - 10, y: 0 });
  };
  const handleMenuClick = (action: string) => {
    if (action === "insertInput") {
      insertInputAtCursor();
    }
    setMenuPosition(null); // Close menu after action
  };
  return (
    <div>
      <div
        ref={editableRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.stopPropagation();
          }
        }}
        onContextMenu={handleContextMenu}
        style={{
          padding: "10px",
          minHeight: "50px",
          margin: "10px 0",
        }}
      />
      {menuPosition && (
        <div
          style={{
            position: "absolute",
            left: menuPosition.x + 5, // Offset for better visibility
            top: menuPosition.y + 5, // Offset for better visibility
            background: "white",
            zIndex: 1000,
            padding: "5px",
          }}
        >
          <button onClick={() => handleMenuClick("insertInput")}>
            Insert Input
          </button>
        </div>
      )}
    </div>
  );
};
export default EditableContent;
