/* jshint esnext:true */
/* global Meteor, React */

"use strict";

import { _, ReactBootstrap } from 'app-deps';

var { Modal, ProgressBar } = ReactBootstrap;

// React component that renders a loading page. This can be used to render
// a holding view whilst subscriptions complete.

export default React.createClass({
    displayName: 'Loading',

    render: function() {
        return (
            <div className="please-wait modal-open">

            </div>
        );
    }

});
