/*global define, Notification, webkitNotifications */
define(['require', 'jquery', 'modernizr/extensions'], function (require, $) {
	'use strict';

	if(!$('html.notification').length) {
		return false;
	}

	var webkitPermissionBridge = {
			0: 'granted',
			1: 'default',
			2: 'denied'
		},
		permissionBtn= $('#permissionBtn'),
		notificationInput = $('#notificationForm').find(':input'),
		notificationBtn = $('#showBtn');

	var api = {
		setConsole: function setConsole (console) {
			api.console = console;
			api.console.log('info', 'Console initialized...');
		},
		requestPermission: function (evt) {
			if(!(evt || api.canAskForPermissionWithoutInteraction())) {
				api.console.warn('This browser needs a user interaction to ask for permission...');
				return;
			}

			api.console.log('info', 'Asking user for permission...');
			Notification.requestPermission(function (permission) {
				if(api.permissionIsSet()) {
					api.console.info('User <strong>' + permission + '</strong> permission to show notifications');
					api.syncUI();
				} else {
					api.console.info('User aborted the permission dialogue');
				}
			});
			evt.preventDefault();
		},
		updatePermissionButton: function (permission) {
			if(permission === 'default') {
				permissionBtn.prop('disabled', null);
				permissionBtn.removeClass('btn-success').removeClass('btn-danger').addClass('btn-info');
			} else {
				permissionBtn.prop('disabled', 'disabled');
				permissionBtn.removeClass('btn-info').addClass('btn-' + (permission === 'granted' ? 'success' : 'danger'));
				if(permission === 'granted') {
					permissionBtn.text('Permission granted');
				} else {
					permissionBtn.text('Permission denied');
				}
			}
		},
		getPermission: function () {
			var permission = Notification.permission;
			if(!permission) {
				permission = webkitPermissionBridge[webkitNotifications.checkPermission()];
			}

			return permission;
		},
		permissionIsSet: function () {
			return this.getPermission() !== 'default';
		},
		canAskForPermissionWithoutInteraction: function () {
			return navigator.userAgent.indexOf('Chrome') < 0;
		},
		syncUI: function () {
			var permission = api.getPermission();
			api.updatePermissionButton(permission);
			if(permission === 'granted') {
				notificationInput.prop('disabled', false);
			} else {
				notificationInput.prop('disabled', true);
			}
			if(api.permissionIsSet()) {
				api.console.warn('To reset the permission for whether to display notifications or not, you need to access your browser settings and clear them there. See the footer for instructions.');
			}
		},
		createNotificationFromForm: function (evt) {
			if(evt) {
				evt.preventDefault();
			}

			var title = $('#title').val() || 'Default title...',
				icon = $('#icon').val() || null,
				tag = $('#tag').val() || null,
				options = {
					body: $('#body').val() || 'This is a default body text. You can enter your own if you want to.'
				},
				console,
				notification;

			if(icon) {
				options.icon = icon;
			}
			if(tag) {
				options.tag = tag;
			}

			console = api.console.group(title + (options.tag ? ' ' + JSON.stringify({tag: options.tag}) : ''));

			notification = new Notification(title, options);
			notification.onshow = function () {
				console.log('event', 'Notification#onshow');
			};
			notification.onclick = function () {
				console.log('event', 'Notification#onclick');
			};
			notification.onclose = function () {
				console.log('event', 'Notification#onclose');
				console.groupEnd();
			};
			notification.onerror = function () {
				console.error('event', 'Notification#onerror');
			};
		},
		init: function () {
			$('#permissionProp .answer').addClass(Notification.permission ? 'glyphicon-check text-success' : 'glyphicon-remove text-danger');
			$('#requestPermission .answer').addClass(api.canAskForPermissionWithoutInteraction() ? 'glyphicon-check text-success' : 'glyphicon-remove text-danger');
			permissionBtn.on('click', api.requestPermission);
			notificationBtn.on('click', api.createNotificationFromForm);

			api.syncUI();
		}
	};

	return api;
});