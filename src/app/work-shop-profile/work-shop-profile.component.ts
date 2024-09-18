// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-workshop-profile',
//   templateUrl: './work-shop-profile.component.html',
//   styleUrls: ['./work-shop-profile.component.css'],
//   standalone: true,
//   imports: [
// CommonModule,
// FormsModule,
//   ],
// })
// export class WorkshopProfileComponent {
//   workshop = {
//     title: 'Introduction to Woodworking',
//     date: '2023-06-15',
//     time: '10:00 AM - 4:00 PM',
//     location: '123 Main St, Anytown USA',
//     instructor: 'John Doe',
//     capacity: 20,
//     registrations: 15,

//     description:
//       'Learn the basics of woodworking, including safety, tools, and techniques.',
//     image: 'https://via.placeholder.com/150',
//   };

//   editMode = false;

//   toggleEditMode() {
//     this.editMode = !this.editMode;
//   }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.workshop.image = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   saveWorkshop() {
//     // Logic to save updated workshop details (can be API call or local save)
//     this.toggleEditMode();
//   }


// }
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workshop-profile',
  templateUrl: './work-shop-profile.component.html',
  styleUrls: ['./work-shop-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WorkshopProfileComponent {
  workshop = {
    title: 'Introduction to Woodworking',
    date: '2023-06-15',
    time: '10:00 AM - 4:00 PM',
    location: '123 Main St, Anytown USA',
    instructor: 'John Doe',
    capacity: 20,
    registrations: 15,
    description: 'Learn the basics of woodworking, including safety, tools, and techniques.',
    image: 'https://via.placeholder.com/150',
  };

  editMode = false;

  constructor() {
    this.loadWorkshopFromLocalStorage();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.workshop.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveWorkshop() {
    this.toggleEditMode();
    // Save workshop details to localStorage
    localStorage.setItem('workshop', JSON.stringify(this.workshop));
  }

  loadWorkshopFromLocalStorage() {
    // Check if there is workshop data in localStorage
    const savedWorkshop = localStorage.getItem('workshop');
    if (savedWorkshop) {
      this.workshop = JSON.parse(savedWorkshop);
    }
  }
}
