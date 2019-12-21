import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { BaseApi } from '../core/base-api';

@Injectable()
export class BillService extends BaseApi {

    constructor(public http: HttpClient){
        super(http);
    }

    getBill():Observable<Bill> {
        return this.get('bill');
    }

    getCurrency(base: string = 'EUR, USD, UAH'): Observable<any> {
        return this.http.get(`http://data.fixer.io/api/latest?access_key=6679e8357372364e708cea970900a083&symbols=${base}&format=1`)
    }

    updateBill(bill: Bill): Observable<Bill> {
        return this.put('bill', bill);
    }


}