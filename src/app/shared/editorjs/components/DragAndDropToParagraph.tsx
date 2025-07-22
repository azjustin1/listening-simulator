import React, { useEffect, useRef, useState } from "react";
import { SelectOption } from "../custom-select-tool";
import { CommonUtils } from "../../../utils/common-utils";

interface EditableContentProps {
  data: { type: string; value: string | null }[];
  options: SelectOption[];
  onChange: (
    data: { type: string; value: string | null }[],
    options: SelectOption[],
  ) => void;
  readOnly?: boolean;
}

const DragAndDropToParagraphComponent: React.FC<EditableContentProps> = ({
  data,
  options,
  onChange,
  readOnly = false,
}) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [answers, setAnswers] = useState<SelectOption[]>([...options]);
  const [selectAnswers, setSelectAnswers] = useState<SelectOption[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() && !readOnly) {
      event.preventDefault();
      event.stopPropagation();
      const newOption: SelectOption = {
        id: `${CommonUtils.generateRandomId()}`, // Unique ID based on timestamp
        value: inputValue,
        checked: false,
      };
      setAnswers((prevOptions) => [...prevOptions, newOption]);
      setSelectAnswers((prevOptions) => [...prevOptions, newOption]);
      setInputValue("");
    }
  };
  useEffect(() => {
    // onChange({ data, options });
  }, [options, onChange]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Autofocus the input when the component mounts
    }
  }, []);
  const deleteOption = (id: string) => {
    if (!readOnly) {
      setAnswers((prevOptions) =>
        prevOptions.filter((option) => option.id !== id),
      );
    }
  };
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
    // onChange({ data:  });
  };
  const insertSelectAtCursor = () => {
    const editableDiv = editableRef.current;
    if (editableDiv) {
      const element: HTMLSelectElement = document.createElement("select");
      element.className = "select-box";
      element.onchange = (event: any) => handleSelectChange(event);
      // Create answers from props
      selectAnswers.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.id = option.id;
        optionElement.value = option.value;
        optionElement.textContent = option.value;
        element.appendChild(optionElement);
      });
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(element);
        range.setStartAfter(element);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setMenuPosition(null); // Close context menu after inserting
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newData = { type: "select", value: event.target.value };
    console.log(event.target.value);
    setSelectAnswers(
      answers.filter((answer) => answer.value !== event.target.value),
    );
    // onChange(newData);
  };
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setMenuPosition({ x: clientX - 10, y: 0 });
  };
  const handleMenuClick = (action: string) => {
    if (action === "insertInput") {
      if (answers.length === 0) {
        alert("There is no answer");
        setMenuPosition(null);
        return;
      }
      insertSelectAtCursor();
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
          marginBottom: "10px",
        }}
      />
      {menuPosition && (
        <div
          style={{
            position: "absolute",
            left: menuPosition.x + 5, // Offset for better visibility
            top: menuPosition.y + 5, // Offset for better visibility
            background: "white",
            border: "1px solid #ccc",
            zIndex: 1000,
            padding: "5px",
          }}
        >
          <button onClick={() => handleMenuClick("insertInput")}>
            Insert Answer
          </button>
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <input
          ref={inputRef} // Attach the ref to the input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type answer and press Enter"
          disabled={readOnly} // Disable input if readOnly
        />
        <div style={{ marginTop: "10px" }}>
          {answers.map((option) => (
            <div
              key={option.id}
              style={{
                padding: "5px",
                cursor: readOnly ? "not-allowed" : "pointer",
                backgroundColor: option.checked ? "#d1e7dd" : "#fff",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                  color: option.checked ? "green" : "transparent",
                }}
              >
                {option.checked ? "✅" : "🔲"} {/* Checked icon */}
              </span>
              <span>{option.value}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from toggling check
                  deleteOption(option.id);
                }}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: readOnly ? "not-allowed" : "pointer",
                  color: "red",
                }}
                disabled={readOnly} // Disable button if readOnly
              >
                ❌ {/* Delete icon */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DragAndDropToParagraphComponent;
