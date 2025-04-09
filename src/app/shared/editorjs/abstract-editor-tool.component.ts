import {
  BlockTool,
  BlockToolConstructorOptions,
  BlockToolData,
  ToolboxConfig,
} from '@editorjs/editorjs';

export abstract class AbstractEditorToolComponent implements BlockTool {
  protected data: any;
  protected wrapper!: HTMLElement | null;
  protected api: any;
  protected config: any;
  protected inputInstances: Map<string, any> = new Map();

  protected constructor({ api, config }: BlockToolConstructorOptions) {
    this.api = api;
    this.config = config || {};
    this.wrapper = null;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox(): ToolboxConfig {
    return {};
  }

  abstract render(): Promise<HTMLElement> | HTMLElement;

  abstract save(block: HTMLElement): BlockToolData;

  abstract validate(saveData: BlockToolData): boolean;
}
