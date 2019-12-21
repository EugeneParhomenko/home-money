import { Component, OnInit, OnDestroy } from '@angular/core';
import { BillService } from '../shared/services/bill.service';
import { CategoriesServices } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Subscription, combineLatest } from 'rxjs';
import { Bill } from '../shared/models/bill.model';
import { Category } from '../shared/models/category.model';
import { WFMEvent } from '../shared/models/event.model';

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {
  
  isLoaded = false;
  s1: Subscription;

  bill: Bill;
  categories: Category[] = [];
  events: WFMEvent;

  constructor(
    private billService:BillService, 
    private categoriesService: CategoriesServices,
    private eventsServices: EventsService
    ) { }

  ngOnInit() {
    this.s1 = combineLatest(
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventsServices.getEvents()
    ).subscribe(([billS, catS, eventS]) => {
      this.bill = billS;
      this.categories = catS;
      this.events = eventS;

      this.isLoaded = true;
    });
  }

  getCategoryCost(cat: Category): number {
    const catEvents = this.events.filter(e => e.category === cat.id && e.type === 'outcome');
    return catEvents.reduce((total, e) => {
      debugger;
      total += e.amount;
      return total;
    }, 0);
  }

  ngOnDestroy() {
    if(this.s1) {
      this.s1.unsubscribe();
    }
  }

}
