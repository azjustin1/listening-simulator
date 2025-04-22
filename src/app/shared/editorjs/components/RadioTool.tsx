import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckboxOption } from "../custom-checkbox-tool";
import { CommonUtils } from "../../../utils/common-utils";
import { RadioOption } from "../custom-radio-tool";

interface RadioToolComponentProps {
  data: RadioOption[];
  onChange: (data: RadioOption[]) => void;
  readOnly?: boolean;
  onRemove?: () => void;
}

const RadioToolComponent: FC<RadioToolComponentProps> = ({
  data,
  onChange,
  readOnly = false,
  onRemove,
}) => {
  // Initialize with at least one empty option if none exist
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [options, setOptions] = useState<CheckboxOption[]>(() => {
    if (data && data.length > 0) {
      return data;
    } else {
      return [
        {
          id: `${CommonUtils.generateRandomId()}`,
          value: "",
          checked: false,
        },
      ];
    }
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    // Update parent component when options change
    onChange(options);
  }, [options, onChange]);
  // Auto-focus the last input when component mounts or options change
  useEffect(() => {
    if (!readOnly && options.length > 0) {
      const lastIndex = options.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }
  }, [options.length, readOnly]);
  const handleCheckChange = (id: string) => {
    if (readOnly) return;
    if (selectedValue === id) {
      setSelectedValue(null);
      setOptions(options.map((option) => ({ ...option, checked: false })));
    } else {
      setSelectedValue(id);
      setOptions(
        options.map((option) =>
          option.id === id ? { ...option, checked: !option.checked } : option,
        ),
      );
    }
  };
  const handleTextChange = (id: string, text: string) => {
    if (readOnly) return;
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, value: text } : option,
      ),
    );
  };
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    // On Enter: create new option and focus it
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const newOption = {
        id: CommonUtils.generateRandomId(),
        value: "",
        checked: false,
      };
      setOptions([...options, newOption]);
    }

    // On Backspace: if empty, remove current option and focus previous or remove block
    else if (e.key === "Backspace" && options[index].value === "") {
      e.preventDefault();
      e.stopPropagation();
      if (options.length > 1) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
      } else if (onRemove) {
        // If this is the last option and it's empty, remove the entire block
        onRemove();
      }
    }
  };
  return (
    <div className="checkbox-options-component">
      {options.map((option, index) => (
        <div
          key={option.id}
          className="option-row"
          style={{ margin: "10px 0" }}
        >
          <input
            type="radio"
            value={selectedValue as any}
            checked={option.id === selectedValue}
            onClick={() => handleCheckChange(option.id)}
            className="option-checkbox"
            disabled={readOnly}
          />
          <input
            ref={(el: any) => (inputRefs.current[index] = el)}
            type="text"
            value={option.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleTextChange(option.id, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder={readOnly ? "" : "Option text"}
            className="option-input"
            style={{
              marginLeft: "10px",
            }}
            readOnly={readOnly}
          />
        </div>
      ))}
    </div>
  );
};
export default RadioToolComponent;
