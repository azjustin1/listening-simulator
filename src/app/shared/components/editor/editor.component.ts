import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import CustomInputTool from '../../editorjs/custom-input-tool';
import ImageTool from '@editorjs/image';
import EditorJS, { OutputBlockData } from '@editorjs/editorjs';
import RadioTool from '../../editorjs/custom-radio-tool';
import CheckBoxTool from '../../editorjs/custom-checkbox-tool';
import EditableContentTool from '../../editorjs/editable-content-tool';
import SelectTool from '../../editorjs/custom-select-tool';
import FillInTableTool from '../../editorjs/components/fill-in-table-tool';

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styles: [
    `
      #editorjs {
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .cdx-table {
        width: 100%;
        border-collapse: collapse;
      }

      .cdx-table td {
        border: 1px solid #ddd;
        padding: 8px;
      }

      .cdx-input {
        width: 100px;
        padding: 4px;
        margin: 0 4px;
        border: none;
        outline: none;
      }

      .table-controls {
        margin-top: 10px;
      }

      .table-controls button {
        margin-right: 10px;
      }

      .cell-editor {
        min-height: 30px;
      }

      .custom-text {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
      }

      .text-content {
        padding: 8px;
        min-height: 30px;
        display: inline-block;
        white-space: pre-wrap;
      }

      button {
        padding: 2px 6px;
        font-size: 12px;
        vertical-align: middle;
      }
    `,
  ],
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() holder: string = 'editorjs';
  @Input() blocks: OutputBlockData[] = [];
  @Input() isReadOnly: boolean = false;
  @Output() onEditorChange: EventEmitter<string> = new EventEmitter();
  private editor!: EditorJS;

  ngOnInit() {
    this.editor = new EditorJS({
      holder: this.holder,
      tools: {
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:3000/file/upload', // Your backend file uploader endpoint
              byUrl: 'http://localhost:3000/uploads/images', // Your endpoint that provides uploading by Url
            },
          },
        },
        selectOne: RadioTool,
        selectMultiple: CheckBoxTool,
        dropdown: SelectTool,
        shortAnswer: EditableContentTool,
        fillInTable: FillInTableTool,
      },
      data: {
        blocks: this.blocks,
      },
      readOnly: this.isReadOnly,
      onChange: async () => {
        const data = await this.editor.save();
        if (data && data.blocks) {
          console.log(data.blocks);
          this.onEditorChange.emit(JSON.stringify(data.blocks));
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  async preview() {
    this.isReadOnly = !this.isReadOnly;
    await this.editor.readOnly.toggle(this.isReadOnly);
  }
}
