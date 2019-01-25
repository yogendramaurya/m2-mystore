define(
    [
        'mage/utils/wrapper',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/payment-service',
        'Magento_Checkout/js/action/select-payment-method',
        'underscore'
    ],
    function (wrapper, checkoutData, paymentService, selectPaymentMethodAction, _) {
        'use strict';

        /**
         * @mod: Auto-select the the only payment method if there is only one payment method to choose
         */
        return function (target) {
            target.resolvePaymentMethod = wrapper.wrap(target.resolvePaymentMethod, function(originalFunction) {
                var originalOutput = originalFunction();

                var availablePaymentMethods = paymentService.getAvailablePaymentMethods();
                var selectedPaymentMethod = checkoutData.getSelectedPaymentMethod();

                if (!selectedPaymentMethod) {

                    var countMethods = availablePaymentMethods.length;
                    var visibleMethods = 0;

                    if(countMethods > 0) {
                        availablePaymentMethods.some(function (payment) {
                            if(payment.method != 'paypal_express') {
                                visibleMethods++;
                            }
                        });
                        if(visibleMethods == '1') {
                            availablePaymentMethods.some(function (payment) {

                                /* Avoid paypal express. Even if paypal express do not display on payment methods list,
                                its there on available methods array
                                */
                                if(payment.method != 'paypal_express') {
                                    selectPaymentMethodAction(payment);
                                }
                            });
                        }
                    }
                }

                return originalOutput;
            });

            return target;
        };
    }
);
