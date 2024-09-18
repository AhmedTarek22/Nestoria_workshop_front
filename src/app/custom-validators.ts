import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Alphabetic validator (Name)
  static alphabetic(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[A-Za-z\s]+$/;
    if (control.value && !regex.test(control.value)) {
      return { alphabetic: true };
    }
    return null;
  }

  // Alphanumeric validator (Workshop name)
  static alphanumeric(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[A-Za-z0-9\s]+$/;
    if (control.value && !regex.test(control.value)) {
      return { alphanumeric: true };
    }
    return null;
  }

  // Phone number validator (Phone)
  static phoneNumber(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^[0-9]{10}$/;  // Example: 10-digit phone number
    if (control.value && !regex.test(control.value)) {
      return { phoneNumber: true };
    }
    return null;
  }

  // URL validator for optional URL field
  static optionalUrl(control: AbstractControl): { [key: string]: boolean } | null {
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (control.value && !regex.test(control.value)) {
      return { invalidUrl: true };
    }
    return null;
  }
}
