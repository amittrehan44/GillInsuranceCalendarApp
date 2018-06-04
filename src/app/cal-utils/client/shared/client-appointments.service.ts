import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ClientAppointments } from './client-appointments.model';


  
@Injectable()
export class ClientAppointmentsService {

 
  clientAppointmentsList: AngularFireList<any>;
 //selectedClientAppointment: ClientAppointments = new ClientAppointments();
  selectedClientApps: string[] = [];
  noShow: number = 0;
  allClientAppointments: ClientAppointments[];

  constructor(private firebase : AngularFireDatabase) { }

  getData(){
    this.clientAppointmentsList = this.firebase.list('clientAppointments');
    return this.clientAppointmentsList;
  }

  insertNewClient(client: string) 
  {
    this.selectedClientApps = [];
    console.log("Inside InsertClientAPpointment, adding new client to ClientAPP ");
    this.clientAppointmentsList.push({
      clientKey: client,
      //appointmentKeys: this.selectedClientApps
    });
  }

  //This function will either insert or delete from clientAppointments
  insertClientApp(clientKey: string, key: string) 
  {
    console.log(this.selectedClientApps);
    //var key = this.getClientAppKey(clientKey);
    console.log("Inserting/Deleting appoitntment to Key: "+key);
    console.log("Inserting/Deleting appoitntment to clientKey: "+clientKey);
    this.clientAppointmentsList.update(key, {
      clientKey: clientKey,
      appointmentKeys: this.selectedClientApps
    });
  }

//Moving this to appointment input adure to defect 5/2

  // deleteClientApp(clientKey: string, appKey: string){
  //   var index = this.selectedClientApps.indexOf(appKey);
  //     if (index > -1) {
  //       this.selectedClientApps.splice(index, 1);
  //     }
  //     else{
  //       return;
  //     }

  //   this.getClientAppKey(clientKey);
  // }

  // getClientAppKey(clientKey: string){
  //   var x = this.getData();
  //     x.snapshotChanges().subscribe(item => {
       
  //       item.forEach(element => {
  //         var y = element.payload.toJSON();
  //         y["$key"] = element.key;
  //         console.log(y["$key"]);
  //         console.log(y["clientKey"]);
  //         if(y["clientKey"]==clientKey){
  //             console.log(y);  
  //             this.insertClientApp(clientKey, y["$key"]);        
              
  //           }
          
  //       })
        
  //     });
     
  // }


  //Below Logic is to get details directly from data base
  //Inserting appointments of selected client from autofill to this.selectedClientApps array
  // getClientAppointments(clientKey: string){
  //   console.log("inside getClientAppointments");
  //   console.log(clientKey);
    
  //     var x = this.getData();
  //     x.snapshotChanges().subscribe(item => {
  //       this.selectedClientApps = [];
  //       item.forEach(element => {
  //         var y = element.payload.toJSON();
  //         y["$key"] = element.key;
  //         if(y["clientKey"]==clientKey){
  //             console.log(y); 
  //             if(y["appointmentKeys"]!=null ||  y["appointmentKeys"] != undefined) {
  //                 //this.selectedClientApps = y["appointmentKeys"] as string[];
  //                 console.log(y["appointmentKeys"]);                  
                   
  //                  var z = this.firebase.list('clientAppointments/'+y["$key"]+'/appointmentKeys');
  //                  z.snapshotChanges().subscribe(item => {
  //                   item.forEach(element1 => {
  //                     var n = element1.payload.toJSON();
  //                     this.selectedClientApps.push(n as string);
                      
  //                   })
  //                   console.log(this.selectedClientApps);
  //                   this.getNoShows(this.selectedClientApps);
  //                  });

  //               }
  //             else
  //                 console.log("No Appointments");    
              
  //           }
          
  //       })
        
  //     });
  // }

  // getNoShows(arg: string[]) {
    
  //   var x = this.firebase.list('appointments');
  //   x.snapshotChanges().subscribe(item => {
  //     this.noShow = 0;
  //     item.forEach(element => {
  //         var y = element.payload.toJSON();
  //         y["$key"] = element.key;
  //         for(var i=0; i<arg.length; i++){
            
  //            if(y["$key"]==arg[i] ){
  //               if(y["noShow"]){
  //                  this.noShow = this.noShow + 1;
  //               }

  //            }
  //         }
          
  //     });
  //     console.log(this.noShow); 
  //   });
  // }

  //Moving logic to get data from local arrays instead of firebase earlier 

    //Inserting appointments of selected client from autofill to this.selectedClientApps array
    getClientAppointments1(clientKey: string, allClientAppointments: ClientAppointments[], allAppointments: any[]){
      this.selectedClientApps = [];
      console.log("inside getClientAppointments");
      console.log(clientKey);
      for (var y=0; y<allClientAppointments.length; y++){
        console.log(allClientAppointments[y]["clientKey"]);
           if(allClientAppointments[y]["clientKey"]==clientKey){
             console.log("Kiddan");
             if(allClientAppointments[y]["appointmentKeys"]!=null ||  allClientAppointments[y]["appointmentKeys"] != undefined) {
                var x = allClientAppointments[y]["appointmentKeys"];
                console.log(x[6]);
                 console.log(x.length);
               for(var z=0; z<100; z++){
                 var n = allClientAppointments[y]["appointmentKeys"][z];
                 if (n!= undefined )
                    this.selectedClientApps.push(n);
               }
             }
             else{
               console.log("No Appointments");   
             }
           }
      }
  
      this.getNoShows1(this.selectedClientApps, allAppointments);
  
    }
  
  
  
  
  
      getNoShows1(clientApps: string[], allApps: any[]) {
        console.log("Getting noShows from: "); 
        console.log(clientApps); 
        this.noShow = 0;
        for (var y=0; y<allApps.length; y++){
          for(var i=0; i<clientApps.length; i++){
                if(allApps[y]["$key"]==clientApps[i] ){
                    if(allApps[y]["noShow"]){
                      this.noShow = this.noShow + 1;
                    }
                }
            }
        }
        console.log(this.noShow); 
      }


}
