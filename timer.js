const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Util = imports.misc.util;
const Lang = imports.lang;

const Timer = new Lang.Class({
	Name: 'Timer',
	
	_timerValue: 0,
	_timerId: null,
	_startTime: 0,
	_command: null,
	
	_init: function(command) {
		this._command = command;
	},
	
	
	start: function(period, callCommandNow) {
		this._timerValue = period;
		this._startTime = GLib.get_monotonic_time();
		if (!this._timerId) // means timer was stopped before
			this._timerId = Mainloop.timeout_add_seconds(1, Lang.bind(this, this._timerCallback));
		if (callCommandNow)
			GLib.spawn_command_line_sync(this._command);
	},
	
	stop: function() {
		Mainloop.source_remove(this._timerId);
		this._timerId = null;
	},

	setCommand: function(command) {
		this._command = command
	},

	setPeriod: function(period) {
		this._timerValue = period;
	},
	
	_timerCallback: function() {
		let currentTime = GLib.get_monotonic_time();
		let secondsElapsed = Math.floor((currentTime - this._startTime) / 1000000);
		let secondsLeft = this._timerValue - secondsElapsed;
		if (secondsLeft > 0) {
			return true;
		}
		
		GLib.spawn_command_line_sync(this._command);
		this._startTime += this._timerValue * 1000000;
		return true; // we want the timer to loop forever
	}

});
