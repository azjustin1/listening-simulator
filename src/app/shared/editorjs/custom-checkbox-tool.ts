import { BlockTool } from '@editorjs/editorjs';

interface CheckboxItem {
  value: string;
  label: string;
  checked: boolean;
}

interface CheckboxData {
  items: CheckboxItem[];
}

export class CheckboxTool implements BlockTool {
  static get toolbox() {
    return {
      title: 'Checkbox',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><rect x="2" y="4" width="13" height="8" rx="2" fill="currentColor"/></svg>',
    };
  }

  private data: CheckboxData;
  private api: any;
  private wrapper: HTMLElement | null;
  private blockId: string;

  constructor({ data, api }: { data: CheckboxData; api: any }) {
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
    this.api = api;
    this.wrapper = null;
    this.blockId = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('checkbox-tool');
    this.renderOptions();
    return this.wrapper;
  }

  private renderOptions(): void {
    if (!this.wrapper) return;
    const optionsContainer = document.createElement('div');
    this.data.items.forEach((item: CheckboxItem, index: number) => {
      this.addOption(optionsContainer, item, index);
    });
    this.wrapper.appendChild(optionsContainer);
  }

  private addOption(
    optionsContainer: HTMLDivElement,
    item: CheckboxItem,
    index: number,
  ): void {
    const optionWrapper = document.createElement('div');
    optionWrapper.classList.add('radio-option');
    const radio = document.createElement('input');
    radio.type = 'checkbox';
    radio.name = this.blockId;
    radio.checked = item.checked;
    radio.addEventListener('change', () => {
      this.data.items.forEach((i: CheckboxItem, idx: number) => {
        i.checked = idx === index;
      });
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
        const newItem: CheckboxItem = {
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

  save(_blockContent: HTMLElement): CheckboxData {
    return {
      items: this.data.items.filter((item) => item.label !== ''), // Only save non-empty items
    };
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
