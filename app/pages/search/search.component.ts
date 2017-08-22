import { Component } from '@angular/core';
import { Query } from '../common/query';
import { Api } from "../../core/api.service";
import { Headers } from '@angular/http';
import { IncomingService } from "../../core/incoming.service";
import { ListPage } from '../list/list';


@Component({
    selector: 'search-messages',
    templateUrl: 'search.component.html'
})
export class SearchPage {

    public domain: string;
    public sender: string;
    public recipient: string;
    public fromDate: string;
    public toDate: string;
    public selectedInterval: string;
    public queryInstance: Query = new Query();
    readonly endpoint = '/master/log/delivery/?client_username=intern&page=1&page_size=500&q=';

    constructor(public api: Api, public incService: IncomingService) {

    }

    public setSearchFilters(field: string, value: string){
        // TODO: implement function
        let query = new Query();
        let filters = query.filterEquals(field, value);
        return filters.slice(0);
    }

    public setDateFilters(fromDate: string, toDate: string) {
        let query = new Query();
        let filters = query.filters;
        filters.push({
            name: 'datetime',
            op: '>=',
            val: fromDate
        });
        filters.push({
            name: 'datetime',
            op: '<=',
            val: toDate
        });

        return filters;
    }

    public makeactive(state: string) {
        this.selectedInterval = state;
    }

    public formatDate(date: Date): string {

        let nowString = date.getFullYear() + "-" +
            (((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' +
            ((date.getDate() > 9) ? date.getDate()  : '0' + date.getDate() ) + "T" +
            date.getHours() + ":" + ((date.getMinutes() > 9) ? date.getMinutes()  : '0' + date.getMinutes());

        return nowString;
    }

    public pastDays(days: number) {

        let now = new Date();
        let then = new Date();
        let today = now.getDate();
        then.setSeconds(0);
        then.setDate(today - days);
        return this.setDateFilters(this.formatDate(then), this.formatDate(now));
    }

    public pastMonths(months: number) {
        let now = new Date();
        let then = new Date();
        then.setSeconds(0);
        then.setMonth(now.getMonth() - months);
        return this.setDateFilters(this.formatDate(then), this.formatDate(now));
    }

    public populateFields(): any[] {

        let fields = [
            "message_id",
            "domain",
            "datetime",
            "sender",
            "recipient",
            "main_class",
            "subject_header",
            "status",
            "filtering_host",
            "delivery_fqdn"
        ];

        return fields;
    }

    public searchMessages() {
        let filterList = [];

        if (this.domain != null) {
            filterList.push(this.setSearchFilters('domain', this.domain));
        }
        if (this.sender != null) {
            filterList.push(this.setSearchFilters('sender', this.sender));
        }
        if (this.recipient != null) {
            filterList.push(this.setSearchFilters('recipient', this.recipient));
        }
        if (this.selectedInterval != null) {
            if (this.selectedInterval == 'pastDay'){
                filterList.push(this.pastDays(1).slice(0));
            } else if (this.selectedInterval == 'pastWeek') {
                filterList.push(this.pastDays(7).slice(0));
            } else if (this.selectedInterval == 'pastMonth') {
                filterList.push(this.pastMonths(1).slice(0));
            }
        } else if (this.fromDate != null && this.toDate == null) {
            let date = new Date();
            this.toDate = this.formatDate(date);
            filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
        } else if (this.fromDate != null && this.toDate == null) {
            filterList.push(this.setDateFilters(this.fromDate, this.toDate).slice(0));
        }

        let filterstring = [];
        for (let i = 0; i < filterList.length; i++) {
            for (let j = 0; j < filterList[i].length; j++){
                filterstring.push(filterList[i][j]);
            }
        }

        let fields = this.populateFields();
        let query = JSON.stringify(this.queryInstance.createQuery(filterstring, fields,'message_id', false));
        let encodedQuery = encodeURI(query);
        let url = this.endpoint + encodedQuery;

        let headers = new Headers();

        return this.api.get(url, headers)
            .subscribe((data: any) => {
                console.log(data);
                let messages: any = JSON.parse(data._body);
                console.log(messages);
                this.incService.incomingMessages = messages.objects;
            });

    }
}