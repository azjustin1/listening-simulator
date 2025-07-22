import React from "react";
import { createRoot } from "react-dom/client";
import DragAndDropToParagraphComponent from "./components/DragAndDropToParagraph";
import { isEmpty } from "lodash-es";
import {
  API,
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
} from "@editorjs/editorjs";

export interface DragAndDropToolData {
  options: any[];
}

class DragAndDropContentTool implements BlockTool {
  private container: HTMLElement;
  private data: { type: string; value: string | null }[];
  private api: API;
  private config: any;
  private readOnly: boolean;
  private block: BlockAPI;
  private options: any[] = [];

  constructor({
    data,
    config,
    api,
    readOnly,
    block,
  }: BlockToolConstructorOptions<any>) {
    this.data = !isEmpty(data) ? data : [{ type: "select", value: null }];
    this.config = config;
    this.readOnly = readOnly;
    this.api = api;
    this.block = block;
    this.container = document.createElement("div");
  }

  render() {
    this.container = document.createElement("div");
    createRoot(this.container).render(
      <DragAndDropToParagraphComponent
        data={this.data}
        options={this.options}
        onChange={this.saveData}
      />,
    );
    return this.container;
  }

  saveData = (newData: any[]) => {
    this.data = newData.filter((item) => !isEmpty(item.value));
  };

  save() {
    return {
      data: this.data,
    };
  }

  static get toolbox() {
    return {
      title: "Drag And Drop To Paragraph",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h16M4 12h16m-7 5h7" />
        <line x1="8" y1="9" x2="8" y2="12" />
        <line x1="8" y1="14" x2="8" y2="17" />
        <line x1="12" y1="9" x2="12" y2="12" />
        <line x1="12" y1="14" x2="12" y2="17" />
        <line x1="16" y1="9" x2="16" y2="12" />
        <line x1="16" y1="14" x2="16" y2="17" />
      </svg>
    `,
    };
  }
}

export default DragAndDropContentTool;
