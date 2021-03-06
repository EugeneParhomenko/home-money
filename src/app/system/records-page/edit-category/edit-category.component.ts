import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../shared/models/category.model';
import { CategoriesServices } from '../../shared/services/categories.service';
import { Message } from 'src/app/shared/models/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wfm-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  public currentCategoryID = 1;
  public currentCategory: Category;
  public message: Message;

  constructor(private categoriesService: CategoriesServices) { }

  sub1: Subscription;

  ngOnInit() {
    this.message = new Message('success', '')
    this.onCategoryChange();
  }

  onSubmit(form: NgForm){
    let {capacity, name} = form.value;
    if(capacity < 0) capacity *= -1;

    const category = new Category(name, capacity, +this.currentCategoryID);

    this.sub1 = this.categoriesService.updateCategory(category)
      .subscribe((category: Category) => {
        this.onCategoryEdit.emit(category);
        this.message.text = 'Категория успешно отредактирована';
        window.setTimeout(() => this.message.text = '', 5000);
      });
  }

  onCategoryChange(){
    this.currentCategory = this.categories.find(c => c.id === +this.currentCategoryID);
    console.log(this.currentCategoryID);
  }

  ngOnDestroy(){
    if(this.sub1) this.sub1.unsubscribe();
  }

}
