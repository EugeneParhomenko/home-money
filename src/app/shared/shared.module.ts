import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    imports: [
        ReactiveFormsModule, 
        NgxChartsModule, 
        FormsModule
    ],
    exports: [
        ReactiveFormsModule, 
        NgxChartsModule, 
        FormsModule
    ]
})
export class SharedModule {}