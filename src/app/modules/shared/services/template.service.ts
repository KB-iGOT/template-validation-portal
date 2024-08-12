import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private environmentUrls = (window as any)["env"]?.baseUrls || {};
  private defaultBaseUrl = (window as any)["env"]?.baseUrl || '';

  private currentEnvironment: 'qa' | 'dev' | 'bm' | 'prod' = (window as any)["env"]?.currentEnvironment as 'qa' | 'dev' | 'bm' | 'prod';

  templateFile: any;
  templateError: any;
  userSelectedFile: any;

  constructor(private dataService: DataService) { }

  // Method to set the current environment
  setEnvironment(env: 'qa' | 'dev' | 'bm' | 'prod') {
    if (this.environmentUrls[env]) {
      this.currentEnvironment = env;
    } else {
      console.warn(`Environment "${env}" is not recognized.`);
    }
  }

  // Method to get the URL for the current environment
  getEnvironmentUrl(): string {
    return this.environmentUrls[this.currentEnvironment] || this.defaultBaseUrl;
  }

  selectTemplates() {
    const reqParam = {
      url: 'download/sampleTemplate',
    }
    return this.dataService.get(reqParam);
  }

  uploadTemplates(file: any) {

    const formData = new FormData();
    formData.append('file', file, file.name);
    const reqParam = {
      url: 'upload',
      // headers:{
      //   "Authorization":localStorage.getItem("token")
      // },
      data: formData
    }

    return this.dataService.post(reqParam);
  }

  surveyCreation(file_path: any) {
    const reqParam = {
      url: 'survey/create',
      data: { file: file_path }
    }
    return this.dataService.post(reqParam);
  }

  getErrorExcelSheet(){

    let templatePath = "/opt/backend/template-validation-portal-service/apiServices/src/main/tmp/Program_Template_latest_Final_--_30_12_2021_(6)1671623565-011165.xlsx"
    const reqParam = {
      url: 'errDownload',
      // headers:{
      //   "Authorization":localStorage.getItem("token")
      // }
    }
    let queryParams = new HttpParams();
    queryParams = queryParams.append("templatePath",templatePath);
    return this.dataService.get(reqParam,queryParams);

  }

  validateTemplates(templatePath: any, userUploadedFileType: any, templateLinks:any) {
    let templateCode
    templateLinks.forEach((templates:any) => {
      let templateName: any = (templates.templateName.split(/(?=[A-Z])/)).join(" ")
      if(userUploadedFileType == templateName){
        templateCode = templates?.templateCode;
      }
    });
   
    const reqParam = {
      url: 'validate',
      // headers:{
      //   "Authorization":localStorage.getItem("token")
      // },
      data: {
        request: {
          "templatePath": templatePath,
          "templateCode": JSON.stringify(templateCode) 
        }
      }
    }
    return this.dataService.post(reqParam);

    }

  getSurveySolutions(resourceType: string): Observable<any> {
    const reqParam = {
      url: 'survey/getSolutions',
      data: { resourceType: resourceType }
    };
    return this.dataService.post(reqParam);
  }

  downloadSurveySolutions(resourceType: string): Observable<any> {
    const reqParam = {
      url: 'survey/downloadSolutions',
      data: { resourceType: resourceType }
    };
    return this.dataService.post(reqParam);
  }

  // Method to generate the link for a solution ID
  getSolutionLink(solutionId: string): string {
    const baseUrl = this.getEnvironmentUrl(); // Fetch the base URL from the environment
    return `${baseUrl}surveyml/${solutionId}`;
  }
}
