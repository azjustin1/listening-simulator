import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

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
    window.addEventListener('keydown', function (e) {
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
      }
      if ((e.ctrlKey && e.key === 's')) {
        e.preventDefault();
      }
    });
  }
}
