/* global Meteor, React, ReactMeteorData, Roles, assert */
"use strict";

Meteor.methods({
    'Profile.update.firstName': function(firstName) {
        console.log(firstName);
        assert(firstName.length > 0, 'First Name is not set');

        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.first_name": firstName}});
    }
});