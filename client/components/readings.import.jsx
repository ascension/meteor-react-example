/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Input, Button, ButtonToolbar } = ReactBootstrap;

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

                <div className="row">
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-8">
                        <BGForm />

                        <ReadingsList readings={this.data.readings} />
                    </div>
                </div>
            </div>
        );
    },

});

var ReadingsList = React.createClass({
    displayName: "ReadingsList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        readings: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <ul className="readings-list">
                {this.props.readings.map(t => {
                    return (
                        <li key={t.created_at}>{moment(t.created_at).format("hh:mm:ss")}: {t.reading}</li>
                    );
                })}
            </ul>
        );
    }

});



var RecordNewButton = React.createClass({
    displayName: "RecordNewButton",
    mixins: [React.addons.PureRenderMixin],

    render: function() {
        return (
            <Button bsStyle='success' onClick={this.props.onClick}>New Glucose Reading</Button>
        );
    },



});

var BGForm = React.createClass({
        getInitialState: function() {
            return {
                value: ''
            };
        },

        setInitialState: function() {
          return {
              value: ''
          };
        },

        validationState: function() {
            let length = this.state.value.length;
            if(length > 10) return 'success';
            else if(length > 5) return 'warning';
            else if(length > 5) return 'error';
        },

        handleChange: function() {
            this.setState({
                value: this.refs.input.getValue()
            });
        },

        render: function() {
            return (
                <div>
                    <Input
                        type="text"
                        value={this.state.value}
                        placeholder="Please enter a Blood Glucose Reading"
                        label="Test"
                        hasFeedback
                        ref="input"
                        groupClassName="group-class"
                        labelClassName="laabel-class"
                        onChange={this.handleChange}
                        />
                    <RecordNewButton onClick={this.newReading} />
                </div>
            );
        },

        newReading: function() {
            var now = new Date();

            Readings.insert({
                created_at: now,
                label: '',
                reading: this.state.value
            });

            this.state.value = '';
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
