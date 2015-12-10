/* jshint esnext:true */
/* global Meteor, React */
"use strict";

import { _, Router } from 'app-deps';

import { LandingPage, Login, ResetPassword, EnrollAccount, ChangePassword} from 'client/components/login';
import { AdminUsers, CreateUser } from 'client/components/users';

import App from 'client/components/app';
import Home from 'client/components/home';
import Readings from 'client/components/readings';
import Meals from 'client/components/meals';
import Profile from 'client/components/profile';

var { Route, DefaultRoute } = Router;

// On startup, let the router take over the `main` div in the markup.

Meteor.startup(() => {

    // Define client-side routes using ReactRouter, which is imported as an NPM
    // module in the `app-deps` package.

    var routes = [
        // Account management
        <Route name="landing" path="/landing" handler={LandingPage}/>,
        <Route name="login" path="/login" handler={Login}/>,
        <Route name="resetPassword" path="/reset-password/:token" handler={ResetPassword}/>,
        <Route name="enrollAccount" path="/enroll-account/:token" handler={EnrollAccount}/>,
        <Route name="changePassword" path="/change-password" handler={ChangePassword}/>,

        // App
        <Route name="home" path="/" handler={App}>

            // User facing functionality
            <DefaultRoute handler={Home} />
            <Route name="readings" path="readings" handler={Readings}/>
            <Route name="meals" path="meals" handler={Meals}/>
            <Route name="profile" path="profile" handler={Profile}/>


            // Administration
            <Route name="adminUsers" path="admin/users" handler={AdminUsers}/>
            <Route name="adminCreateUser" path="admin/create-user" handler={CreateUser}/>

        </Route>
    ];

    var router = Router.create({
        routes: routes,
        location: Router.HistoryLocation
    });

    router.run((Root, state) => {
        React.render(<Root />, document.getElementById('main'));
    });
});
