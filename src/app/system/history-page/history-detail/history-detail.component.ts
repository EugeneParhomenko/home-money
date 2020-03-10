import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventsService } from '../../shared/services/events.service';
import { CategoriesServices } from '../../shared/services/categories.service';
import { concatMap } from 'rxjs/operators';
import { WFMEvent } from '../../shared/models/event.model';
import { Category } from '../../shared/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wfm-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: WFMEvent;
  category: Category;

  isLoaded = false;
  s1: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private categoriesService: CategoriesServices
    ) { }

  ngOnInit() {
    this.s1 = this.route.paramMap.pipe(
      concatMap((params: ParamMap) => this.eventsService.getEventById(params.get('id'))),
      concatMap((event: WFMEvent) => {
          this.event = event;
          return this.categoriesService.getCategoryById(event.category);
      })).subscribe((category: Category) => {
        this.category = category;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    if(this.s1) {
      this.s1.unsubscribe();
    }
  }

}
