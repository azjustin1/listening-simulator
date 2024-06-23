import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[fitContentInput]',
  standalone: true,
})
export class FitContentDirective implements OnChanges {
  private originalWidth: number;
  @Input() content = '';

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {
    this.originalWidth = this.element.nativeElement.offsetWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditting']) {
      this.setInputWidth();
    }
  }

  @HostListener('input')
  onInput(): void {
    this.setInputWidth();
  }

  @HostListener('focus')
  onFocus(): void {
    this.setInputWidth();
  }

  private setInputWidth(): void {
    const inputElement = this.element.nativeElement;
    let width = `${Math.max(this.originalWidth, inputElement.scrollWidth + 1)}`;
    if (this.content) {
      width = `${this.content.length}ch`;
    }
    this.renderer.setStyle(inputElement, 'width', width);
  }
}
