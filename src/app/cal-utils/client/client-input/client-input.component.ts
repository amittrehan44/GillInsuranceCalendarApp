import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import {Client} from '../shared/client.model';
import {ClientService} from '../shared/client.service';
import {ClientAppointmentsService} from '../shared/client-appointments.service';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-client-input',
  templateUrl: './client-input.component.html',
  styleUrls: ['./client-input.component.css']
})
export class ClientInputComponent implements OnInit {

  customerForm: FormGroup;
  customer: Client= new Client();
  emailMessage: string;
  firstNameMessage: string;
  private sub: Subscription;


  mask: any[] = ['+', '1', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];


  private emailvalidationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
};

private firstNamevalidationMessages = {
  required: 'Please enter Clients Name.',
  minlength: 'Name must be longer than 3 characters.'
};

pageTitle: string = 'Product Edit';

get landline(): FormArray {
  return <FormArray>this.customerForm.get('landline');
}
refresh: Subject<any> = new Subject();

constructor(private fb: FormBuilder, 
            private route: ActivatedRoute,
            private router: Router, 
            public clientService: ClientService, 
            private clientAppService: ClientAppointmentsService, 
            private toastr: ToastrService,
            private firebase : AngularFireDatabase) { }


  ngOnInit() {

      this.clientService.getData();
      this.clientAppService.getData();

      this.customerForm = this.fb.group({
             firstName: ['', [Validators.required, Validators.minLength(3)]],
          lastName: ['', [Validators.maxLength(50)]],
          email: ['', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
          phone: ['', [Validators.pattern('[0-9+]{12}')]],
          //landline: ['', [Validators.pattern('[0-9+]{12}')]],
          landline: this.fb.array([]),
          age: '',
          $key: null,
          gender: '',
          street1: '',
          city: '',
          province: 'BC',
          postal: '',
          profession: '',
          notes: '',
          lead: '',
          reminder: '',
          status: 'Not Started',
          createDate: new Date()
      });

      // Read the product Id from the route parameter
      this.sub = this.route.params.subscribe(
        params => {
            let id = params['id'];
            this.getClient(id);
        }
    );

      // this.customerForm.valueChanges.subscribe(value=> 
      //   this.clientService.selectedClient = value);

        const emailControl = this.customerForm.get('email');
        emailControl.valueChanges.debounceTime(1000).subscribe(value =>
          this.setMessage(emailControl, "email"));

          const firstNameControl = this.customerForm.get('firstName');
          firstNameControl.valueChanges.debounceTime(1000).subscribe(value =>
          this.setMessage(firstNameControl, "firstName"));
  }

  addAlternatePhone(): void {
    this.landline.push(new FormControl());
  }

  deleteAlternatePhone(index: number): void {
    this.landline.removeAt(index);
    // The line below is required in Angular 4 to fix a bug with `removeAt` that was fixed in Angular 5.
    //this.productForm.setControl('tags', this.fb.array(this.tags.value || []));
  }

  setMessage(c: AbstractControl, control: string): void {

    if(control == "email"){
      this.emailMessage = '';
      if ((c.touched || c.dirty) && c.errors) {
          this.emailMessage = Object.keys(c.errors).map(key =>
              this.emailvalidationMessages[key]).join(' ');
      }
    }
    else if(control == "firstName"){
      this.firstNameMessage = '';
      if ((c.touched || c.dirty) && c.errors) {
        this.firstNameMessage = Object.keys(c.errors).map(key =>
            this.firstNamevalidationMessages[key]).join(' ');
    }
    }
}

  resetForm(customerForm?: FormGroup) {
   
    //customerForm.reset();
    this.clientService.selectedClient = {
        $key: null,
        firstName: ' ',
        lastName: ' ',
        phone: ' ',
        landline: [' '],
        email: ' ',
        age: ' ',
        gender: ' ',
        street1: '',
        city: '',
        province: '',
        postal: '',
        lead: '',
        profession:'',
        notes:'',
        reminder:'',
        status: 'Not Started',
        createDate: null

    }

    this.customerForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      //landline: '',
      age: '',
      $key: null,
      gender: '',
      street1: '',
      city: '',
      province: 'BC',
      postal: '',
      lead: '',
      profession: '',
      notes: '',
      reminder: '',
      status: 'Not Started',
      createDate: ''
    });  
    this.customerForm.setControl('landline', this.fb.array('' || []));
  }

  save() {

    this.clientService.selectedClient = this.customerForm.value;
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));

    if(this.customerForm.value.$key == null || this.customerForm.value.$key == ''){
      var k = this.clientService.insertClient(this.clientService.selectedClient);
      this.clientAppService.insertNewClient(k);
      this.router.navigate(['/welcome']);
    }
    else{
      console.log(this.clientService.selectedClient);
      this.clientService.updateClient(this.clientService.selectedClient);
    }
     this.resetForm(this.customerForm);
     //this.router.navigate(['/welcome']);
     this.toastr.success('Submitted Succcessfully', 'Client');
  }

  onDelete(key: string){
    if ( this.clientService.selectedClient.$key === null) {
      this.router.navigate(['/welcome']);
    } 
    else {
      if(confirm('Are you sure you want to remove this record?')== true){
        this.clientService.deleteClient(key);
        this.toastr.warning('Deleted Successfully', 'Client Register');
        this.router.navigate(['/welcome']);
      }
    }

   
  }


  //this is called from routing url, if 0 add  client if not edit client
  getClient(key: string){
    console.log(key);

    if(key == '0'){
      this.pageTitle = 'Add Client';
      return this.resetForm(this.customerForm);
    }
    console.log("Key is not 0");
    var x = this.clientService.getData();
    x.snapshotChanges().subscribe(item => {
    
      item.forEach(element => {
      
          if(key == element.key){
            var y = element.payload.toJSON();
            y["$key"] = element.key;
            console.log(y);
            this.onEdit(y as Client)
          }
          
     // console.log(y);
        })
    
    });
  }

    onEdit(client: Client){
      if (this.customerForm) {
            this.customerForm.reset();
            
        }
        //this.resetForm(this.customerForm);
       // console.log(client);
      this.clientService.selectedClient = client;
      var stArray;
     
     
      if(client.reminder == undefined){
        client.reminder = '';
      }
      
      if(client.createDate == undefined){
        client.createDate = '';
      }

      if(client.status == undefined){
        client.status = '';
      }
      
       
     
      if ( this.clientService.selectedClient.$key === null) {
            this.pageTitle = 'Add Client';
        } else {
            this.pageTitle = `Edit Client: ${this.clientService.selectedClient.firstName} ${this.clientService.selectedClient.lastName}`;
        }
            
            console.log(client);
            console.log(this.clientService.selectedClient);
            console.log(this.clientService.selectedClient.reminder);
       
            this.firebase.database.ref('clients/'+this.clientService.selectedClient.$key+'/landline').once('value', function(snapshot) {
              console.log(snapshot.val());
              stArray= snapshot.val();
              // ["Bill Gates", "Larry Page", "James Tamplin"] from {0:Bill, 1:Larry}
            }).then(res => {
              this.customerForm.setControl('landline', this.fb.array(stArray || []));
             
          });
           
         

      this.customerForm.patchValue({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        //landline: client.landline,
        age: client.age,
        $key: client.$key,
        gender: client.gender,
        street1: client.street1,
        city: client.city,
        province: client.province,
        postal: client.postal,
        lead: client.lead,
        profession: client.profession,
        notes: client.notes,
        reminder: client.reminder,
        status: client.status,
        createDate: client.createDate

      });  
    
    }

    clearReminder(){
      //this.clientService.selectedClient.reminder = "";
      this.customerForm.patchValue({
        reminder: '',
      });
      

    }

    setReminderToday(){
      this.customerForm.patchValue({
        reminder: new Date(),
      });
    }

}
