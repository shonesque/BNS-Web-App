import { Injectable } from "@angular/core";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";

import { User } from "app/models/user";
import { resolve, reject } from "../../../../node_modules/@types/q";
import { query } from "../../../../node_modules/@angular/core/src/render3/query";


@Injectable()
export class UserService {

    private databasePath = '/users';
    usersRef: AngularFireList<User> = null;

    constructor(private db: AngularFireDatabase) {
        this.usersRef = db.list(this.databasePath);
    }

    createUser(user: User): any {

        this.db
            .list(this.databasePath, 
                ref => ref.orderByChild('email').equalTo(user.email))
            .valueChanges()
            .subscribe(userss => {
                let count = userss.length

                if(count == 0) {
                    this.usersRef
                    .push(user)
                    .then( result => {
                        console.log('Who dis?');
                        console.log(result);
                    });
                } else {
                    console.log(userss);
                }
            });
    }
    
    getUsersList(): AngularFireList<User> {
        return this.usersRef;
    }

    userWithEmailExists(email: string): boolean {

        let count = 0;
        

        return count > 0;
    }

    handleError(error): void {
        console.log(error);
    }
}