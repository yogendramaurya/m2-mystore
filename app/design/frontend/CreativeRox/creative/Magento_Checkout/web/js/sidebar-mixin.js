define([
    'jquery',
    'Magento_Customer/js/model/authentication-popup',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/confirm',
    'jquery/ui',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies'
], function($, authenticationPopup, customerData) {
    'use strict';
    return function(widget) {

        return $.widget('mage.sidebar', widget, {

            _initContent: function () {

                var self = this,
                    events = {};

                this.element.decorate('list', this.options.isRecursive);

                events['click ' + this.options.button.close] = function (event) {
                    event.stopPropagation();
                    $(self.options.targetElement).dropdownDialog('close');
                };
                events['click ' + this.options.button.checkout] = $.proxy(function () {
                    var cart = customerData.get('cart'),
                        customer = customerData.get('customer');

                    if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {
                        // set URL for redirect on successful login/registration. It's postprocessed on backend.
                        $.cookie('login_redirect', this.options.url.checkout);
                        if (this.options.url.isRedirectRequired) {
                            location.href = this.options.url.loginUrl;
                        } else {
                            authenticationPopup.showModal();
                        }

                        return false;
                    }
                    location.href = this.options.url.checkout;
                }, this);

                /* @mod: Removed confirmation dialog from mini cart when clicked on delete button */
                events['click ' + this.options.button.remove] =  function (event) {
                    event.stopPropagation();
                    self._removeItem($(event.currentTarget));
                };
                events['keyup ' + this.options.item.qty] = function (event) {
                    self._showItemButton($(event.target));
                };
                events['click ' + this.options.item.button] = function (event) {
                    event.stopPropagation();
                    self._updateItemQty($(event.currentTarget));
                };
                events['focusout ' + this.options.item.qty] = function (event) {
                    self._validateQty($(event.currentTarget));
                };

                this._on(this.element, events);
                this._calcHeight();
                this._isOverflowed();
            },

        });

        return $.mage.sidebar;
    }
;});

