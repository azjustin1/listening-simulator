import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'listening-simulator';

  constructor() {
    window.addEventListener("keydown",function (e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
          e.preventDefault();
      }
  })
  }
}
