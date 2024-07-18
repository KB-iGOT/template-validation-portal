import { Component, OnInit, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../shared/services/template.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { TableCellErrorDialogsComponent } from '../../shared/dialogs/table-cell-error-dialogs/table-cell-error-dialogs.component';

@Component({
  selector: 'app-validation-result',
  templateUrl: './validation-result.component.html',
  styleUrls: ['./validation-result.component.scss'],
})
export class ValidationResultComponent implements OnInit {
  highlight: boolean = false;
  data: MatTableDataSource<any> | undefined;
  columnNames: any;
  result: any;
  row: any;
  length: any;
  sheetarr: any;
  wsname: any;
  wbfile: any;
  advancedErrorList: Array<any> = [];
  basicErrorsList: Array<any> = [];
  rowErrorsList: Array<any> = [];
  fileName: string = 'SheetJS.xlsx';
  errors: any;
  selectedSheet: any;
  headers: any;
  isUserLogin: boolean = false;
  columnIdentifier: any;
  validateresult: boolean = false

  tooltipTemplate!: TemplateRef<any>;
  isCreateSurveyDisabled: boolean = false; // Initialize as false
  totalErrors: number = 0;
  errorsCountPerSheet: { [key: string]: number } = {}; // Object to store error counts per sheet

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private templateService: TemplateService,
    private authService: AuthenticationService,
    private _location: Location,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.errors = this.templateService.templateError;
    this.onFileChange(this.templateService.templateFile);
    this.isUserLogin = this.authService.isUserLoggedIn();
  }

  copyToClipBoard(error1: any, error2: any) {
    const textToCopy = (error1 || '') + (error2 || '');
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.toastr.success('Error copied successfully.', 'Success');
    }, () => {
      console.error('Failed to copy');
    });
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  onLogout() {
    this.authService.logoutAccount();
    this.isUserLogin = false;
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }

  getOpenStatus(status?: boolean): boolean {
    return status ? !status : false;
  }

  openDialog(error1: any, error2: any) {
    const dialogRef = this.dialog.open(TableCellErrorDialogsComponent, {
      data: { content: (error1 || '') + (error2 || '') },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onFileChange(evt: any) {
    if (!this.errors) {
      this.router.navigate(['/template/template-selection']);
      return; // Exit early if no errors are present
    }

    const target: DataTransfer = <DataTransfer>(evt);
    const reader: FileReader = new FileReader();

    this.readFile(target, reader).subscribe((data) => {
      this.initializeTableData(data);
    });
  }

  getErrorsList(column: any, index: number): any {
    let item;
    if (this.advancedErrorList.length) {
      item = this.advancedErrorList.map((element: any): any => {
        if ((element.rowNumber === index || (Array.isArray(element.rowNumber) && element.rowNumber.includes(index))) && this.columnIdentifier[column] === element.columnName) {
          
          return { error: element.errMessage, suggestion: element.suggestion };
        }
      }).filter((element: any) => element);
    }
    return item;
  }

  getBasicErrors(column: any, index: number) {
    let item: any = [];
    if (this.basicErrorsList.length) {
      item = this.basicErrorsList.map((element: any): any => {
        if ((element.rowNumber === index || (Array.isArray(element.rowNumber) && element.rowNumber.includes(index))) && this.columnIdentifier[column] === element.columnName) {
          
          return { error: element.errMessage, suggestion: element.suggestion };
        }
      }).filter((element: any) => element);
    }
    if (this.rowErrorsList.length > 0) {
      this.rowErrorsList.forEach((element: any) => {
        if ((element.rowNumber === index || (Array.isArray(element.rowNumber) && element.rowNumber.includes(index)))) {
          item.push({ error: element.errMessage, suggestion: element.suggestion });
        }
      });
    }
    return item;
  }

  isContainsError(column: any, ele: any, row: any, index: number) {
    if (this.rowErrorsList.length > 0) {
      const item = this.rowErrorsList.find((element: any) => {
        return (Array.isArray(element.rowNumber) && element.rowNumber.includes(index)) || (element.rowNumber === index);
      });
      if (item) {
        return true;
      }
    }
    if (this.advancedErrorList.length || this.basicErrorsList.length) {
      const advancedErrors: any = this.advancedErrorList.find((element: any) => (Array.isArray(element.rowNumber) ? element.rowNumber.includes(index) : element.rowNumber === index) && this.columnIdentifier[column] === element.columnName);
      const basicErrors: any = this.basicErrorsList.find((element: any) => (Array.isArray(element.rowNumber) ? element.rowNumber.includes(index) : element.rowNumber === index) && this.columnIdentifier[column] === element.columnName);
      return advancedErrors || basicErrors ? true : false;
    }
    return false;
  }

  readFile(target: DataTransfer, reader: FileReader): Observable<any> {
    const sub = new Subject<any>();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      this.wbfile = wb;
      this.sheetarr = wb.SheetNames;
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data: any = XLSX.utils.sheet_to_json(ws);
      sub.next(data);
      sub.complete();
      this.onClickSheetName(wb.SheetNames[1]);
    };

    reader.readAsBinaryString(target.files[0]);

    return sub.asObservable();
  }

  isSlectedSheet(s: any): boolean {
    return s === this.selectedSheet;
  }

  onClickSheetName(s: any) {
    const wsname: string = s;
    const ws: XLSX.WorkSheet = this.wbfile.Sheets[wsname];
    const data: any = XLSX.utils.sheet_to_json(ws);
    this.headers = data[0];
    this.columnIdentifier = data[0];
    this.columnNames = Object.keys(data[0]);
    this.data = new MatTableDataSource(data);
    this.selectedSheet = s;

  
    

    this.advancedErrorList = this.errors.advancedErrors.data.filter((item: any) => item.sheetName === this.selectedSheet);
    this.basicErrorsList = this.errors.basicErrors.data.filter((item: any) => item.sheetName === this.selectedSheet);
    this.rowErrorsList = [...this.basicErrorsList.filter((element: any) => element.columnName.length === 0), ...this.advancedErrorList.filter((element: any) => element.columnName.length === 0)];

    // Update the error count for the current sheet


    this.errorsCountPerSheet[this.selectedSheet] = this.getTotalErrorsForSheet();

    // Recalculate total errors across all sheets
    this.calculateTotalErrors();
  }

  firstRow(index: any): boolean {
    return index === 0;
  }

  export(): void {
    XLSX.writeFile(this.wbfile, `${this.fileName}`);
    this.toaster.success('Downloaded successfully');
  }

  errorExcelDownload(): void {
    window.open(this.errors.errFileLink, '_blank');
    this.toaster.success('Downloaded successfully');
  }

  getTotalErrors(): number {
    return this.sheetarr.reduce((total: number, sheetName: string) => total + this.errorsCountPerSheet[sheetName], 0);
  }

  getTotalErrorsForSheet(): number {
    return this.advancedErrorList.length + this.basicErrorsList.length + this.rowErrorsList.length;
  }

  calculateTotalErrors(): void {
    this.totalErrors = 0;
    for (const sheetName of this.sheetarr) {
      if (this.errorsCountPerSheet[sheetName]) {
        this.totalErrors += this.errorsCountPerSheet[sheetName];
      }
    }
  }

  hasErrors(): boolean {
    return this.getTotalErrors() > 0;
  }

 noErrorsInAllSheets(): boolean {
  return this.sheetarr.every((sheetName: string) => {
    console.log(this.validateresult,"dbhujsbfhsjufbnbgijngijdr")
    console.log(!(this.errorsCountPerSheet[sheetName] === 0) || !(this.validateresult))

    return !(this.errorsCountPerSheet[sheetName] === 0) || !(this.validateresult) 
  });
}

// noErrorsInAllSheets(): boolean {
//   console.log(this.validateresult)
//   return this.validateresult
// }

  goBack(): void {
    this._location.back();
  }

  initializeTableData(data: any) {
    const wsname: string = this.wbfile.SheetNames[0];
    const ws: XLSX.WorkSheet = this.wbfile.Sheets[wsname];
    const tableData: any = XLSX.utils.sheet_to_json(ws);
    this.headers = tableData[0];
    this.columnIdentifier = tableData[0];
    this.columnNames = Object.keys(tableData[0]);
    this.data = new MatTableDataSource(tableData);
    this.selectedSheet = this.wbfile.SheetNames[0];
    this.validateresult = this.errors.advancedErrors.data.some((item: any) => item.sheetName);
    this.validateresult = this.errors.basicErrors.data.some((item: any) => item.sheetName);
    if (this.errors.advancedErrors.data.length > 0||this.errors.basicErrors.data.length >0){
      console.log("Entering")
      this.validateresult=true

    }
    console.log(this.errors.basicErrors.data,"Basic errors")
    // Update the error lists based on the selected sheet


    this.advancedErrorList = this.errors.advancedErrors.data.filter((item: any) => item.sheetName === this.selectedSheet);
    console.log(this.selectedSheet,"selected sheet")
    console.log(this.errors.advancedErrors.data,"errors.data")
    console.log(this.advancedErrorList,"advanced errors")
    console.log(this.validateresult,"validateresult")
    this.basicErrorsList = this.errors.basicErrors.data.filter((item: any) => item.sheetName === this.selectedSheet);
    this.rowErrorsList = [...this.basicErrorsList.filter((element: any) => element.columnName.length === 0), ...this.advancedErrorList.filter((element: any) => element.columnName.length === 0)];

    // Initialize the errors count for each sheet
    this.sheetarr.forEach((sheetName: string) => {
      this.errorsCountPerSheet[sheetName] = this.getTotalErrorsForSheet();
      
    });

    // Calculate total errors across all sheets
    this.calculateTotalErrors();
  }
}

