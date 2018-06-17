import { ChangeDetectorRef,  Component, forwardRef, Input, OnInit } from '@angular/core';
import {
    getSeconds,
    getMinutes,
    getHours,
    getDate,
    getMonth,
    getYear,
    setSeconds,
    setMinutes,
    setHours,
    setDate,
    setMonth,
    setYear
} from 'date-fns';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerComponent),
    multi: true
};

@Component({
    selector: 'mwl-demo-utils-date-time-picker',
    template: `
    <form class="form-inline">
      <div class="form-group">
        <div class="input-group">
          <input
            readonly
            class="form-control"
            [placeholder]="placeholder"
            name="date"
            [(ngModel)]="dateStruct"
            (ngModelChange)="updateDate()"
            ngbDatepicker
            #datePicker="ngbDatepicker">
            <div class="input-group-addon" (click)="datePicker.toggle()" >
              <i class="fa fa-calendar"></i>
            </div>
        </div>
      </div>
    </form>
    <ngb-timepicker
      [(ngModel)]="timeStruct"
      (ngModelChange)="updateTime()"
      [meridian]="true">
    </ngb-timepicker>
  `,
    styles: [
        `
    .form-group {
      width: 100%;
    }
  `
    ],
    providers: [DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit {
    @Input() placeholder: string;

    date: Date;
 //   newDate: Date = null;

    dateStruct: NgbDateStruct;

    timeStruct: NgbTimeStruct;

    datePicker: any;

    private onChangeCallback: (date: Date) => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        
    }

    writeValue(date: Date): void {
        this.date = date;
        this.dateStruct = {
            day: getDate(date),
            month: getMonth(date) + 1,
            year: getYear(date)
        };
        this.timeStruct = {
            second: getSeconds(date),
            minute: getMinutes(date),
            hour: getHours(date)
        };
        //this.cdr.detectChanges();

        if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
        }
        
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void { }
/*
    updateDate(): void {
        this.newDate = setYear(
            setMonth(
                setDate(this.date, this.dateStruct.day),
                this.dateStruct.month - 1
            ),
            this.dateStruct.year
        );
        this.onChangeCallback(this.newDate);
        this.date = this.newDate;
    }
*/

    updateDate(): void {
        const newDate: Date = setYear(
            setMonth(
                setDate(this.date, this.dateStruct.day),
                this.dateStruct.month - 1
            ),
            this.dateStruct.year
        );
        this.onChangeCallback(newDate);
        //this.date = newDate;
        this.writeValue(newDate);
    }

    updateTime(): void {
        const newDate: Date = setHours(
            setMinutes(
                setSeconds(this.date, this.timeStruct.second),
                this.timeStruct.minute
            ),
            this.timeStruct.hour
        );
        this.onChangeCallback(newDate);
        //this.date = newDate;
        this.writeValue(newDate);
    }
/*
    updateTime(): void {
        this.newDate = setHours(
            setMinutes(
                setSeconds(this.date, this.timeStruct.second),
                this.timeStruct.minute
            ),
            this.timeStruct.hour
        );
        this.onChangeCallback(this.newDate);
        this.date = this.newDate;
    }
*/
    
}
