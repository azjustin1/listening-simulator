// EditableContentTool.tsx
import React from "react";
import {
  API,
  BlockTool,
  BlockToolConstructorOptions,
} from "@editorjs/editorjs";
import { createRoot, Root } from "react-dom/client";
import EditableContent from "./components/EditableContent";
import { isEmpty } from "lodash-es";

class EditableContentTool implements BlockTool {
  private data: any[];
  private api: API;
  private container: HTMLElement;
  private reactRoot: Root;

  constructor({ api, data, config }: BlockToolConstructorOptions<any>) {
    console.log(data)
    this.data = isEmpty(data) ? [] : data;
    this.api = api;
    this.container = document.createElement("div");
    this.reactRoot = createRoot(this.container);
  }

  render() {
    createRoot(this.container).render(
      <EditableContent data={this.data} onChange={this.saveData} />,
    );
    return this.container;
  }

  saveData = (newData: any[]) => {
    this.data = newData.filter((item) => !isEmpty(item.value));
  };

  save(): any {
    console.log("saveData", this.data);
    return this.data;
  }

  validate(): boolean {
    return true;
  }

  static get toolbox() {
    return {
      title: "Short Answer",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <line x1="2" y1="4" x2="22" y2="4" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      `,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default EditableContentTool;
