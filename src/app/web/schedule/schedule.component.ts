import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconModule, IconService } from '@ant-design/icons-angular';
import { DeleteOutline, EditFill, PlusOutline } from '@ant-design/icons-angular/icons';
import { ScheduleReq, ScheduleResp } from '@core/model/schedule.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NgbModal, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import moment from 'moment-timezone';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, IconModule, NgbTimepickerModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  @ViewChild('calModel') calModel!: TemplateRef<any>;
  @ViewChild('editModel') editModel!: TemplateRef<any>;

  private modalService = inject(NgbModal);
  protected selectedDate: Date = new Date();
  public dateEvents: any[] = [];

  protected addEvent = {
    title: "",
    color: "",
    start: { hour: 0, minute: 0 },
    end: { hour: 0, minute: 0 }
  };

  public eventTitles = ["In A Meeting", "Available", "Busy", "Out Of Office", "In Class", "On Break", "Do Not Disturb", "Available Soon"];
  public eventColors = ['green', 'blue', 'red', 'orange', 'purple'];
  public events = [];

  calendarOptions: CalendarOptions = {
    editable: true,
    weekends: true,
    events: this.events,
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    buttonText: { today: 'Today', month: 'Month', week: 'Week', day: 'Day', list: 'List' },
  };

  constructor(
    private apiService: ApiService,
    private iconService: IconService,
    private apiErrorService: ApiErrorService,
  ) {
    this.iconService.addIcon(
      ...[
        EditFill,
        DeleteOutline,
        PlusOutline,
      ]);
  }

  ngOnInit(): void {
    this.getAllEvent();
  }

  public handleDateClick(arg: any): void {
    this.dateEvents = [];
    const dateToHandle = arg.dateStr.split("-");
    this.selectedDate = new Date(dateToHandle[0], +dateToHandle[1] - 1, dateToHandle[2]);
    this.dateEvents = this.events.filter(event => {
      const eventStart = new Date(event.start);
      const eventStartDate = eventStart.toISOString().split('T')[0];
      const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
      return selectedDateStr == eventStartDate;
    });
    
    this.dateEvents = this.dateEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    this.openModel(this.calModel);
  }

  public openModel(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true });
  }

  public closeModel(): void {
    this.modalService.dismissAll();
  }

  public onAddEvent(): void {
    this.addEvent = {
      title: "",
      color: "",
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    };
    this.openModel(this.editModel);
  }

  public getAllEvent(): void {
    this.apiService.getSchedule().subscribe({
      next: (resp: any) => {
        this.events = resp;
        this.calendarOptions.events = resp;
        if (this.selectedDate != null) {
          this.dateEvents = this.events.filter(event => {
            const eventStart = new Date(event.start);
            const eventStartDate = eventStart.toISOString().split('T')[0];
            const selectedDateStr = this.selectedDate.toISOString().split('T')[0];
            return selectedDateStr == eventStartDate;
          });

          this.dateEvents = this.dateEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        }
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to get sechedule', 'Error');
      }
    })
  }

  public onSaveEvent(): void {
    const startDate = new Date(this.selectedDate);
    startDate.setHours(this.addEvent.start.hour);
    startDate.setMinutes(this.addEvent.start.minute);

    const endDate = new Date(this.selectedDate);
    endDate.setHours(this.addEvent.end.hour);
    endDate.setMinutes(this.addEvent.end.minute);

    const paramStartTime = moment(startDate).tz('America/Toronto').format();
    const paramEndTime = moment(endDate).tz('America/Toronto').format();

    const param: ScheduleReq = {
      title: this.addEvent.title,
      color: this.addEvent.color,
      start: paramStartTime,
      end: paramEndTime,
    };

    this.apiService.postSchedule(param).subscribe({
      next: (resp: any) => {
        this.getAllEvent();
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to save schedule.', 'Error');
      }
    });
  }

  public onDeleteEvent(data: ScheduleResp): void {
    debugger;
    this.apiService.deleteSchedule(data.id).subscribe({
      next: () => {
        this.getAllEvent();
      }
    });
  }

}
