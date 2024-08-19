import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TemplateService } from '../../shared/services/template.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'table-pagination-example',
  styleUrls: ['template-solution-list.component.css'],
  templateUrl: 'template-solution-list.component.html',
})
export class TemplateSolutionListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['solutionId', 'solutionName', 'startDate', 'endDate', 'action'];
  dataSource = new MatTableDataSource<any>();
  resourceType: string = ""

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private templateService: TemplateService,
    private router: Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.fetchSolutions();
  }

  fetchSolutions() {
    this.templateService.getSurveySolutions(this.resourceType, 'getSolutions').subscribe(
      (response: any) => {
        if (response.status === 200 && response.code === "Success") {
          this.dataSource.data = response.SolutionList.map((item: any) => ({
            solutionId: item.SOLUTION_ID,
            solutionName: item.SOLUTION_NAME,
            startDate: item.START_DATE,
            endDate: item.END_DATE
          }));
        } else {
          this.toastr.error('Failed to load solutions');
        }
      },
      (error: any) => {
        console.error('Error fetching solutions:', error);
        this.toastr.error('An error occurred while fetching solutions');
      }
    );
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.solutionId.toLowerCase().includes(filter) ||
             data.solutionName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  copyLink(solutionId: string) {
    const environmentUrl = this.templateService.getEnvironmentUrl(); // Fetch the base URL from the service
    const link = `${environmentUrl}surveyml/${solutionId}`; // Corrected template literal
    navigator.clipboard.writeText(link).then(
      () => this.toastr.success('Link copied to clipboard!'),
      (err) => this.toastr.error('Failed to copy link')
    );
  }
}
