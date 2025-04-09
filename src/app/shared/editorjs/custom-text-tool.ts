import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

export class CustomTextTool implements BlockTool {
  private data: any;
  private wrapper: HTMLElement | null;
  private api: any;
  private config: any;
  private inputInstances: Map<string, any> = new Map();

  static get toolbox() {
    return {
      title: 'Text',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M0 0h17v2H0V0zm0 5h17v2H0V5zm0 5h17v2H0v-2z"/></svg>',
    };
  }

  constructor({ data, api, config }: BlockToolConstructorOptions<any>) {
    this.data = {
      content:
        data && Array.isArray(data.content)
          ? data.content
          : [{ type: 'text', value: '' }],
    };
    this.api = api;
    this.config = config || {};
    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('custom-text');
    const contentArea = document.createElement('div');
    contentArea.classList.add('text-content');
    contentArea.contentEditable = 'true';
    contentArea.style.display = 'inline-block';
    this.wrapper.appendChild(contentArea);
    this.renderContent(contentArea);
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Input';
    addButton.style.marginLeft = '10px';
    addButton.style.verticalAlign = 'middle';
    addButton.addEventListener('click', () =>
      this.insertInputTool(contentArea),
    );
    this.wrapper.appendChild(addButton);
    contentArea.addEventListener('input', () => {
      this.updateDataFromContent(contentArea);
    });
    // Add keydown listener for Backspace
    contentArea.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace') {
        this.handleBackspace(contentArea, event);
      }
    });
    setTimeout(() => contentArea.focus(), 0);
    return this.wrapper;
  }

  renderContent(container: HTMLElement) {
    container.innerHTML = '';
    this.inputInstances.clear();
    if (!Array.isArray(this.data.content)) {
      console.error('this.data.content is not an array:', this.data.content);
      this.data.content = [{ type: 'text', value: '' }];
    }
    this.data.content.forEach((item: any, index: number) => {
      if (item.type === 'text') {
        const textNode = document.createTextNode(item.value);
        container.appendChild(textNode);
      } else if (item.type === 'input') {
        const inputWrapper = document.createElement('span');
        inputWrapper.contentEditable = 'false';
        inputWrapper.dataset['id'] = `input-${index}`;
        const inputTool = new this.config.tools.input.class({
          data: item.data,
          config: this.config.tools.input.config,
          readOnly: this.api.readOnly.isEnabled,
        });
        const inputElement = inputTool.render();
        inputElement.style.display = 'inline-block';
        inputElement.style.verticalAlign = 'middle';
        inputWrapper.appendChild(inputElement);
        this.inputInstances.set(`input-${index}`, inputTool);
        container.appendChild(inputWrapper);
      }
    });
    if (
      !this.data.content.length ||
      (this.data.content.length === 1 && !this.data.content[0].value)
    ) {
      container.innerHTML = 'Type here...';
    }
  }

  insertInputTool(container: HTMLElement) {
    const newInput = { type: 'input', data: { text: '' } };
    const cursorPosition = this.getCursorPosition(container);
    if (cursorPosition >= 0 && cursorPosition < this.data.content.length) {
      this.data.content.splice(cursorPosition, 0, newInput);
    } else {
      this.data.content.push(newInput);
    }
    this.renderContent(container);
    this.focusAfterInput(container, newInput);
  }

  updateDataFromContent(container: HTMLElement) {
    const newContent: any[] = [];
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent!.trim() || node.textContent === '') {
          newContent.push({ type: 'text', value: node.textContent });
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).dataset['id']
      ) {
        const id = (node as HTMLElement).dataset['id'];
        const inputTool = this.inputInstances.get(id!);
        if (inputTool) {
          const input = (node as HTMLElement).querySelector('input')!;
          newContent.push({ type: 'input', data: { text: input.value } });
        }
      }
    });
    this.data.content = newContent.filter(
      (item) => item.value || item.type === 'input',
    );
  }

  handleBackspace(container: HTMLElement, event: KeyboardEvent) {
    const selection = window.getSelection()!;
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // Cursor is at a single point
      const cursorPosition = this.getCursorPosition(container);
      const nodeBeforeCursor = this.getNodeBeforeCursor(container, range);
      if (
        nodeBeforeCursor &&
        nodeBeforeCursor.nodeType === Node.ELEMENT_NODE &&
        (nodeBeforeCursor as HTMLElement).dataset['id']
      ) {
        // Cursor is right after an InputTool
        if (cursorPosition < this.data.content.length) {
          const nextItem = this.data.content[cursorPosition];
          if (nextItem.type === 'text' && nextItem.value) {
            // Remove one character from the text after the InputTool
            nextItem.value = nextItem.value.slice(0, -1);
            if (!nextItem.value) {
              this.data.content.splice(cursorPosition, 1); // Remove empty text node
            }
            event.preventDefault();
            this.renderContent(container);
            this.setCursorAfterInput(container, cursorPosition - 1);
          }
        }
      }
    }
  }

  save() {
    const contentArea: HTMLElement | null =
      this.wrapper!.querySelector('.text-content');
    this.updateDataFromContent(contentArea!);
    return {
      content: this.data.content,
    };
  }

  validate(savedData: any) {
    if (!savedData || typeof savedData !== 'object') {
      console.warn('Invalid saved data:', savedData);
      return false;
    }
    if (!Array.isArray(savedData.content)) {
      console.warn('savedData.content is not an array:', savedData);
      return false;
    }
    return true;
  }

  getCursorPosition(container: HTMLElement): number {
    const selection = window.getSelection()!;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(container);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      let charCount = preCaretRange.toString().length;
      let position = 0;
      for (let i = 0; i < this.data.content.length; i++) {
        const item = this.data.content[i];
        const itemLength = item.type === 'text' ? item.value.length : 1;
        if (charCount <= 0) break;
        charCount -= itemLength;
        position++;
      }
      return position;
    }
    return this.data.content.length;
  }

  getNodeBeforeCursor(container: HTMLElement, range: Range): Node | null {
    const preCaretRange = range.cloneRange();
    preCaretRange.setStart(container, 0);
    const nodes = Array.from(container.childNodes);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      preCaretRange.setEndBefore(node);
      if (preCaretRange.toString().length < range.toString().length) {
        return node;
      }
    }
    return null;
  }

  focusAfterInput(container: HTMLElement, newInput: any) {
    const index = this.data.content.indexOf(newInput);
    const range = document.createRange();
    const selection = window.getSelection()!;
    Array.from(container.childNodes).forEach((node, i) => {
      if (i === index + 1) {
        if (node.nodeType === Node.TEXT_NODE) {
          range.setStart(node, 0);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          range.setStartAfter(node);
        }
      }
    });
    if (!range.startContainer) {
      range.selectNodeContents(container);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    container.focus();
  }

  setCursorAfterInput(container: HTMLElement, inputIndex: number) {
    const range = document.createRange();
    const selection = window.getSelection()!;
    const nodes = Array.from(container.childNodes);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).dataset['id'] === `input-${inputIndex}`
      ) {
        if (i + 1 < nodes.length) {
          const nextNode = nodes[i + 1];
          if (nextNode.nodeType === Node.TEXT_NODE) {
            range.setStart(nextNode, 0);
          } else {
            range.setStartAfter(node);
          }
        } else {
          range.setStartAfter(node);
        }
        break;
      }
    }
    selection.removeAllRanges();
    selection.addRange(range);
    container.focus();
  }
}
