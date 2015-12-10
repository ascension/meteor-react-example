/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Input, Button, ButtonToolbar, Image, Row, Glyphicon } = ReactBootstrap;

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
        <div className='profile-page' style={{marginTop: '75px'}}>
            <ProfileBlock />
            <div className="tide-row tide-expand">
                General
                <Glyphicon glyph="chevron-down" style={{float: 'right'}}/>
            </div>
            <div className="profile">
                <div className="form-horizontal tide-input">
                    <div className="form-group">
                        <div className="col-xs-5">
                            <label>First Name</label>
                        </div>
                        <div className="col-xs-7">
                            <input
                                value={this.state.first_name}
                                type="text"
                                placeholder="First Name"
                                onChange={this.updateFirstName}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-xs-5">
                            <label>Last Name</label>
                        </div>
                        <div className="col-xs-7">
                            <input
                                value={this.state.last_name}
                                type="text"
                                placeholder="Last Name"
                                onChange={this.updateLastName}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-xs-5">
                            <label>Max Target Range</label>
                        </div>
                        <div className="col-xs-7">
                            <input
                                value={this.state.max_bg_limit}
                                type="text"
                                placeholder="Blood Glucose Max Target"
                                onChange={this.updateMaxBgLimit}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-xs-5">
                            <label>Min Target Range</label>
                        </div>
                        <div className="col-xs-7">
                            <input
                                value={this.state.min_bg_limit}
                                type="text"
                                placeholder="Blood Glucose Min Target"
                                onChange={this.updateMinBgLimit}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        );
    }
});

export var ProfileBlock = React.createClass({
    displayName: "Profile",

    render: function(){
        return (
            <div className="profile-block">
            </div>
        );
    }
});
