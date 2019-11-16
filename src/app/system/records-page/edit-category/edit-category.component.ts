import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../../shared/models/category.model';
import { CategoriesServices } from '../../shared/services/categories.service';

@Component({
  selector: 'wfm-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  public currentCategoryID = 1;
  public currentCategory: Category;

  constructor(private categoriesService: CategoriesServices) { }

  ngOnInit() {
    this.onCategoryChange();
  }

  onSubmit(form: NgForm){
    let {capacity, name} = form.value;
    if(capacity < 0) capacity *= -1;

    const category = new Category(name, capacity, +this.currentCategoryID);

    this.categoriesService.updateCategory(category)
      .subscribe((category: Category) => {
        console.log(category);
      });
  }

  onCategoryChange(){
    this.currentCategory = this.categories.find(c => c.id === +this.currentCategoryID);
    console.log(this.currentCategoryID);
  }

}
