// EditableContentTool.tsx
import React from "react";
import {
  API,
  BlockTool,
  BlockToolConstructorOptions,
  EditorConfig,
} from "@editorjs/editorjs";
import { createRoot } from "react-dom/client";
import EditableContent from "./components/EditableContent";

class EditableContentTool implements BlockTool {
  private data: any[];
  private api: API;
  private container: HTMLElement;
  private reactRoot: any;

  constructor({ api, data, config }: BlockToolConstructorOptions<any>) {
    this.data = config.data ? config.data.data : [];
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
    this.data = newData.filter((data) => data !== undefined);
  };

  save(): any {
    return this.data;
  }

  renderSettings() {
    const settingsContainer = document.createElement("div");
    const addInputButton = document.createElement("button");
    addInputButton.innerText = "Add Input Tool";
    addInputButton.onclick = () => {
      this.api.blocks.insert("inputTool", {
        type: "text",
        id: Date.now().toString(),
        content: "",
      });
    };
    settingsContainer.appendChild(addInputButton);
    return settingsContainer;
  }

  static get toolbox() {
    return {
      title: "Editable Content",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <line x1="2" y1="4" x2="22" y2="4" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      `,
    };
  }
}

export default EditableContentTool;
