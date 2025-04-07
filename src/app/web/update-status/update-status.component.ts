import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-status.component.html',
  styleUrl: './update-status.component.scss'
})
export class UpdateStatusComponent {
  range: number[] = Array.from({ length: 16 }, (_, i) => i);
  profName: string = "Prof. Miguel";
  status: string = "In Class"
  messgaeList: string[] = ["In A Meeting", "Available", "Busy", "Out Of Office", "In Class", "On Break", "Do Not Disturb", "Available Soon"];

  constructor(
    private apiService: ApiService,
    private apiErrorService: ApiErrorService
  ) {
  }

  onSelectStatus(status: string): void {
    this.status = status;
    this.updateStatus();
  }

  updateStatus(): void {
    this.apiService.quickUpdate(this.status).subscribe({
      next: res => console.log('API success:', res),
      error: err => console.error('API error:', err)
    });
  }

  pingScheduler(): void {
    let user = JSON.parse(sessionStorage.getItem('user')); 
    this.apiService.pingScheduler(user.email).subscribe({
      next: (resp) => {
        this.apiErrorService.toastMessage('Success', 'Message will update according today\'s schedule');
      }
    })
  }

}
