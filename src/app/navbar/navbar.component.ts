import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Product, ProductsService } from '../services/products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  userDate!: any;
  productsNoQuantity: Product[] = [];
  numberOfNotification: number = 0;
  showNotifications = false;

  constructor(
    private _ProfileService: ProfileService,
    private productsService: ProductsService
  ) {}
  getProductsNoQuantity() {
    this.productsService.getWorkshopProductsNoQuantity().subscribe(
      (data) => {
        if (data) {
          this.productsNoQuantity = data.workshopProducts;
          console.log(data.workshopProducts);
          this.numberOfNotification = data.workshopProducts.length;
          console.log(this.numberOfNotification);
        }
      }
      // (error) => this.showAlert('Failed to load products.', 'danger')
    );
  }
  ngOnInit(): void {
    this._ProfileService.getProfileData().subscribe((res: any) => {
      this.userDate = res;
    });
    this.getProductsNoQuantity();
  }
  toggleNotifications() {
    this.numberOfNotification = 0;
    this.showNotifications = !this.showNotifications;
  }

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
