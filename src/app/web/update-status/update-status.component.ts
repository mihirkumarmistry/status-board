import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(private apiService: ApiService) {
  }

  onSelectStatus(status: string): void {
    this.status = status;
    this.updateStatus();
  }

  updateStatus(): void {
    const name = this.profName;
    const status = this.status;

    let formattedName = name.replace(/ /g, '+');
    let formattedStatus = status.replace(/ /g, '+');

    if (formattedName.length < 16) {
      const paddingLength = 16 - formattedName.length;
      formattedName += '+'.repeat(paddingLength);
    } else if (formattedName.length > 16) {
      formattedName = formattedName.substring(0, 16);
    }

    if (formattedStatus.length < 16) {
      const paddingLength = 16 - formattedStatus.length;
      formattedStatus += '+'.repeat(paddingLength);
    } else if (formattedStatus.length > 16) {
      formattedStatus = formattedStatus.substring(0, 16);
    }

    this.apiService.updateMessage(formattedName, formattedStatus);
  }

}
