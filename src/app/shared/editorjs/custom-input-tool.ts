// src/app/editor-tools/custom-input-tool.ts
import { BlockToolConstructorOptions } from '@editorjs/editorjs';
import { CommonUtils } from '../../utils/common-utils';

export class CustomInputTool {
  private _data: any;
  private wrapper: HTMLElement | null;
  private config: any;
  private readOnly: boolean;

  static get toolbox() {
    return {
      title: 'Input',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M0 0h17v2H0V0zm0 5h17v2H0V5zm0 5h17v2H0v-2z"/></svg>',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, readOnly }: BlockToolConstructorOptions<any>) {
    this._data = data && typeof data === 'object' ? data : { text: '' };
    this.config = config || {};
    this.readOnly = readOnly || false;
    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.display = 'inline-block';
    this.wrapper.style.verticalAlign = 'middle';
    const input = document.createElement('input');
    input.classList.add('cdx-input');
    input.placeholder = this.config.placeholder || 'Enter text...';
    input.value = typeof this._data.text === 'string' ? this._data.text : '';
    input.style.width = '100px';
    if (this.readOnly) {
      input.disabled = true;
    } else {
      input.addEventListener('change', (event) => {
        this._data = {
          id: CommonUtils.generateRandomId(),
          text: (event.target as HTMLInputElement).value,
        };
      });
    }
    this.wrapper.appendChild(input);
    return this.wrapper;
  }

  save(blockContent: HTMLElement) {
    const input = blockContent.querySelector('input');
    return {
      text: input!.value,
    };
  }

  validate(savedData: any) {
    return typeof savedData.text === 'string';
  }
}
