import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import { ProductsService } from '../services/products.service'; 
import { Product } from '../services/products.service'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  faEdit = faEdit;
  selectedProduct: Product | null = null;
  availableColors: string[] = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange'];
  availableCategory: string[] = [ "Sofa",
    "Outdoor Sofa",
    "Dining Table",
    "Coffee Table",
    "Bookshelf",
    "Bed Frame",
    "Desk",
    "Wardrobe",
    "Couch",
    "Bed",
    "Recliners",
    "Home Decoration",
    "Office Decoration",
    "Indoor Decoration",
    "Outdoor Decoration",];
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';
  selectedFiles: File[] = [];
  isEditMode: boolean = false; // تحديد هل يتم التعديل أم الإضافة

  constructor(private modalService: NgbModal, private productsService: ProductsService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProducts().subscribe(
      (data) => {
        this.products = data.workshopProducts;
      },
      (error) => this.showAlert('Failed to load products.', 'danger')
    );
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 2) {
      this.showAlert('You can upload a maximum of 2 images.', 'warning');
    } else {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  openModal(content: any, product: Product | null = null) {
    if (product) {
      this.isEditMode = true;
      this.selectedProduct = { ...product }; // تعديل المنتج الحالي
    } else {
      this.isEditMode = false;
      this.selectedProduct = { 
        _id: '', 
        name: '', 
        description: '', 
        price: 0, 
        images: [], 
        color: '', 
        quantity: 1, 
        category: '' 
      };
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveProduct() {
    if (this.selectedProduct) {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('description', this.selectedProduct.description);
      formData.append('price', String(this.selectedProduct.price));
      formData.append('color', this.selectedProduct.color);
      formData.append('category', this.selectedProduct.category);
      formData.append('quantity', String(this.selectedProduct.quantity));

      // إضافة الصور إلى FormData
      this.selectedFiles.forEach((file, index) => {
        formData.append('images', file, file.name);
      });

      // تحقق من محتويات FormData باستخدام forEach
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      if (this.isEditMode) {
        // تحديث المنتج
        this.productsService.updateProduct(this.selectedProduct._id, formData).subscribe(
          () => {
            this.getProducts();
            this.showAlert('Product updated successfully!', 'success');
            this.modalService.dismissAll();
          },
          () => this.showAlert('Failed to update product.', 'danger')
        );
      } else {
        // إضافة منتج جديد
      this.productsService.addProduct(formData).subscribe(
        () => {
          this.getProducts();
          this.showAlert('Product added successfully!', 'success');
          this.modalService.dismissAll();
        },
        () => {
          this.showAlert('Failed to add product.', 'danger');
          this.modalService.dismissAll();
        }
      );
      }
    }
  }
 
  
  deleteProduct(_id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(_id).subscribe(
        () => {
          this.getProducts();
          this.showAlert('Product deleted successfully!', 'danger');
        },
        () => this.showAlert('Failed to delete product.', 'danger')
      );
    }
  }

  showAlert(message: string, type: 'success' | 'danger' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.closeAlert(), 3000);
  }

  closeAlert() {
    this.alertMessage = null;
  }
}
