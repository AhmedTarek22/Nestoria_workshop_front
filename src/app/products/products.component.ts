import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule , NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ProductsService } from '../services/products.service';
import { Product } from '../services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,FormsModule],
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
  colorInputs: string[] = [];

  availableCategory: string[] = [ "Sofa", "Outdoor Sofa", "Dining Table", "Coffee Table", "Bookshelf", "Bed Frame", "Desk", "Wardrobe", "Couch", "Bed", "Recliners", "Home Decoration", "Office Decoration", "Indoor Decoration", "Outdoor Decoration"];
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';
  selectedFiles: File[] = [];
  filePreview: { [key: string]: string } = {};
  isEditMode: boolean = false;
  Object = Object;
  submitted: boolean = false; // Flag for form submission

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
      this.filePreview = {};


      for (const file of this.selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview[file.name] = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }



  isNumber(event: KeyboardEvent): void {
    const pattern = /^[0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  saveProduct(form: NgForm) {
    this.submitted = true; // Set form submitted flag

    if (form.valid && this.selectedProduct) {
      const formData = new FormData();
      formData.append('name', this.selectedProduct.name);
      formData.append('nameInArabic', this.selectedProduct.nameInArabic);
      formData.append('description', this.selectedProduct.description);
      formData.append('descriptionInArabic', this.selectedProduct!.descriptionInArabic);
      formData.append('price', String(this.selectedProduct.price));
      formData.append('category', this.selectedProduct.category);
      formData.append('quantity', String(this.selectedProduct.quantity));

      this.colorInputs.forEach((color) => {
        formData.append('color', color);
      });


      if (this.selectedFiles.length === 0) {
        if (this.isEditMode) {

          this.selectedProduct.images.forEach((image) => {
            formData.append('images', image);
          });
        } else {

          this.showAlert('At least one image is required.', 'danger');
          return;
        }
      } else {

        this.selectedFiles.forEach((file) => {
          formData.append('images', file, file.name);
        });
      }

      if (this.isEditMode) {
        this.productsService.updateProduct(this.selectedProduct._id, formData).subscribe(
          () => {
            this.getProducts();
            this.showAlert('Product updated successfully!', 'success');
            this.modalService.dismissAll();
          },
          () => this.showAlert('Failed to update product.', 'danger')
        );
      } else {
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
    } else {
      this.showAlert('Please fill out all required fields.', 'danger');
    }
  }


  openModal(content: any, product: Product | null = null) {
    if (product) {
      this.isEditMode = true;
      this.selectedProduct = { ...product };
      this.colorInputs = product.color || [];


      this.selectedFiles = [];
      this.filePreview = {};

      product.images.forEach((imageUrl) => {
        const fileName = imageUrl.split('/').pop();
        this.filePreview[fileName || 'image'] = imageUrl;
      });
    } else {
      this.isEditMode = false;
      this.selectedProduct = {
        _id: '',
        name: '',
        nameInArabic: '',
        description: '',
        descriptionInArabic: '',
        price: 1, 
        images: [], 
        color: [], 
        quantity: 1, 
        category: '' 

      };
      this.colorInputs = [];
      this.selectedFiles = [];
      this.filePreview = {};
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }


      addColor() {
        this.colorInputs.push('#ffffff');
      }

      removeColor(index: number) {
        this.colorInputs.splice(index, 1);
      }




  openDeleteModal(content: any, productId: string) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteProduct(productId);
        }
      },
      (reason) => {

      }
    );
  }

  deleteProduct(_id: string) {
    this.productsService.deleteProduct(_id).subscribe(
      () => {
        this.getProducts();
        this.showAlert('Product deleted successfully!', 'danger');
      },
      () => this.showAlert('Failed to delete product.', 'danger')
    );
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






