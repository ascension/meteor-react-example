/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment } from 'app-deps';

var { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem, Glyphicon } = ReactBootstrap;
var { Link } = Router;
var { NavItemLink, MenuItemLink } = ReactRouterBootstrap;

// Meteor components for navigation. Uses ReactBootstrap and
// ReactRouterBootstrap to manage the state of which tab is highlighted.

export default React.createClass({
    displayName: 'TopNav',
    mixins: [ReactMeteorData, Router.Navigation],

    getMeteorData: function() {
        // Reactive data fetch for Meteor user data. Requires `ReactMeteorData` mixin.
        // the returned object is now accessible under `this.data`.
        var user = Meteor.user();
        return {
            user: user,
            isAdmin: user? Roles.userIsInRole(user, ['admin']) : false,
        };
    },

    render: function() {

        return (
            <Navbar brand={<Link to="home"><Glyphicon glyph="menu-hamburger" /></Link>}  fixedTop toggleNavKey={0} className="navbar-tide">
                <CollapsibleNav eventKey={0}>
                    <Nav navbar>
                        <NavItemLink to="readings">Readings</NavItemLink>
                    </Nav>
                    <Nav navbar right style={{paddingTop: '25px'}}>
                        <DropdownButton ref="userMenu" title={this.data.user? this.data.user.username : "Not logged in"}>
                            {this.data.isAdmin? <MenuItemLink onClick={this.linkClick} to="adminUsers">Manage users</MenuItemLink> : ""}
                            <MenuItemLink onClick={this.linkClick} to="profile">Profile</MenuItemLink>
                            <MenuItemLink onClick={this.linkClick} to="changePassword">Change password</MenuItemLink>
                            <MenuItem onClick={this.logout}>Log out</MenuItem>
                        </DropdownButton>
                    </Nav>
                </CollapsibleNav>
            </Navbar>
        );
    },

    linkClick: function(event) {
        // Close menu when we click a link
        this.refs.userMenu.setDropdownState(false);
    },

    logout: function(e) {
        e.preventDefault();
        Meteor.logout();

        this.transitionTo("login");
    }

});
