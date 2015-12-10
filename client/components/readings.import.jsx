/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap, Swipeable, SwipeToRevealOptions } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Input, Button, ButtonToolbar } = ReactBootstrap;

// An example of an application-specific component.

export default React.createClass({
    displayName: 'Readings',
    mixins: [ReactMeteorData],
    getInitialState: function() {
        return {
            value: ''
        };
    },
    getMeteorData: function() {
        // Start a subscription and then fetch data. Return value will be
        // available under `this.data`, and when a reactive change happens
        // in Meteor, the function will be re-run and the component re-rendered.

        var user = Meteor.user();
        var subscriptionHandle = Meteor.subscribe("readings");

        return {
            loading: !subscriptionHandle.ready(),
            readings: Readings.find({}, {sort: {created_at: -1}}).fetch(),
            canWrite: user? Roles.userIsInRole(user, ['write', 'admin']) : false,
        };
    },
    render: function() {

        // Show loading indicator if subscriptions are still downloading

        if(this.data.loading) {
            return <Loading />;
        }

        return (
            <div style={{marginTop: '75px'}}>
                <div>
                    <BGForm />
                </div>
                <div className="reading-rows" style={{marginBottom: "20px"}}>
                    <ReadingsList readings={this.data.readings} />
                </div>
            </div>
        );
    },

});

var SampleComponent = React.createClass({
    displayName: "SampleComponent",
    swipingUp: function() {
        console.log('Swiped!');
    },
    render: function () {
        return (
            <Swipeable
                onSwipedRight={()=>this.swipingUp()}>
                <div style={{height: "250px"}}>
                    This element can be swiped
                </div>
            </Swipeable>
        )
    }
});

var NutritionSearch = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            search: [{}],
            searchTimeout: ''
        };
    },
    setInitialState: function() {
        return {
            value: '',
            search: [{}],
            searchTimeout: ''
        };
    },
    performSearch: function() {
        var searchValue = this.refs.nux_search.getValue();

        var component = this;

        var timeoutId = setTimeout(function(){
            if(component.state.searchTimeout)
            {
                component.setState({value: component.refs.nux_search.getValue(), search: component.state.search, searchTimeout: ''});
                Meteor.call('search',  component.refs.nux_search.getValue(),
                    function(error, data){
                        console.log(data.data.hits);
                        component.setState(
                            {value: component.refs.nux_search.getValue(), search: data.data.hits, searchTimeout: ''}
                        );

                    }
                );
            }

        },400);

        this.setState({value: searchValue, search: this.state.search, searchTimeout: timeoutId});
    },


    render: function() {
        return (
            <div>
                <Input
                    type="text"
                    value={this.state.value}
                    placeholder="Search for food item"
                    hasFeedback
                    ref="nux_search"
                    groupClassName="group-class"
                    labelClassName="laabel-class"
                    onChange={this.performSearch}
                    />
                <NutritionList results={this.state.search}/>
            </div>
        );
    }
});

var NutritionList = React.createClass({
    displayName: "NutritionList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        results: React.PropTypes.object
    },

    render: function() {
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Item</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.props.results.map(function(t){
                    return (
                        <NutritionItem item={t}/>
                    );
                })}
                </tbody>
            </table>
        );
    }
});

var NutritionItem = React.createClass({
    selectItem: function(itemId) {
        Meteor.call('getItem',  itemId,
            function(error, data){
                console.log(data.data.nf_total_carbohydrate);
            }
        );

        console.log(itemId);
    },

    render: function() {
        if(!this.props.item.fields){
            return (<tr><td></td></tr>);
        }
        else {
            return (
                <tr>
                    <td key={this.props.item._id}>{this.props.item.fields.item_name}</td>
                    <td>
                        <button className="btn btn-primary" onClick={() => this.selectItem(this.props.item.fields.item_id)}>
                            Select
                        </button>
                    </td>
                </tr>
            );
        }
    }
});

var ReadingsList = React.createClass({
    displayName: "ReadingsList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        readings: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <div style={{marginTop: '50px'}}>
            {this.props.readings.map(t => {
                return (
                    <ReadingRow reading={t} key={t._id}/>
                );
            })}
            </div>
        );
    }

});

