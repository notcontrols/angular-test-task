import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {delay, Observable, of, tap} from "rxjs";
import {Country} from "../enum/country";

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   console.log(`Intercepted request: ${req.url}`);

    const countryRegion = {
      [Country.Australia]: 'Australia',
      [Country.Poland]: 'Europe',
      [Country.Ukraine]: 'Europe',
      [Country.Austria]: 'Europe',
      [Country.USA]: 'America',
      [Country.Mexico]: 'America',
      [Country.Nepal]: 'Asia',
    }

    // Intercept requests and return mock responses
    if (req.url.endsWith('/api/regions') && req.method === 'POST') {
      const {country}: {country: Country} = req.body;
      return of(new HttpResponse({ status: 200, body: { region: countryRegion[country]} }));
    }
    if (req.url.endsWith('/api/checkUsername') && req.method === 'POST') {
      const {username} = req.body;
      return of(new HttpResponse({ status: 200, body: { isAvailable: username.includes('new') } }));
    }
    if (req.url.endsWith('/api/submitForm') && req.method === 'POST') {
      return of(new HttpResponse({ status: 200, body: { result: 'nice job' } }));
    }

    return of(new HttpResponse({ status: 404, body: { result: 'You are using the wrong endpoint'} }));
  }
}
