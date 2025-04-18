import React, { useEffect, useRef } from "react";

interface EditableContentProps {
  data: any[];
  onChange: (newData: any[]) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({
  data,
  onChange,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
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
          // Set cursor to the previous element or end of the parent
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
        handleInput();
      }
    });
  };
  const handleInput = () => {
    console.log(editableRef.current!.childNodes);
    const newData = Array.from(editableRef.current!.childNodes).map((child) => {
      if (child.nodeName === "INPUT") {
        return { type: "input", value: (child as HTMLInputElement).value };
      }
      return { type: "paragraph", value: child.nodeValue || "" };
    });
    onChange(newData);
  };
  const insertInput = () => {
    const editableDiv = editableRef.current;
    if (editableDiv) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Type here...";
      addInputEventListeners(input); // Add event listeners for the new input
      editableDiv.appendChild(input);
      input.focus();
    }
  };
  return (
    <div>
      <div
        ref={editableRef}
        contentEditable
        onInput={handleInput}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "100px",
          marginBottom: "10px",
        }}
      />
      <button onClick={insertInput}>Insert Input</button>
    </div>
  );
};
export default EditableContent;
