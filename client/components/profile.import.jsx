/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Input, Button, ButtonToolbar, Image } = ReactBootstrap;

export default React.createClass({
    displayName: "Profile",

    getInitialState: function() {
        return {
            first_name: Meteor.user().profile.first_name,
            last_name: Meteor.user().profile.last_name,
            max_bg_limit: Meteor.user().profile.max_bg_limit,
            min_bg_limit: Meteor.user().profile.min_bg_limit,
        };
    },

    updateFirstName: function(event) {
        var firstName = event.target.value;
        this.setState({first_name: firstName});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.first_name": firstName}})
    },

    updateLastName: function(event) {
        var lastName = event.target.value;
        this.setState({last_name: lastName});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.last_name": lastName}})
    },

    updateMaxBgLimit: function(event) {
        var maxBgLimit = parseInt(event.target.value);
        this.setState({max_bg_limit: maxBgLimit});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.max_bg_limit": maxBgLimit}})
    },

    updateMinBgLimit: function(event) {
        var minBgLimit = parseInt(event.target.value);
        this.setState({min_bg_limit: minBgLimit});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.min_bg_limit": minBgLimit}})
    },

    render: function() {
        return (
        <div>
            <div className="row profile">
                <div className="col-md-4 col-md-offset-4 form-horizontal tide-input">
                    <Input type="text"
                           value={this.state.first_name}
                           placeholder="First Name"
                           label="First Name"
                           hasFeedback
                           ref="input"
                           labelClassName="label-class col-xs-3"
                           wrapperClassName="col-xs-9"
                           groupClassName="group-class"
                           onChange={this.updateFirstName}/>

                    <Input type="text"
                           value={this.state.last_name}
                           placeholder="Last Name"
                           label="Last Name"
                           hasFeedback
                           ref="input"
                           groupClassName="group-class"
                           labelClassName="label-class col-xs-3"
                           wrapperClassName="col-xs-9"
                           onInput={this.updateLastName}/>

                    <Input type="text"
                           value={this.state.max_bg_limit}
                           placeholder="Blood Glucose Max Target"
                           label="Last Name"
                           hasFeedback
                           ref="input"
                           groupClassName="group-class"
                           labelClassName="label-class col-xs-3"
                           wrapperClassName="col-xs-9"
                           onInput={this.updateMaxBgLimit}/>

                    <Input type="text"
                           value={this.state.min_bg_limit}
                           placeholder="Blood Glucose Min Target"
                           label="Last Name"
                           hasFeedback
                           ref="input"
                           groupClassName="group-class"
                           labelClassName="label-class col-xs-3"
                           wrapperClassName="col-xs-9"
                           onInput={this.updateMinBgLimit}/>
                </div>
            </div>
        </div>

        );
    }
});