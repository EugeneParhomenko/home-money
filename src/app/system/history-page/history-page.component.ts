import { Component, OnInit } from '@angular/core';
import { CategoriesServices } from '../shared/services/categories.service';
import { EventsService } from '../shared/services/events.service';
import { Subscription, combineLatest } from 'rxjs';
import { Category } from '../shared/models/category.model';
import { WFMEvent } from '../shared/models/event.model';
import * as moment from 'moment';

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  s1: Subscription;
  isLoaded = false;
  chartData = [];

  isFilterVisible = false;

  categories: Category[] = [];
  events: WFMEvent[] = [];
  filteredEvents: WFMEvent[] = [];

  constructor(
    private categoriesService: CategoriesServices,
    private eventService: EventsService
    ) { }

  ngOnInit() {
    this.s1 = combineLatest(
      this.categoriesService.getCategories(),
      this.eventService.getEvents()
    ).subscribe(([Category, WFMEvent]) => {
      this.categories = Category;
      this.events = WFMEvent;

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    });
  }

  calculateChartData():void {
    this.chartData = [];

    this.categories.forEach((cat) => {
      const catEvents = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
        name: cat.name,
        value: catEvents.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents.filter((e) => {
      return filterData.types.indexOf(e.type) !== -1;
    }).filter((e) => {
      return filterData.categories.indexOf(e.category.toString()) !== -1;
    }).filter((e) => {
      const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
      return momentDate.isBetween(startPeriod, endPeriod);
    });

    this.calculateChartData();

  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy() {
    if(this.s1) {
      this.s1.unsubscribe();
    }
  }

}
