import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateSelectionComponent } from './template-selection/template-selection.component';
import { ValidationResultComponent } from './validation-result/validation-result.component';
import { TemplateSuccessComponent } from './template-success/template-success.component';
import { MaterialModule } from 'src/app/material.module';
import { TemplateRoutingModule } from './template.routing.module';
import { TemplateReportComponent } from './template-report/template-report.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CustomTooltipDirective } from '../shared/directives/custom-tooltip.directive';
import { SharedModule } from '../shared/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider';
import { TemplateSolutionListComponent } from './template-solution-list/template-solution-list.component';

@NgModule({
  declarations: [
    TemplateSelectionComponent,
    ValidationResultComponent,
    TemplateSuccessComponent,
    TemplateReportComponent,
    TemplateSolutionListComponent // Add declaration
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TemplateRoutingModule,
    MatTooltipModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class TemplateModule { }
