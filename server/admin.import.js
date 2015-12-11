/* global Meteor, Match, check, Roles, Accounts */
"use strict";

if(Meteor.isServer) {
    Accounts.onCreateUser((options, user) => {

        var first_name, last_name;

        if('facebook' in user.services){
            first_name = user.services.facebook.first_name;
            last_name = user.services.facebook.last_name;
        }

        if (options.profile) {
            user.profile = options.profile;
            user.profile.first_name = first_name;
            user.profile.last_name = last_name;
            user.profile.avatar = Avatar.getUrl(Meteor.user());
        }

        return user;
    });
}

Meteor.methods({

    /**
     * Create a new user with the given email address and send an enrolment
     * email.
     */
    createNewUser: function(email, role) {
        check(email, String);
        check(role, String);
        check(role, Match.OneOf('admin', 'read', 'write'));

        if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
            throw new Meteor.Error(403, "Permission denied");
        }

        var userId = Accounts.createUser({
            username: email,
            email: email
        });

        Roles.addUsersToRoles(userId, [role]);

        // Sends an email asking user to pick a password
        Accounts.sendEnrollmentEmail(userId);
    },
    autoComplete: function(query_text) {

        return HTTP.get( 'https://api.nutritionix.com/v2/autocomplete?q=' + encodeURIComponent(query_text), {
            headers: {
                "X-APP-ID":"d777a3a8",
                "X-APP-KEY":"c657dfac9946c562366e1d592ef3d97f"
            }
        });
    },
    search: function(query_text) {

        return HTTP.post('https://api.nutritionix.com/v1_1/search', {
            data: {
                "appId":"d777a3a8",
                "appKey":"c657dfac9946c562366e1d592ef3d97f",
                "query": query_text
            }
        });
    },
    getItem: function(item_id) {

        return HTTP.get( 'https://api.nutritionix.com/v1_1/item', {
            data: {
                "appId":"d777a3a8",
                "appKey":"c657dfac9946c562366e1d592ef3d97f",
                "id": item_id
            }
        });
    }
});
