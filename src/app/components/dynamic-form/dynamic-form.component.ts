import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Permission, Role, SubscriptionType } from '../../models/user';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  
})
export class DynamicFormComponent implements OnInit {
  userForm: FormGroup;
  userTypes = ['Admin', 'Guest', 'Subscriber'];
  roles: Role[] = [
    { name: 'Super Admin', value: 'super_admin' },
    { name: 'Content Manager', value: 'content_manager' },
    { name: 'User Manager', value: 'user_manager' }
  ];
  permissions: Permission[] = [
    { name: 'Create Users', value: 'create_users', checked: false },
    { name: 'Edit Users', value: 'edit_users', checked: false },
    { name: 'Delete Users', value: 'delete_users', checked: false },
    { name: 'View Reports', value: 'view_reports', checked: false },
    { name: 'Manage Content', value: 'manage_content', checked: false }
  ];
  subscriptionTypes: SubscriptionType[] = [
    { name: 'Basic', value: 'basic' },
    { name: 'Premium', value: 'premium' },
    { name: 'Enterprise', value: 'enterprise' }
  ];
  submittedData: any = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userType: ['', Validators.required],
      // Dynamic fields will be added based on user type selection
    });
  }

  ngOnInit(): void {
    // Listen for changes in the userType control
    this.userForm.get('userType')?.valueChanges.subscribe(userType => {
      this.updateFormFields(userType);
    });
  }

  updateFormFields(userType: string): void {
    // Reset form except userType
    const currentUserType = this.userForm.get('userType')?.value;
    this.userForm = this.fb.group({
      userType: [currentUserType, Validators.required]
    });

    // Add fields based on user type
    switch (userType) {
      case 'Admin':
        this.userForm.addControl('email', this.fb.control('', [Validators.required, Validators.email]));
        this.userForm.addControl('role', this.fb.control('', Validators.required));
        this.userForm.addControl('permissions', this.fb.array([]));
        this.initPermissions();
        break;
      case 'Guest':
        this.userForm.addControl('name', this.fb.control('', Validators.required));
        this.userForm.addControl('visitReason', this.fb.control('', Validators.required));
        this.userForm.addControl('visitDate', this.fb.control('', Validators.required));
        break;
      case 'Subscriber':
        this.userForm.addControl('name', this.fb.control('', Validators.required));
        this.userForm.addControl('email', this.fb.control('', [Validators.required, Validators.email]));
        this.userForm.addControl('subscriptionType', this.fb.control('', Validators.required));
        break;
    }
  }

  initPermissions(): void {
    const permissionArray = this.userForm.get('permissions') as FormArray;
    this.permissions.forEach(permission => {
      permissionArray.push(this.fb.group({
        name: permission.name,
        value: permission.value,
        checked: false
      }));
    });
  }

  get permissionsArray(): FormArray {
    return this.userForm.get('permissions') as FormArray;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Process form data
      const formData = { ...this.userForm.value };
      
      // For Admin, extract only checked permissions
      if (formData.userType === 'Admin' && formData.permissions) {
        formData.permissions = formData.permissions
          .filter((p: Permission) => p.checked)
          .map((p: Permission) => p.value);
      }
      
      this.submittedData = formData;
      console.log('Form submitted:', formData);
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.userForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.userForm.reset();
    this.submittedData = null;
  }
}