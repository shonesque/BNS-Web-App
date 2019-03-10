import { Injectable } from "@angular/core";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";

import { Company } from "app/models/company";
import { resolve, reject } from "q";


@Injectable()
export class CompanyService {
    
    private databasePath = '/companies';
    companiesRef: AngularFireList<Company> = null;

    constructor(private db: AngularFireDatabase) {
        this.companiesRef = db.list(this.databasePath, 
            ref => ref.orderByChild('name').equalTo("Merck"));
    }

    increaseNumberOfUsedLicensesFor(userEmail: string): any {

        return new Promise((resolve, reject) => {
            this.companiesRef
            .valueChanges()
            .subscribe(companies => {
                let company = companies[0];
    
                let newNumberOfUsedLicenses = company.current_licenses + 1;
                if (newNumberOfUsedLicenses > company.max_licenses) {
                    reject("The current subscription has reached the maximum limit of licenses.");
                    return;
                }
    
                if (company.user_emails.indexOf(userEmail) > -1) {
                    resolve();
                    return;
                }
    
                company.user_emails.push(userEmail);
                let updatedUserEmailsArray = company.user_emails;
    
                this.db
                .object(this.databasePath + '/2')
                .update({
                    current_licenses: newNumberOfUsedLicenses,
                    user_emails: updatedUserEmailsArray
                })
                .then( () => {
                    resolve();
                });
            });
        });

        
    }
}
