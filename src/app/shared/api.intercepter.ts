import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment.development";

export const apiInterceptor: HttpInterceptorFn=(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>>=>{
    const apiReq = req.clone({ url: `${environment.apiUrl}/${req.url}` });
  return next(apiReq);
}