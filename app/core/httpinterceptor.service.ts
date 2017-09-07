import { Injectable } from '@angular/core';
import { ConnectionBackend, Http, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Env } from './env';

@Injectable()
export class HttpInterceptor extends Http {
    public url: string;

    constructor(
        backend: ConnectionBackend,
        defaultOptions: RequestOptions
    ){
        super(backend, defaultOptions);
    }

    public action : any;

    public getURL(endpoint, hostname) {
        return this.url = Env.DEV_PROXY
            ? endpoint
            : 'https://' + hostname + endpoint;
    }

    public getRequestOptionsArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        let token = localStorage.getItem('token');
        if(token != null) {
            options.headers.append('HTTP-X-AUTH-TOKEN', token);
            //for the error with two tokens sent
            options.headers.set('HTTP-X-AUTH-TOKEN', token);
          //options.headers.append('Authorization', 'Bearer ' + token);
        }

        return options;
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<any>{
        return super.get(url, this.getRequestOptionsArgs(options));
    }

    public post( url: string, options?: RequestOptionsArgs , requestPayload?: any ): Observable<any>{

            return super.post(url, requestPayload, this.getRequestOptionsArgs(options));

    }

}