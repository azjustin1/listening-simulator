// InputTool.tsx
import React, { useEffect, useRef } from "react";

export interface InputToolData {
  value: string;
}

interface InputToolProps {
  data: InputToolData;
  onChange: (data: InputToolData) => void;
  onDelete: () => void;
  readOnly?: boolean;
}

const InputComponent: React.FC<InputToolProps> = ({
  data,
  readOnly,
  onChange,
  onDelete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = data.value ?? "";
    }
  }, [data]);
  const handleChange = () => {
    if (inputRef.current) {
      onChange({ value: inputRef.current.value });
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && inputRef.current?.value === "") {
      event.preventDefault();
      onDelete();
    }
  };
  return (
    <input
      disabled={readOnly}
      type="text"
      ref={inputRef}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something..."
    />
  );
};
export default InputComponent;
