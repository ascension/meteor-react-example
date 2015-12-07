/* jshint esnext:true */
/* global Meteor, React */
"use strict";

import { _, Router } from 'app-deps';

var { Link } = Router;

// React component corresponding to the default route for the app, i.e. the
// home page.

export default React.createClass({
    displayName: 'Home',

    render: function() {
        return (
            <div className="home-page">

            </div>
        );
    }

});