var ReadingRow = React.createClass({

    getInitialState: function() {
        return {
            open: 'hide'
        }
    },

    componentWillUnmount: function() {
      this.setState({
          open: 'hide'
      });
    },

    editReading: function() {
        Readings.remove(this.props.reading._id);
    },
    deleteReading: function() {
        Readings.remove(this.props.reading._id);
    },

    getReadingClass: function(){
        var min = Meteor.user().profile.min_bg_limit;
        var max = Meteor.user().profile.max_bg_limit;

        if(this.props.reading.reading <= parseInt(max) && this.props.reading.reading >= parseInt(min)){
            return 'success';
        }
        else if (this.props.reading.reading > parseInt(max) || this.props.reading.reading < parseInt(min)) {
            return 'danger';
        }
    },

    readingDetails: function() {

        if(this.state.open == 'hide'){
            this.setState({open: 'show'});
        }
        else {
            this.setState({open: 'hide'});
        }
    },

    leftOptions: [{
        label: 'Trash',
        class: 'trash',
        action: function() {
            if(this.state.open == 'hide'){
                this.setState({open: 'show'});
            }
            else {
                this.setState({open: 'hide'});
            }
        }
    }],
    rightOptions: [{
        label: 'Edit',
        class: 'move',
        action: function() {console.log('This is awesome')}

    }],
    callActionWhenSwipingFarLeft: true,
    callActionWhenSwipingFarRight: true,

    testMessage: function(option) {

    },

    render: function() {
        return (
            // TODO - Add view todo details
            <SwipeToRevealOptions
                leftOptions={this.leftOptions}
                rightOptions={this.rightOptions}
                callActionWhenSwipingFarRight={this.callActionWhenSwipingFarRight}
                callActionWhenSwipingFarLeft={this.callActionWhenSwipingFarLeft}
                onRightClick={(option)=>this.testMessage(option)}
                onLeftClick={()=>this.deleteReading()}>
                <div className="reading-row">
                    <div className="reading-body" >
                        <div className="reading">{this.props.reading.reading}<span className="reading-label">mg/dl</span></div>
                        <div className={this.getReadingClass() + ' reading-time'}>{moment(this.props.reading.created_at).fromNow()}</div>
                    </div>
                    <div className={this.state.open + ' reading-details'}>
                        <div className="reading-details-row">
                            <div className="left">Note:</div>
                            <div className="right">{this.props.reading.note}</div>
                        </div>
                        <div className="reading-details-row">
                            <div>
                            <button className="tide-btn btn-half" onClick={this.editReading}>
                                Edit
                            </button>
                            <button className="tide-btn btn-half danger" onClick={this.deleteReading}>
                                Delete
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </SwipeToRevealOptions>

        );
    }
});

var RecordNewButton = React.createClass({
    displayName: "RecordNewButton",
    mixins: [React.addons.PureRenderMixin],

    render: function() {
        return (
            <Button type='submit' bsStyle='success'>New Glucose Reading</Button>
        );
    }
});

var BGForm = React.createClass({
        getInitialState: function() {
            return {
                value: '',
                note: ''
            };
        },

        setInitialState: function() {
          return {
              value: '',
              note: ''
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
                value: this.refs.input.getValue(),
                note: this.refs.note.getValue()
            });
        },

        render: function() {
            return (
                <form onSubmit={this.newReading} style={{textAlign: 'center'}}>
                    <Input
                        type="number"
                        value={this.state.value}
                        placeholder="0"
                        hasFeedback
                        ref="input"
                        groupClassName="group-class tide-input large"
                        labelClassName="label-class"
                        onChange={this.handleChange}
                        className="reading-input"
                        />
                    <Input
                        type="text"
                        value={this.state.note}
                        placeholder="Note"
                        hasFeedback
                        ref="note"
                        groupClassName="group-class tide-input"
                        labelClassName="label-class"
                        onChange={this.handleChange}
                        className="reading-input"
                        />
                    <RecordNewButton onClick={this.newReading} />
                </form>
            );
        },

        newReading: function(e) {
            e.preventDefault();
            var now = new Date();

            if(this.state.value == '') {

            }
            else {
                Readings.insert({
                    created_at: now,
                    label: '',
                    note: this.state.note,
                    reading: this.state.value,
                    user_id: Meteor.userId()
                });

                this.state.value = '';
                this.state.note = '';
            }


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
