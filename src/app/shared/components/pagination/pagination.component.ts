import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgbPaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pageSize = 10;
  @Input() collectionSize = 0;
  
  @Output() onChange = new EventEmitter<number>();
  
  page = 1;

  protected onPageChange($event: number) {
    this.onChange.next($event);
  }
}
