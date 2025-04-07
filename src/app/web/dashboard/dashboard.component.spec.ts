import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultComponent } from './dashboard.component';
import { ApiService } from '@service/api.service';
import { ApiErrorService } from '@service/api-error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, TemplateRef } from '@angular/core';
import { ScheduleResp } from '@core/model/schedule.model';

describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let apiErrorServiceSpy: jasmine.SpyObj<ApiErrorService>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getSchedule', 'postSchedule', 'deleteSchedule']);
    const errorSpy = jasmine.createSpyObj('ApiErrorService', ['toastMessage']);
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    await TestBed.configureTestingModule({
      declarations: [DefaultComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ApiErrorService, useValue: errorSpy },
        { provide: NgbModal, useValue: modalSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiErrorServiceSpy = TestBed.inject(ApiErrorService) as jasmine.SpyObj<ApiErrorService>;
    modalServiceSpy = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllEvent on init', () => {
    apiServiceSpy.getSchedule.and.returnValue(of([]));
    component.ngOnInit();
    expect(apiServiceSpy.getSchedule).toHaveBeenCalled();
  });

  it('should populate todayEvents based on today\'s date', () => {
    const now = new Date();
    const mockResp: ScheduleResp[] = [
      {
        id: 1,
        title: 'Meeting',
        color: 'blue',
        start: now,
        end: new Date(now.getTime() + 3600000)
      }
    ];
    apiServiceSpy.getSchedule.and.returnValue(of(mockResp));
    component.getAllEvent();

    expect(apiServiceSpy.getSchedule).toHaveBeenCalled();
    expect((component as any).todayEvents.length).toBe(1);
  });

  it('should call toastMessage on getAllEvent error', () => {
    apiServiceSpy.getSchedule.and.returnValue(throwError(() => new Error('API Error')));
    component.getAllEvent();
    expect(apiErrorServiceSpy.toastMessage).toHaveBeenCalledWith('Error', 'Failed to get sechedule', 'Error');
  });

  it('should open the edit modal onAddEvent', () => {
    component.editModel = {} as TemplateRef<any>;
    component.onAddEvent();
    expect(modalServiceSpy.open).toHaveBeenCalledWith(component.editModel, { centered: true });
  });

  it('should call postSchedule on onSaveEvent', () => {
    const mockScheduleResp: ScheduleResp = {
        id: 1,
        title: 'Mock Event',
        color: 'purple',
        start: new Date(),
        end: new Date()
      };
      
    apiServiceSpy.postSchedule.and.returnValue(of(mockScheduleResp));
    spyOn(component, 'getAllEvent');

    component.onSaveEvent();

    expect(apiServiceSpy.postSchedule).toHaveBeenCalled();
    expect(component.getAllEvent).toHaveBeenCalled();
  });

  it('should show toastMessage on postSchedule error', () => {
    apiServiceSpy.postSchedule.and.returnValue(throwError(() => new Error('Fail')));
    component.onSaveEvent();
    expect(apiErrorServiceSpy.toastMessage).toHaveBeenCalledWith('Error', 'Failed to save schedule.', 'Error');
  });

  it('should delete event and refresh event list', () => {
    const event: ScheduleResp = {
      id: 1,
      title: 'Event',
      color: 'green',
      start: new Date(),
      end: new Date()
    };
    apiServiceSpy.deleteSchedule.and.returnValue(of({}));
    spyOn(component, 'getAllEvent');

    component.onDeleteEvent(event);

    expect(apiServiceSpy.deleteSchedule).toHaveBeenCalledWith(event.id);
    expect(component.getAllEvent).toHaveBeenCalled();
  });
});
