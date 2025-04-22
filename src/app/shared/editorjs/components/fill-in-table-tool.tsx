import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { createRoot, Root } from "react-dom/client";
import FillInTableComponent from "./FillInTable";
import { BlockTool } from "@editorjs/editorjs";
import { isEmpty } from "lodash-es";

interface DynamicTableToolData {
  tableData: string[][];
}

class FillInTableTool implements BlockTool {
  private data: DynamicTableToolData;
  private container: HTMLElement;
  private reactRoot: Root;

  constructor({ data }: { data: DynamicTableToolData }) {
    this.data = !isEmpty(data)
      ? data
      : {
          tableData: [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ],
        };
    this.container = document.createElement("div");
    this.reactRoot = createRoot(this.container); // Use createRoo
  }

  render() {
    this.reactRoot.render(
      <FillInTableComponent
        initialData={this.data.tableData}
        onChange={this.handleChange}
      />,
    );
    return this.container;
  }

  handleChange = (newData: string[][]) => {
    this.data.tableData = newData;
  };

  save() {
    return this.data;
  }

  static get toolbox() {
    return {
      title: "Dynamic Table",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>`,
    };
  }

  static get isInline() {
    return false;
  }
}

export default FillInTableTool;
