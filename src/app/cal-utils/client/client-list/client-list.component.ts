import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Client} from '../shared/client.model';
import {ClientService} from '../shared/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
      clientList: Client[];
      displayedColumns = ['name', 'phone', 'email', 'age', 'profession', 'address', 'lead', 'notes', 'edit'];
      dataSource = new MatTableDataSource();

      constructor(private clientService: ClientService) { }

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
                this.dataSource.data = this.clientList;
            });
      }

      applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }
}




