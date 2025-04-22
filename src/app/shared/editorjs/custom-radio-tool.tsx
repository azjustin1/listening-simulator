import React from "react";
import CheckboxToolComponent from "./components/CheckBox";
import { BlockTool } from "@editorjs/editorjs";
import { createRoot } from "react-dom/client";
import RadioToolComponent from "./components/RadioTool";

export interface RadioOption {
  id: string;
  value: string;
  checked: boolean;
}

class RadioTool implements BlockTool {
  private data: RadioOption[];
  private onChange: (data: RadioOption[]) => void;
  private readOnly: boolean;
  private api: any;
  private blockAPI: any;
  private container: HTMLDivElement;
  private reactRoot: any;

  // Sanitization rule
  static get sanitize() {
    return {
      items: {
        type: "array",
        items: {
          id: {},
          label: {
            type: "string",
            multiline: true, // Allow line breaks in labels
          },
          checked: { type: "boolean" },
        },
      },
    };
  }

  constructor({
    data,
    config,
    api,
    readOnly,
    block,
  }: {
    data: RadioOption[];
    api: any;
    config: any;
    readOnly: boolean;
    block: any;
  }) {
    this.api = api;
    this.blockAPI = block; // Get Block API instance
    this.data = data;
    this.onChange = (newData: RadioOption[]) => {
      api.blocks.update(this.blockAPI.id, newData); // Save data
    };
    this.readOnly = readOnly;
    this.container = document.createElement("div");
    this.container.className = "editable-checkbox-list-container";
    this.reactRoot = createRoot(this.container); // Use createRoo
  }

  render() {
    this.reactRoot.render(
      <RadioToolComponent
        data={this.data}
        onChange={(data) => {
          this.data = data;
        }}
        readOnly={this.readOnly}
        onRemove={() => {
          // Remove this block from the editor
          this.api.blocks.delete();
        }}
      />,
    );
    return this.container;
  }

  save() {
    return this.data;
  }

  static get toolbox() {
    return {
      title: "One Choice",
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><rect x="2" y="4" width="13" height="8" rx="2" fill="currentColor"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get title() {
    return "Checkbox List";
  }

  static get icon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 17v-4c0-1.333-.8-4-3-4H2v8h4v-2H4v-2h2c.857 0 1.54-.571 1.8 1.4L9 17z"/><path d="M15.6 8.4 20.7 3.3c.8-1 2.3-.9 3.1 0s.9 2.3 0 3.1l-6.6 6.6c-.5.5-1.2.8-2.1.8-.8 0-1.5-.3-2.1-.8l-.7-.7c-.5-.5-.8-1.2-.8-2 0-.8.3-1.5.8-2.1zM22.1 5l-1.6-1.6c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3l-1.3 1.3 3.7 3.7 1.3-1.3c.2-.2.3-.5.3-.8s-.1-.6-.3-.8z"/></svg>';
  }

  static get category() {
    return "list";
  }

  static get isInline() {
    return false;
  }

  static get inlineToolbar() {
    return false;
  }

  static get className() {
    return "cdx-block";
  }

  validate(savedData: RadioOption[]) {
    if (!savedData || savedData.length === 0) {
      return false;
    }
    return savedData.some((option) => option.value.trim() !== "");
  }

  destroy() {
    this.reactRoot.unmount();
  }
}

export default RadioTool;
