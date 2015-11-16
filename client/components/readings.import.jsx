/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Button, ButtonToolbar } = ReactBootstrap;

// An example of an application-specific component.

export default React.createClass({
    displayName: 'Readings',
    mixins: [ReactMeteorData],

    getMeteorData: function() {
        // Start a subscription and then fetch data. Return value will be
        // available under `this.data`, and when a reactive change happens
        // in Meteor, the function will be re-run and the component re-rendered.

        var user = Meteor.user();
        var subscriptionHandle = Meteor.subscribe("readings");

        return {
            loading: !subscriptionHandle.ready(),
            readings: Readings.find().fetch(),
            canWrite: user? Roles.userIsInRole(user, ['write', 'admin']) : false,
        };
    },

    render: function() {

        // Show loading indicator if subscriptions are still downloading

        if(this.data.loading) {
            return <Loading />;
        }

        return (
            <div>
                <h1 className="page-header">Readings</h1>
                <p className="help-block">
                    Watch the clock tick!
                </p>

                <div className="row">
                    <div className="col-md-4">
                        <Clock />
                    </div>
                    <div className="col-md-8">
                        <TimestampList readings={this.data.readings} />
                        {this.data.canWrite? (
                                <ButtonToolbar>
                                    <RecordNewButton />
                                    <ClearButton readings={this.data.readings} />
                                </ButtonToolbar>
                        ) : ""}
                    </div>
                </div>
            </div>
        );
    },

});

var Clock = React.createClass({
    displayName: "Clock",

    getInitialState: function() {
        return {
            now: moment()
        };
    },

    componentDidMount: function() {
        this.timer = setInterval(() => {
            this.setState({
                now: moment()
            });
        }, 500);
    },

    componentWillUnmount: function() {
        clearInterval(this.timer);
    },

    render: function() {
        return (
            <div className="clock">{this.state.now.format("hh:mm:ss")}</div>
        );
    }

});

var TimestampList = React.createClass({
    displayName: "TimestampList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        readings: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <ul className="timestamp-list">
                {this.props.readings.map(t => {
                    return (
                        <li key={t.time.getTime()}>{moment(t.time).format("hh:mm:ss")}: {t.name}</li>
                    );
                })}
            </ul>
        );
    }

});

var BGForm = React.createClass({
    getInitialState() {
      return {
          value: ''
      };
    },

    validationState() {
        let length = this.state.value.length;
        if(length > 10) return 'success';
        else if(length > 5);
    },

    render: function() {
        
    }
});

var RecordNewButton = React.createClass({
    displayName: "RecordNewButton",
    mixins: [React.addons.PureRenderMixin],

    render: function() {
        return (
            <Button bsStyle='success' onClick={this.newReading}>New Glucose Reading</Button>
        );
    },

    newReading: function() {
        var now = new Date();
        bootbox.prompt("Enter a name for this Glucose Reading", result => {
            if (result !== null) {
                // Updating the collection causes the reactive `getMeteorData()`
                // function at the top of the component hierarchy to re-run and
                // the components to re-render as required.

                Readings.insert({
                    time: now,
                    name: result
                });
            }
        });
    }

});

var ClearButton = React.createClass({
    displayName: "ClearButton",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        readings: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <Button bsStyle='danger' onClick={this.clearAll}>Clear all</Button>
        );
    },

    clearAll: function() {
        bootbox.confirm("Are you sure?", result => {
            if (result) {
                this.props.readings.forEach(t => {
                    Readings.remove(t._id);
                });
            }
        });
    }

});
