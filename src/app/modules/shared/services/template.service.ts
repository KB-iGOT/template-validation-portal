import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';
// import { environment } from '../../../../../src/environments/environment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl: string = (window['env' as any]['baseUrl' as any] as unknown as string);

  templateFile: any;
  templateError: any;
  userSelectedFile: any;

  constructor(private dataService: DataService) {}

  getEnvironmentUrl(): string {
    return this.baseUrl;
  }

  selectTemplates() {
    const reqParam = {
      url: 'template/api/v1/download/sampleTemplate',
    };
    return this.dataService.get(reqParam);
  }

  uploadTemplates(file: any) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const reqParam = {
      url: 'template/api/v1/upload',
      // headers: {
      //   "Authorization": localStorage.getItem("token")
      // },
      data: formData
    };
    return this.dataService.post(reqParam);
  }

  surveyCreation(file_path: any) {
    const reqParam = {
      url: 'template/api/v1/survey/create',
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
      url: 'template/api/v1/validate',
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
      url: `template/api/v1/survey/${extension}`,
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
