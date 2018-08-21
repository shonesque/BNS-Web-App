import { Injectable } from "@angular/core";
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";

import { User } from "app/models/user";


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
            .subscribe(users => {

                let count = users.length
                if (count > 0) {
                    return;
                }

                this.usersRef.push(user);
            });
    }
    
    getUsersList(): AngularFireList<User> {
        return this.usersRef;
    }

    handleError(error): void {
        console.log(error);
    }
}