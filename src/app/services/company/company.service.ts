import { Injectable } from "@angular/core";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";

import { Company } from "app/models/company";


@Injectable()
export class CompanyService {
    
    private databasePath = '/company';
    companiesRef: AngularFireList<Company> = null;

    constructor(private db: AngularFireDatabase) {
        this.companiesRef = db.list(this.databasePath);
    }

    increaseNumberOfUsedLicenses(): void {
        console.log("increaseNumberOfUsedLicenses");
        // this.updateCompany("current_licenses", );
    }

    updateCompany(key: string, value: any): void {
        this.companiesRef.update(key, value).catch(error => this.handleError(error));
    }

    handleError(error): void {
        console.log(error);
    }
}
