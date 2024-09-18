import { Component, HostListener } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WorkshopProfileComponent } from './work-shop-profile/work-shop-profile.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FontAwesomeModule,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    WorkshopProfileComponent,
    PagenotfoundComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isSidebarVisible = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth < 768) {
      this.isSidebarVisible = false;
    } else {
      this.isSidebarVisible = true;
    }
  }
}
