/*global define */

define(['jquery'], function ($) {
	'use strict';

	var _append = function (logger, html) {
			logger.el.append(html);
		},
		_createEntry = function (prefix, message) {
			return '<p class="logEntry">' +
				'<small class="text-muted pull-right"><time>' + new Date().toLocaleTimeString() + '</time></small> ' +
				'<b>' + prefix.toUpperCase() + ':</b> <span class="logMsg">' + message + '</span>' +
				'</p>';
		},
		EventLog = function (element) {
			this.el = $(element);
		};

	EventLog.prototype = {
		log: function (prefix, message) {
			_append(this, _createEntry(prefix, message));
		},
		info: function (message) {
			_append(this, $(_createEntry('info', message)).addClass('alert').addClass('alert-info'));
		},
		warn: function (message) {
			_append(this, $(_createEntry('warn', message)).addClass('alert').addClass('alert-warning'));
		},
		error: function (message) {
			_append(this, $(_createEntry('error', message)).addClass('alert').addClass('alert-danger'));
		},
		group: function (groupName) {
			var panel = $('<div class="consoleGroup panel panel-info"><div class="consoleGroupBody panel-body"></div></div>');
			panel.prepend(
				'<div class="panel-heading">' +
					'<button type="button" class="close pull-right">&times;</button>' +
					'<span class="glyphicon glyphicon-play"></span> ' + groupName +
				'</div>');
			_append(this, panel);
			panel.on('click', 'button.close', function (evt) {
				panel.remove();
				evt.preventDefault();
			});
			return new EventLog(panel.find('.panel-body'));
		},
		groupEnd: function () {
			if (this.el.is('.consoleGroupBody')) {
				this.el.parent('.consoleGroup')
					.removeClass('panel-info')
					.addClass('panel-default')
					.find('.panel-heading .glyphicon')
					.removeClass('glyphicon-play')
					.addClass('glyphicon-stop');
			}
		}
	};

	return EventLog;
});