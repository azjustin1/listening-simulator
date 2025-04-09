// src/app/editor-tools/custom-table-tool.ts
import EditorJS from '@editorjs/editorjs';
import { CustomInputTool } from './custom-input-tool'; // Import EditorJS directly
export class CustomTableTool {
  private data: any;
  private wrapper: HTMLElement | null;
  private api: any;
  private config: any;
  private editors: Map<string, any> = new Map(); // Store EditorJS instances for each cell
  static get toolbox() {
    return {
      title: 'Table',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15"><path d="M0 0h17v3H0V0zm0 4h17v3H0V4zm0 4h17v3H0V8zm0 4h17v3H0v-3z"/></svg>',
    };
  }

  constructor({ data, api, config }) {
    this.data = {
      content: data && data.content ? data.content : [['']], // Default to 1x1 table if content is missing
    };
    this.api = api;
    this.config = config || {};
    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('custom-table');
    const table = document.createElement('table');
    table.classList.add('cdx-table');
    const tbody = document.createElement('tbody');
    this.data.content.forEach((row: any[], rowIndex: number) => {
      const tr = document.createElement('tr');
      row.forEach((cell: any, colIndex: number) => {
        const td = document.createElement('td');
        const cellId = `${rowIndex}-${colIndex}`;
        td.dataset['cellId'] = cellId;
        // Create a div for nested EditorJS instance
        const cellContent = document.createElement('div');
        cellContent.classList.add('cell-editor');
        cellContent.id = `cell-editor-${cellId}`; // Unique ID for each cell
        td.appendChild(cellContent);
        // Initialize nested EditorJS for this cell
        this.initializeCellEditor(cellContent, cellId, cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    this.wrapper.appendChild(table);
    // Add controls to add rows/columns
    this.addControls();
    return this.wrapper;
  }

  initializeCellEditor(
    container: HTMLElement,
    cellId: string,
    initialData: any,
  ) {
    const editor = new EditorJS({
      // Use EditorJS directly
      holder: container,
      tools: {
        input: CustomInputTool, // Pass the CustomInputTool from config
      },
      data:
        initialData && initialData.blocks
          ? initialData
          : {
              blocks: initialData ? [{ type: 'input', data: initialData }] : [],
            },
      onChange: async () => {
        const content = await editor.save();
        const rowIndex = parseInt(cellId.split('-')[0]);
        const colIndex = parseInt(cellId.split('-')[1]);
        this.data.content[rowIndex][colIndex] = content;
      },
    });
    this.editors.set(cellId, editor);
  }

  addControls() {
    const controls = document.createElement('div');
    controls.classList.add('table-controls');
    const addRowBtn = document.createElement('button');
    addRowBtn.textContent = 'Add Row';
    addRowBtn.addEventListener('click', () => this.addRow());
    const addColBtn = document.createElement('button');
    addColBtn.textContent = 'Add Column';
    addColBtn.addEventListener('click', () => this.addColumn());
    controls.appendChild(addRowBtn);
    controls.appendChild(addColBtn);
    this.wrapper!.appendChild(controls);
  }

  addRow() {
    const newRow = Array(this.data.content[0].length).fill({ blocks: [] });
    this.data.content.push(newRow);
    this.renderTable();
  }

  addColumn() {
    this.data.content.forEach((row: any[]) => row.push({ blocks: [] }));
    this.renderTable();
  }

  renderTable() {
    this.editors.forEach((editor) => editor.destroy());
    this.editors.clear();
    this.wrapper!.innerHTML = '';
    this.render();
  }

  save() {
    return {
      content: this.data.content,
    };
  }

  validate(savedData: any) {
    return (
      Array.isArray(savedData.content) &&
      savedData.content.every((row) => Array.isArray(row))
    );
  }
}
