import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ApiErrorService {
    config: any = {
        closeButton: true,
        positionClass: 'toast-bottom-right'
    }
    constructor(private toastr: ToastrService) { }

    // Toastr message
    public toastMessage(type: 'Success' | 'Info' | 'Warning' | 'Error' = 'Success', message: string, title?: string): void {
        switch (type) {
            case 'Success':
                this.toastr.success(message, title, this.config);
                break;
            case 'Info':
                this.toastr.info(message, title, this.config);
                break;
            case 'Warning':
                this.toastr.warning(message, title, this.config);
                break;
            case 'Error':
                this.toastr.error(message, title, this.config);
                break;
            default:
                console.log(message);
                break;
        }
    }
    
    // handle errors
    public handleErrors(error: any): void {
        if (error.status === 400) {
            console.error('Bad Request:', error.error?.message || 'Invalid input');
            alert('Bad Request: Please check your input.');
        } else if (error.status === 401) {
            console.error('Unauthorized:', error.error?.message || 'Unauthorized access');
            alert('Unauthorized: Please log in.');
        } else if (error.status === 403) {
            console.error('Forbidden:', error.error?.message || 'Access denied');
            alert('Forbidden: You do not have permission.');
        } else if (error.status === 404) {
            console.error('Not Found:', error.error?.message || 'Resource not found');
            alert('Not Found: The requested resource was not found.');
        } else if (error.status === 500) {
            console.error('Internal Server Error:', error.error?.message || 'Something went wrong');
            alert('Server Error: Please try again later.');
        } else {
            console.error('Unexpected Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }
}
