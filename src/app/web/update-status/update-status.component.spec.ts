import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateStatusComponent } from './update-status.component';
import { ApiService } from '@service/api.service';
import { ApiErrorService } from '@service/api-error.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UpdateStatusComponent', () => {
  let component: UpdateStatusComponent;
  let fixture: ComponentFixture<UpdateStatusComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let apiErrorServiceSpy: jasmine.SpyObj<ApiErrorService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['quickUpdate', 'pingScheduler']);
    const errorSpy = jasmine.createSpyObj('ApiErrorService', ['toastMessage']);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UpdateStatusComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: ApiErrorService, useValue: errorSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateStatusComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiErrorServiceSpy = TestBed.inject(ApiErrorService) as jasmine.SpyObj<ApiErrorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update status when onSelectStatus is called', () => {
    const newStatus = 'Busy';
    apiServiceSpy.quickUpdate.and.returnValue(of({ success: true }));

    component.onSelectStatus(newStatus);

    expect(component.status).toBe(newStatus);
    expect(apiServiceSpy.quickUpdate).toHaveBeenCalledWith(newStatus);
  });

  it('should log error on API error in updateStatus', () => {
    const consoleSpy = spyOn(console, 'error');
    apiServiceSpy.quickUpdate.and.returnValue(throwError(() => new Error('API failed')));

    component.updateStatus();

    expect(apiServiceSpy.quickUpdate).toHaveBeenCalledWith(component.status);
    expect(consoleSpy).toHaveBeenCalledWith('API error:', jasmine.any(Error));
  });

  it('should call toastMessage on successful pingScheduler', () => {
    const dummyUser = { email: 'test@example.com' };
    spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(dummyUser));
    apiServiceSpy.pingScheduler.and.returnValue(of({ message: 'ok' }));

    component.pingScheduler();

    expect(apiServiceSpy.pingScheduler).toHaveBeenCalledWith(dummyUser.email);
    expect(apiErrorServiceSpy.toastMessage).toHaveBeenCalledWith('Success', `Message will update according today's schedule`);
  });
});
