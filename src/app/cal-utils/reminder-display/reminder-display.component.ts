import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CalEventsService } from './../../cal-events.service'
import { ClientService } from './../client/shared/client.service'
import { Client } from './../client/shared/client.model'

import { DatePipe } from '@angular/common';
import {Router} from "@angular/router";
@Component({
  selector: 'app-reminder-display',
  templateUrl: './reminder-display.component.html',
  styleUrls: ['./reminder-display.component.css']
})
export class ReminderDisplayComponent implements OnInit {

  
   
    today: Date = new Date();
    clientlist: Client[] = [];
    todaysReminder: Client[] = [];
    dateReminder: Client[] = [];
    _viewDate: Date;
    missedReminder: Client[]=[];;

    get viewDate(): Date {
        return this._viewDate
    }


  @Input() 
  set viewDate(viewDate: Date){
      this._viewDate = viewDate;
      this.getDateReminder();
  }
  

  constructor(  private _clientService: ClientService,
                private router: Router,
                private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    var x = this._clientService.getData();
    x.snapshotChanges().subscribe(item => {
      this.clientlist = [];
      this.todaysReminder = [];
      this.dateReminder = [];
      this.missedReminder = [];
      item.forEach(element => {
          var y = element.payload.toJSON();
          y["$key"] = element.key;
          this.clientlist.push(y as Client);

          //go through each appointment and if remnder match todays date save it in array
          var event = y["reminder"];
          var reminder = new Date(event);
          if(event != undefined && event != '') {
        //   //time in UTC    
        //   console.log(event);
        //   //Time in PST
        //   console.log(reminder);
            var today = new Date();

          if(reminder.getDate() === today.getDate() && reminder.getMonth() == today.getMonth() && reminder.getFullYear() == today.getFullYear()){
             //   console.log(reminder + ": Todays Match Found");
                this.todaysReminder.push(y as Client);
          }

          if(reminder.getDate() == this.viewDate.getDate() && reminder.getMonth() == this.viewDate.getMonth() && reminder.getFullYear() == this.viewDate.getFullYear()){
           // console.log(reminder + ": Todays Match Found");
            this.dateReminder.push(y as Client);
            }

            if(reminder< this.viewDate) {
                if(reminder.getDate() === this.viewDate.getDate() && reminder.getMonth() == this.viewDate.getMonth() && reminder.getFullYear() == this.viewDate.getFullYear()){
                    
                 }
                 else{
                    this.missedReminder.push(y as Client);
                 }
                
            }

          
         
         
        }
          /* for double digits date (10-31) */
        //   if (this.dummy.substring(8, 10) == this.today.getDate().toString() && this.dummy.substring(4, 7) == this.monthNames[this.today.getMonth()] && this.dummy.substring(11, 15) == this.today.getFullYear().toString()) {
        //       this.todaysReminder.push(y as Client);


        //   }
        //   /* for date with single digits (1-9) */
        //   else if (this.dummy.substring(9, 10) == this.today.getDate().toString() && this.dummy.substring(4, 7) == this.monthNames[this.today.getMonth()] && this.dummy.substring(11, 15) == this.today.getFullYear().toString()) {
              
        //       if(this.dummy.substring(8, 9) == '0')
        //       this.todaysReminder.push(y as Client);
        //   }
      });
      

     
      //console.log("belwo are upcoming appointments: ");
      //console.log(this.dateReminder);
      
      //this.sortByDate();
      this.sortByDate(this.todaysReminder);
      this.sortByDate(this.dateReminder);
      this.sortByDate(this.missedReminder);
      //console.log("belwo are sorted upcoming appointments: ");
     // console.log(this.todaysReminder);
      /*
               //  console.log(this.clientlist.find(i => new Date(i.start.getDate()).toString() === this.today.getDate().toString()));
                 this.date1 = new Date(this.clientlist[0].start);
                 console.log(this.date1.getDate());
     
                 for (var i: number = 0; i < this.clientlist.length; i++) {
                     this.date1 = new Date(this.clientlist[i].start);
                     if (this.date1.getDate() == this.today.getDate()) { 
                         console.log("AAj Mangalwar hai");
                         this.todaysReminder.push({
                             $key: this.clientlist[i].$key,
                             firstname: this.clientlist[i].firstname,
                             lastname: this.clientlist[i].lastname,
                             service: this.clientlist[i].service,
                             start: this.clientlist[i].start,
                             end: this.clientlist[i].end,
                             stylist_title: this.clientlist[i].stylist_title,
                             gender: this.clientlist[i].gender
                         });
                     }
                 };
                 console.log("belwo are upcoming appointments: ");  
                 console.log(this.todaysReminder);   
     */
    //this.cdr.detectChanges();
  });
  }

  public sortByDate(todaysAppointment: Client[]): void {
    
    todaysAppointment.sort((a: Client, b: Client) => {

         var dat1 = new Date(a.reminder);
         var dat2 = new Date(b.reminder);
        return dat1.getTime() - dat2.getTime();

    });

}

onItemClick(app: Client) {
    //this._caleventService.selectedAppointment = Object.assign({}, app);
    //console.log(app);
    this.router.navigate(['/clientEdit', app.$key]);
}

getDateReminder() {
    this.dateReminder = [];
    //console.log(this.clientlist);
    //console.log(this.clientlist.length);
    for(var i=0; i<this.clientlist.length; i++){
        var element = this.clientlist[i];
        if(element.reminder != undefined && element.reminder != '') {
        var reminder = new Date(element.reminder);
        if(reminder.getDate() == this.viewDate.getDate() && reminder.getMonth() == this.viewDate.getMonth() && reminder.getFullYear() == this.viewDate.getFullYear()){
            //console.log(reminder + ": Todays Match Found");
            this.dateReminder.push(element);
            }
        } 
    }
 
  
}

}
