import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: '[textSelection]',
  standalone: true,
})
export class TextSelectionDirective {
  @Input() appTextSelection: string = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseup') onMouseUp() {
    const selectedText = this.getSelectedText();
    if (selectedText) {
      if (this.isTextAlreadyHighlighted(selectedText)) {
        console.log('Highlighted')
        // this.removeHighlight(selectedText);
      } else {
        this.highlightSelection(this.appTextSelection);
      }
    }
  }

  private getSelectedText(): string {
    const selection = window.getSelection();
    return selection!.toString();
  }

  private isTextAlreadyHighlighted(selectedText: string): boolean {
    const spans = this.el.nativeElement.querySelectorAll('span.highlighted');
    for (let span of spans) {
      if (span.textContent.includes(selectedText)) {
        return true; // Text is already highlighted
      }
    }
    return false;
  }

  private highlightSelection(color: string) {
    const selection = window.getSelection();
    if (selection !== null && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      span.className = 'highlighted';
      const div = document.createElement('span')
      div.textContent = 'This is note';
      div.style.backgroundColor = 'red'
      div.style.height = '2rem'
      div.style.border = '1px dashed grey'
      const xspan = document.createElement('span')
      xspan.textContent = 'X';
      div.appendChild(xspan)
      range.insertNode(div)
      range.surroundContents(span);
      selection.removeAllRanges(); // Clear selection
    }
  }
}
