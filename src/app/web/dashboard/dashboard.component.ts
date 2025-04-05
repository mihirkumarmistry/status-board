// angular import
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

// project import
import { SharedModule } from '@shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { DeleteOutline, FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { ScheduleReq, ScheduleResp } from '@core/model/schedule.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DefaultComponent implements OnInit {
  @ViewChild('editModel') editModel!: TemplateRef<any>;

  protected todayDate: Date = new Date();
  private modalService = inject(NgbModal);

  protected events: any[] = [];
  protected todayEvents: any[] = [];

  protected addEvent = {
    title: "",
    color: "",
    start: { hour: 0, minute: 0 },
    end: { hour: 0, minute: 0 }
  };

  protected eventTitles = ["In A Meeting", "Available", "Busy", "Out Of Office", "In Class", "On Break", "Do Not Disturb", "Available Soon"];
  protected eventColors = ['green', 'blue', 'red', 'orange', 'purple'];

  // constructor
  constructor(
    private apiService: ApiService,
    private iconService: IconService,
    private apiErrorService: ApiErrorService,
  ) {
    this.iconService.addIcon(...[
      RiseOutline,
      FallOutline,
      SettingOutline,
      GiftOutline,
      MessageOutline,
      DeleteOutline,
    ]);
  }

  public ngOnInit(): void {
    this.getAllEvent();
  }

  protected openModel(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true });
  }

  protected onAddEvent(): void {
    this.addEvent = {
      title: "",
      color: "",
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    };
    this.openModel(this.editModel);
  }

  protected getAllEvent(): void {
    this.apiService.getSchedule().subscribe({
      next: (resp: any) => {
        const today = new Date();
        const todayDate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

        this.events = resp;
        this.todayEvents = this.events.filter(event => {
          const eventDate = `${new Date(event.start).getFullYear()}-${new Date(event.start).getMonth()+1}-${new Date(event.start).getDate()}`;
          return eventDate === todayDate;
        });

        this.todayEvents = this.todayEvents.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime());
      },
      error: () => {
        this.apiErrorService.toastMessage('Error', 'Failed to get sechedule', 'Error');
      }
    })
  }

  protected onSaveEvent(): void {
    const startDate = new Date(this.todayDate);
    startDate.setHours(this.addEvent.start.hour);
    startDate.setMinutes(this.addEvent.start.minute);

    const endDate = new Date(this.todayDate);
    endDate.setHours(this.addEvent.end.hour);
    endDate.setMinutes(this.addEvent.end.minute);

    const param: ScheduleReq = {
      title: this.addEvent.title,
      color: this.addEvent.color,
      start: startDate,
      end: endDate,
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

  protected onDeleteEvent(data: ScheduleResp): void {
    this.apiService.deleteSchedule(data.id).subscribe({
      next: () => {
        this.getAllEvent();
      }
    });
  }

}
