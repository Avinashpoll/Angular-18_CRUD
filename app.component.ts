import { EmployeeModel } from './model/employee';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  submitted = false;

  employeeForm: FormGroup = new FormGroup({});

  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem("empData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, Validators.required),
      emailId: new FormControl(this.employeeObj.emailId, [Validators.required, Validators.email]),
      contactNo: new FormControl(this.employeeObj.contactNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      city: new FormControl(this.employeeObj.city, Validators.required),
      state: new FormControl(this.employeeObj.state, Validators.required),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.pattern('^[0-9]{6}$')]),
      address: new FormControl(this.employeeObj.address, Validators.required),
    });
  }

  onSave() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;  // If the form is invalid, don't proceed
    }
    // Continue with saving the data if the form is valid
    const oldData = localStorage.getItem("EmpData");
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);  // Set empId dynamically
      this.employeeList.unshift(this.employeeForm.value);  // Add new employee to the list
    } else {
      this.employeeList.unshift(this.employeeForm.value);  // Add new employee
    }
    localStorage.setItem("EmpData", JSON.stringify(this.employeeList));  // Save updated data
    this.resetForm();  // Reset form after save
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;  // Set the employee data to edit
    this.createForm();  // Populate the form with employee data
  }

  onUpdate() {
    this.submitted = true;  // Set the flag to true when updating
    if (this.employeeForm.invalid) {
      return;  // If the form is invalid, don't proceed
    }

    // Continue with updating the data if the form is valid
    const empId = this.employeeForm.controls['empId'].value;
    const record = this.employeeList.find(m => m.empId === empId);

    if (record) {
      // Update the record
      record.name = this.employeeForm.controls['name'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
      record.address = this.employeeForm.controls['address'].value;

      // Save updated data
      localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
      this.resetForm();  // Reset form after update
    } else {
      alert('Employee not found!');
    }
  }

  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete this employee?");
    if (isDelete) {
      const index = this.employeeList.findIndex(m => m.empId === id);
      this.employeeList.splice(index, 1);
      localStorage.setItem("EmpData", JSON.stringify(this.employeeList));  // Update localStorage
    }
  }

  resetForm() {
    this.employeeObj = new EmployeeModel();  // Reset employee object
    this.createForm();  // Reset form
    this.submitted = false;
  }
}


