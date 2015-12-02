/* global Meteor, Match, check, Roles, Accounts */
"use strict";

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
    search: function(query_text) {

        return HTTP.get( 'https://api.nutritionix.com/v2/autocomplete?q=' + encodeURIComponent(query_text), {
            headers: {
                "X-APP-ID":"d777a3a8",
                "X-APP-KEY":"c657dfac9946c562366e1d592ef3d97f"
            }
        });
    }

});
