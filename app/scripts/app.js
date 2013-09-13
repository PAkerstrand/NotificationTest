/*global define */
define(['jquery', 'notification/notification', 'log/eventLog', 'modernizr/extensions'], function ($, notification, EventLog, extensionsLoaded) {
    'use strict';

	if(extensionsLoaded) {
		var callout = $('.notificationCallout');
		if(!callout.parents('html.notification').length) {
			callout.removeClass('hide');
		} else {
			$('#notificationStuff').removeClass('hide');
		}
	}

	if(!notification) {
		return;
	}

	var eventLog = new EventLog('#eventLog');
	notification.setConsole(eventLog);
	notification.init();
});