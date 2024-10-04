
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-workshop-profile',
  templateUrl: './work-shop-profile.component.html',
  styleUrls: ['./work-shop-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WorkshopProfileComponent implements OnInit {
  workshop: any = {}; // Holds the original data
  workshopTemp: any = {}; // Temporary object for form changes
  editMode = false;
  errorMessage = '';
  selectedFile: File | null = null; // Store selected file

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getWorkshopData(); // Fetch workshop data on component load
  }

  // Fetch workshop data from the profile service
  getWorkshopData() {
    this.profileService.getProfileData().subscribe(
      (data) => {
        if (data) {
          this.workshop = data; // Set workshop data from profile
        } else {
          this.errorMessage = 'Failed to load workshop data';
        }
      },
      (error) => {
        this.errorMessage = 'Error fetching data';
        console.error('Error:', error);
      }
    );
  }

  // Toggle edit mode, copying the original data to a temporary object if in edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.workshopTemp = { ...this.workshop }; // Copy the workshop data into a temporary object
    }
  }

  // Handle file selection for image upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && validImageTypes.includes(file.type)) {
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.errorMessage = 'File size exceeds the 5MB limit.';
        return;
      }

      this.selectedFile = file; // Store the selected file for upload
    } else {
      this.errorMessage = 'Invalid file type. Only JPG, JPEG, and PNG are allowed.';
    }
  }

  // Save workshop data, update the original data, and toggle edit mode off
  saveWorkshop() {
    if (!this.workshopTemp.name || !this.workshopTemp.email || !this.workshopTemp.phone || !this.workshopTemp.address) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    // Prepare FormData object
    const formData = new FormData();
    formData.append('name', this.workshopTemp.name);
    formData.append('email', this.workshopTemp.email);
    formData.append('phone', this.workshopTemp.phone);
    formData.append('address', this.workshopTemp.address);
    formData.append('description', this.workshopTemp.description);

    // Append file if available
    if (this.selectedFile) {
      formData.append('personalPhoto', this.selectedFile);
    }

    this.profileService.updateProfileData(formData).subscribe(
      (response) => {
        this.workshop = { ...this.workshopTemp, ...response }; // Update original workshop data
        this.errorMessage = '';
        this.toggleEditMode(); // Exit edit mode
        console.log('Workshop updated successfully:', this.workshop);
      },
      (error) => {
        console.error('Error updating profile data:', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
      }
    );
  }

  // Cancel edit mode, discard changes
  cancelEdit() {
    this.toggleEditMode(); // Simply toggle off the edit mode
  }
}
