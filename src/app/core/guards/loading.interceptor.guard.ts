// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { SpinnerService } from '@coreweb/spinner.service';
// import { Observable } from 'rxjs';
// import { finalize } from 'rxjs/operators';

// @Injectable({ providedIn: 'root' })
// export class LoadingInterceptor implements HttpInterceptor {
//   constructor(private spinner: SpinnerService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     this.spinner.show();
//     return next.handle(req).pipe(
//       finalize(() => {
//         this.spinner.hide();
//       })
//     );
//   }
// }
