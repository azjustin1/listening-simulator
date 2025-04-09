// radio-tool.ts
import { BlockTool } from '@editorjs/editorjs';

interface RadioItem {
  value: string;
  label: string;
  checked: boolean;
}

interface RadioData {
  items: RadioItem[];
}

export class CustomRadioTool implements BlockTool {
  static get toolbox() {
    return {
      title: 'Radio Buttons',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><circle cx="8" cy="7" r="6" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
    };
  }

  private data: RadioData;
  private api: any;
  private wrapper: HTMLElement | null;
  private blockId: string;

  constructor({ data, api }: { data: RadioData; api: any }) {
    this.data = {
      items:
        data.items && data.items.length > 0
          ? data.items
          : [
              {
                value: '',
                label: '',
                checked: false,
              },
            ],
    };
    console.log(this.data)
    this.api = api;
    this.wrapper = null;
    this.blockId = `radio-${Math.random().toString(36).substring(2, 9)}`;
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('radio-tool');
    this.renderOptions();
    return this.wrapper;
  }

  private renderOptions(): void {
    if (!this.wrapper) return;
    const optionsContainer = document.createElement('div');
    this.data.items.forEach((item: RadioItem, index: number) => {
      this.addOption(optionsContainer, item, index);
    });
    this.wrapper.appendChild(optionsContainer);
  }

  private addOption(
    optionsContainer: HTMLDivElement,
    item: RadioItem,
    index: number,
  ): void {
    const optionWrapper = document.createElement('div');
    optionWrapper.classList.add('radio-option');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = this.blockId;
    radio.checked = item.checked;
    radio.addEventListener('change', () => {
      this.data.items.forEach((i: RadioItem, idx: number) => {
        i.checked = idx === index;
      });
      console.log(this.data.items);
    });
    const input = document.createElement('input');
    input.type = 'text';
    input.value = item.label;
    input.placeholder = 'Enter option label';
    input.style.border = 'none';
    input.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.data.items[index].label = target.value;
      this.data.items[index].value = target.value
        .toLowerCase()
        .replace(/\s+/g, '-');
    });
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      if (e.key === 'Enter') {
        e.preventDefault();
        this.data.items.splice(index + 1, 0, {
          value: '',
          label: '',
          checked: false,
        });
        const newItem: RadioItem = {
          checked: false,
          value: '',
          label: '',
        };
        this.addOption(optionsContainer, newItem, index + 1);
        setTimeout(() => {
          const newInput = this.wrapper?.querySelectorAll('input[type="text"]')[
            index + 1
          ] as HTMLInputElement;
          if (newInput) newInput.focus();
        }, 0);
      }
      if (
        e.key === 'Backspace' &&
        target.value === '' &&
        this.data.items.length > 1
      ) {
        e.preventDefault();
        this.data.items.splice(index, 1);
        optionsContainer.removeChild(optionWrapper);
        // Focus the previous input if it exists
        setTimeout(() => {
          const prevInput = this.wrapper?.querySelectorAll(
            'input[type="text"]',
          )[index - 1] as HTMLInputElement;
          if (prevInput) prevInput.focus();
        }, 0);
      }
    });
    optionWrapper.appendChild(radio);
    optionWrapper.appendChild(input);
    optionsContainer.appendChild(optionWrapper);
  }

  save(_blockContent: HTMLElement): RadioData {
    return this.data;
  }

  static get sanitize() {
    return {
      items: {
        value: true,
        label: true,
        checked: true,
      },
    };
  }
}
