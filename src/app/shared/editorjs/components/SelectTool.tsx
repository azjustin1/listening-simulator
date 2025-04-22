import React, { useState, useEffect, useRef } from "react";
import { SelectOption } from "../custom-select-tool";
import { CommonUtils } from "../../../utils/common-utils";

interface SelectWithInputProps {
  onChange: (options: SelectOption[]) => void;
  data?: SelectOption[]; // Optional prop for initial options
  readOnly?: boolean; // New readOnly prop
}

const SelectWithInput: React.FC<SelectWithInputProps> = ({
  onChange,
  data = [],
  readOnly = false,
}) => {
  const [options, setOptions] = useState<SelectOption[]>([
    ...data, // Include initial options
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input
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
      setOptions((prevOptions) => [...prevOptions, newOption]);
      setInputValue("");
    }
  };
  useEffect(() => {
    onChange(options);
  }, [options, onChange]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Autofocus the input when the component mounts
    }
  }, []);
  const toggleCheck = (id: string) => {
    if (readOnly) return;
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id
          ? { ...option, checked: true }
          : { ...option, checked: false },
      ),
    );
  };
  const deleteOption = (id: string) => {
    if (!readOnly) {
      setOptions((prevOptions) =>
        prevOptions.filter((option) => option.id !== id),
      );
    }
  };
  return (
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
        <h2>Select an option</h2>
        {options.map((option) => (
          <div
            key={option.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px",
              cursor: readOnly ? "not-allowed" : "pointer",
              backgroundColor: option.checked ? "#d1e7dd" : "#fff",
            }}
            onClick={() => toggleCheck(option.id)}
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
  );
};
export default SelectWithInput;
