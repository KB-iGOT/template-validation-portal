import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl: any = window['env' as any]['baseUrl' as any];
  private apiBasePath: string = 'template/api/v1/'; // Global variable for API path

  templateFile: any;
  templateError: any;
  userSelectedFile: any;

  constructor(private dataService: DataService) {}

  getEnvironmentUrl(): string {
    return this.baseUrl;
  }

  selectTemplates() {
  console.log(this.apiBasePath, "Template service line no. 24: apiBasePath");
  console.log(this.baseUrl, "Template service line no. 25: baseUrl");
    const reqParam = {
      url: `${this.apiBasePath}download/sampleTemplate`,
    };
    console.log(reqParam, "Template service line no. 29: reqParam");
    return this.dataService.get(reqParam);
  }

  uploadTemplates(file: any) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const reqParam = {
      url: `${this.apiBasePath}upload`,
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // },
      data: formData
    };
    return this.dataService.post(reqParam);
  }

  surveyCreation(file_path: any) {
    const reqParam = {
      url: `${this.apiBasePath}survey/create`,
      data: {
        file: file_path,
      },
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // }
    };
    return this.dataService.post(reqParam);
  }

  getErrorExcelSheet() {
    let templatePath = "/opt/backend/template-validation-portal-service/apiServices/src/main/tmp/Program_Template_latest_Final_--_30_12_2021_(6)1671623565-011165.xlsx";
    const reqParam = {
      url: 'errDownload',
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // }
    };
    let queryParams = new HttpParams();
    queryParams = queryParams.append("templatePath", templatePath);
    return this.dataService.get(reqParam, queryParams);
  }

  validateTemplates(templatePath: any, userUploadedFileType: any, templateLinks: any) {
    let templateCode;
    templateLinks.forEach((templates: any) => {
      let templateName: any = (templates.templateName.split(/(?=[A-Z])/)).join(" ");
      if (userUploadedFileType == templateName) {
        templateCode = templates?.templateCode;
      }
    });

    const reqParam = {
      url: `${this.apiBasePath}validate`,
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // },
      data: {
        request: {
          "templatePath": templatePath,
          "templateCode": JSON.stringify(templateCode)
        }
      }
    };
    return this.dataService.post(reqParam);
  }

  getSurveySolutions(resourceType: string, extension: string): Observable<any> {
    return this.dataService.post({
      url: `${this.apiBasePath}survey/${extension}`,
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // },
      data: { resourceType: resourceType }
    });
  }

  getSolutionLink(solutionId: string): string {
    const baseUrl = this.getEnvironmentUrl();
    return `${baseUrl}surveyml/${solutionId}`;
  }
}
