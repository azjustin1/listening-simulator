import { API, BlockTool } from "@editorjs/editorjs";
import React from "react";
import { createRoot } from "react-dom/client";
import InputComponent, { InputToolData } from "./components/InputTool";

class CustomInputTool implements BlockTool {
  private readonly api: API;
  private data: InputToolData;
  private container: HTMLElement;
  private readOnly: boolean;
  private reactRoot: any;

  static get toolbox() {
    return {
      title: "Input",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
        <line x1="2" y1="4" x2="22" y2="4" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    `,
    };
  }

  constructor({
    data,
    api,
    readOnly,
  }: {
    data: InputToolData;
    api: API;
    readOnly?: boolean;
  }) {
    this.api = api;
    this.data = data ? data : { value: "" };
    this.readOnly = readOnly || false;
    this.container = document.createElement("div");
    this.reactRoot = createRoot(this.container); // Use createRoo
  }

  render() {
    this.reactRoot.render(
      <InputComponent
        data={this.data}
        readOnly={this.readOnly}
        onChange={(data) => {
          this.data = data;
        }}
        onDelete={() => {
          console.log("delete");
          this.api.blocks.delete(this.api.blocks.getCurrentBlockIndex());
        }}
      />,
    );
    return this.container;
  }

  private renderComponent() {}

  save() {
    this.readOnly = true;
    return this.data;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      segments: {
        id: true,
        type: true,
        content: true,
      },
    };
  }
}

export default CustomInputTool;
