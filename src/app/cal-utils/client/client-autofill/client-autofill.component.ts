import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Client} from '../shared/client.model';
import {ClientService} from '../shared/client.service';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import {CalEventsService} from '../../../cal-events.service';
import {ClientAppointmentsService} from '../shared/client-appointments.service';

@Component({
  selector: 'app-client-autofill',
  templateUrl: './client-autofill.component.html',
  styleUrls: ['./client-autofill.component.css']
})
export class ClientAutofillComponent implements OnInit {
  myControl: FormControl = new FormControl();

  clientList: Client[];
  filteredList: Observable<Client[]>;

  mask: any[] = ['+', '1', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];


  constructor(private clientService: ClientService, private _caleventService: CalEventsService, private clientAppService: ClientAppointmentsService) { }

  ngOnInit() {

    var x = this.clientService.getData();
    x.snapshotChanges().subscribe(item => {
      this.clientList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.clientList.push(y as Client);
        
      })
      console.log(this.clientList);
    });


    // //Autofill using name
    // this.filteredList = this.myControl.valueChanges
    // .pipe(startWith<string | Client>(''),
    // map(value => typeof value === 'string' ? value : value['firstName']),
    // map(state => state ? this.filteredClients(state) : this.clientList)
    // );

      //Autofill using phone
      this.filteredList = this.myControl.valueChanges
      .pipe(startWith<string | Client>(''),
      map(value => typeof value === 'string' ? value : value['phone']),
      map(state => state ? this.filteredClients(state) : this.clientList)
      );


    this.myControl.valueChanges.subscribe(value=> 
      this.onEdit(value)
      );


  }
     // //Autofill functions using name
  // filteredClients(name: any) {
  //   return this.clientList.filter(state =>
  //     state.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }

  // displayFn(user?: Client): string | undefined {
  //   return user ? user.firstName : undefined;
  // }

    filteredClients(phone: any) {
      phone = '+1'+phone;
      return this.clientList.filter(state =>
        state.phone.toLowerCase().indexOf(phone.toLowerCase()) === 0);
    }


  displayFn(user?: Client): string | undefined {
   return user ? user.phone : undefined;
 }

 onEdit(client: Client){
   
  console.log("On Edit");
  console.log(client);
  console.log(client.$key);
  
  if(client.$key != null || client.$key != undefined){
    console.log("yohoo");
  this._caleventService.selectedAppointment.firstName = client.firstName;
  this._caleventService.selectedAppointment.lastName = client.lastName;
  this._caleventService.selectedAppointment.email = client.email;
  this._caleventService.selectedAppointment.phone = client.phone;
 // this._caleventService.selectedAppointment.landline = client.landline;
  this._caleventService.selectedAppointment.clientKey = client.$key;
  this._caleventService.selectedAppointment.gender = client.gender;
  //get all appointments for selected client
  // if(this._caleventService.selectedAppointment.clientKey != null)
   //this.clientAppService.getClientAppointments(this._caleventService.selectedAppointment.clientKey);
   this.clientAppService.getClientAppointments1(this._caleventService.selectedAppointment.clientKey, this.clientAppService.allClientAppointments, this._caleventService.allAppointments);
}
else{

  this._caleventService.selectedAppointment.firstName = '';
  this._caleventService.selectedAppointment.lastName = '';
  this._caleventService.selectedAppointment.email = '';
  this._caleventService.selectedAppointment.phone ='';
  this._caleventService.selectedAppointment.landline ='';
  this._caleventService.selectedAppointment.clientKey = null;
  this._caleventService.selectedAppointment.gender = '';
  this.clientAppService.noShow = 0;
  this.clientAppService.selectedClientApps = [];
}
}



}
