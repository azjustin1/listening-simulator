import React from "react";
import { BlockTool } from "@editorjs/editorjs";
import { createRoot } from "react-dom/client";
import { isEmpty } from "lodash-es";
import ListAnswerComponent from "./components/CreateListAnswer";

export interface SelectOption {
  id: string;
  value: string;
  checked: boolean;
}

interface SelectToolData {
  options: SelectOption[];
}

class ListAnswerTool implements BlockTool {
  private data: SelectOption[];
  private container: HTMLElement;
  private reactRoot: any;
  private readOnly: boolean;

  constructor({ data, readOnly }: { data: SelectOption[]; readOnly: boolean }) {
    this.data = isEmpty(data) ? [] : data;
    this.readOnly = readOnly;
    this.container = document.createElement("div");
    this.reactRoot = createRoot(this.container);
  }

  render() {
    const selectWithInputElement = document.createElement("div");
    this.container.appendChild(selectWithInputElement);
    const handleChange = (
      options: { id: string; value: string; checked: boolean }[],
    ) => {
      this.data = options;
    };
    this.reactRoot.render(
      <ListAnswerComponent
        data={this.data}
        onChange={handleChange}
        readOnly={this.readOnly}
      />,
    );
    return this.container;
  }

  save() {
    return this.data;
  }

  // Optional: Cleanup when the component is removed
  static get toolbox() {
    return {
      title: "Answers List",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/><path d="M4 7l1 1 7 7 7-7 1-1"/></svg>', // Provide an SVG icon if needed
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default ListAnswerTool;
