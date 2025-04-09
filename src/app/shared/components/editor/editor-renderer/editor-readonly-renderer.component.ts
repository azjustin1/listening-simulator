// src/app/editor-renderer/editor-renderer.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { CustomTextBlockPipe } from './custom-text.pipe';
import { ListBlockPipe } from './list-block.pipe';

@Component({
  selector: 'app-editor-readonly-renderer',
  templateUrl: './editor-readonly-renderer.component.html',
  styleUrl: 'editor-readonly-renderer.component.scss',
  standalone: true,
  imports: [NgClass, CustomTextBlockPipe, ListBlockPipe],
})
export class EditorReadonlyRendererComponent implements OnInit {
  @Input() blocks: any[] = [];
  @Input() isReadOnly: boolean = true;

  ngOnInit() {
  }
}
