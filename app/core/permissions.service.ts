import { Injectable } from '@angular/core';
import { UserPermissions } from '../pages/permissions/userPermission';
import { StorageService } from './storage.service';

@Injectable()
export class PermissionService {

    permissions = {
        userType: '',
        userRole: '',
        messagesPages: {
            incoming: false,
            outgoing: false
        },
        actions: {
            release: false,
            whitelistAndRelease: false,
            releaseAndTrain: false,
            remove: false,
            blacklistAndRemove: false,
            purgeQuarantine: false
        },
        searchFilter: {
            domain: false,
            sender: false,
            recipient: false,
            dates: false
        }
    }

    constructor(public storage: StorageService) {

    }

    public setPermissions(userRole: string) {
        let permission = new UserPermissions(this);
        if (userRole == 'admin') {
            this.permissions = permission.userPermissions.admin;
        } else if (userRole == 'domain') {
            this.permissions = permission.userPermissions.domain;
        } else if (userRole == 'email') {
            this.permissions = permission.userPermissions.email;
        }
    }
}
