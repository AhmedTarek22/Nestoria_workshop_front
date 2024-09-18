import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  openNav() {
    document.getElementById('mySidebar')!.style.width = '250px';
    document
      .querySelector('.main-content')!
      .setAttribute('style', 'margin-left: 250px;');
  }

  closeNav() {
    document.getElementById('mySidebar')!.style.width = '0';
    document
      .querySelector('.main-content')!
      .setAttribute('style', 'margin-left: 0;');
  }
  logout() {
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:3000/login';
  }
}
