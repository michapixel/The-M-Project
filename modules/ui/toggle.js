// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      09.11.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

/**
 * @class
 *
 * M.ToggleView defines the prototype of any toggle view. A toggle view accepts exactly
 * two child views and provides an easy mechanism to toggle between these two views. An
 * easy example would be to define two different button views that can be toggled, a more
 * complex scenario would be to define two content views (M.ScrollView) with own child views
 * and toggle between them.
 *
 * @extends M.View
 */
M.ToggleView = M.View.extend(
/** @scope M.ToggleView.prototype */ {

    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.ToggleView',

    /**
     * States whether the toggle view currently displays its first child view or its second
     * child view.
     *
     * @type Boolean
     */
    isInFirstState: YES,

    /**
     * Determines whether to toggle the view on click. This might be useful if the child views
     * are e.g. buttons.
     *
     * @type Boolean
     */
    toggleOnClick: NO,

    /**
     * Contains a reference to the currently displayed view.
     *
     * @type M.View
     */
    currentView: null,

    /**
     * Renders a ToggleView and its child views.
     *
     * @private
     * @returns {String} The toggle view's html representation.
     */
    render: function() {
        this.html += '<div id="' + this.id + '">';

        this.renderChildViews();

        this.html += '</div>';
        
        return this.html;
    },

    /**
     * This method renders one child view of the toggle view, based on the isInFirstState
     * property: YES = first child view, NO = second child view.
     */
    renderChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            var childViewIndex = this.isInFirstState ? 0 : 1;

            if(this[childViews[childViewIndex]]) {
                if(this.toggleOnClick) {
                    this[childViews[childViewIndex]].internalEvents = {
                        tap: {
                            target: this,
                            action: 'toggleView'
                        }
                    }
                }
                this.currentView = this[childViews[childViewIndex]];
                this.html += this[childViews[childViewIndex]].render();
            } else {
                M.Logger.log('Please make sure that there are two child views defined for the toggle view!', M.WARN);
            }
        }
    },

    /**
     * This method is called out of the toggleView method. It basically empties the html
     * representation of the toggle view and then renders the proper child view based on
     * the isInFirstState property: YES = first child view, NO = second child view.
     */
    renderUpdateChildViews: function() {
        if(this.childViews) {
            var childViews = this.getChildViewsAsArray();
            var childViewIndex = this.isInFirstState ? 0 : 1;

            if(this[childViews[childViewIndex]]) {
                if(this.toggleOnClick) {
                    this[childViews[childViewIndex]].internalEvents = {
                        tap: {
                            target: this,
                            action: 'toggleView'
                        }
                    }
                }
                this[childViews[childViewIndex]].clearHtml();
                this.currentView = this[childViews[childViewIndex]];
                return this[childViews[childViewIndex]].render();
            } else {
                M.Logger.log('Please make sure that there are two child views defined for the toggle view!', M.WARN);
            }
        }
    },

    /**
     * This method toggles the child views by first emptying the toggle view's content
     * and then rendering the next child view by calling renderUpdateChildViews().
     */
    toggleView: function(id, event, nextEvent) {
        this.isInFirstState = !this.isInFirstState;
        this.removeChildViews();
        $('#' + this.id).html(this.renderUpdateChildViews());
        this.currentView.registerEvents();
        this.theme();

        /* if view is a M.ScrollView, we need to use the 'page' method of JQM for correct styling */
        if(this.currentView && this.currentView.type === 'M.ScrollView') {
            $('#' + this.currentView.id).page();
        }

        /* call jqm to fix header/footer */
        $.fixedToolbars.show();

        if(nextEvent) {
            M.EventDispatcher.callHandler(nextEvent, event, YES);
        }
    },

    /**
     * Triggers the rendering engine, jQuery mobile, to style the toggle view respectively
     * its child views.
     *
     * @private
     */
    theme: function() {
        this.themeChildViews();
    }

});