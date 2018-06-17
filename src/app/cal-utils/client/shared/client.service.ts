import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Client } from './client.model';
@Injectable()
export class ClientService {

  clientList: AngularFireList<any>;
  selectedClient: Client = new Client();
  allClients: Client[];

  constructor(private firebase : AngularFireDatabase) { }

 getData(){
    this.clientList = this.firebase.list('clients');
    
    return this.clientList;
  }


  insertClient(client: Client): string 
  {
    console.log("Inside InsertClient "+ client.reminder);
    return this.clientList.push({
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      landline: client.landline,
      email: client.email,
      age: client.age,
      gender: client.gender,
      street1: client.street1,
      city: client.city,
      province: client.province,
      postal: client.postal,
      lead: client.lead,
      profession: client.profession,
      notes: client.notes,
      reminder: client.reminder.toString(),
      status: client.status,
      createDate: new Date().toString(),
    }).key;
  }

  updateClient(client: Client) 
  {
    this.clientList.update( client.$key,
      {
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        landline: client.landline,
        email: client.email,
        age: client.age,
        gender: client.gender,
        street1: client.street1,
        city: client.city,
        province: client.province,
        postal: client.postal,
        lead: client.lead,
        profession: client.profession,
        notes: client.notes,
        reminder: client.reminder.toString(),
        status: client.status,
        createDate: client.createDate.toString(),
    });
  }

  deleteClient($key: string){
    this.clientList.remove($key);
  }
}
