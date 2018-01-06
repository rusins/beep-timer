const Main = imports.ui.main;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Extension.imports.convenience;
const Timer = Extension.imports.timer;

// Icons and labels
const St = imports.gi.St;

// Menu items
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const Switcher = imports.ui.switcherPopup;

// actual constants
const MainPanelID = "beep-timer-button"

// GLobal vairables
let indicator_button, enabled_label, time_label, switcher, slider, settings;
let period, max_interval, max_pow, icon, timer;

// Function called when extension is enabled
function init() {
	settings = Convenience.getSettings();
	timer = new Timer.Timer(settings.get_string("command"));
}

function _enableTimer() {
	timer.start(period, settings.get_boolean("eager"));
	icon.opacity = 255;
	settings.set_boolean("enabled", true)
}

function _disableTimer() {
	timer.stop();
	icon.opacity = 130;
	settings.set_boolean("enabled", false);
}

function _onToggle() {
	if (switcher.state)
		_enableTimer();
	else
		_disableTimer();
}

function _getMax() {
	max_interval = settings.get_int("max-interval") * 60; // it's in minutes
	max_pow = Math.log(max_interval);
}

function _onSettingsChanged() {
	// musn't call settings.set anywhere otherwise an infinate loop arises
	_getMax();
	period = settings.get_int("period");
	_updatePeriod();
	timer.setCommand(settings.get_string("command"));
}

function _updatePeriod() {
	timer.setPeriod(period);
	if (period <= 300)
		switcher.label.text = period.toString() + " seconds";
	else
		switcher.label.text = (period / 60).toFixed(0) + " minutes";
}

// gets called continously until the user lets go
function _onSliderChanged() {
	let pow = max_pow * slider.value;
	period = Math.pow(Math.E, pow);
	settings.set_int("period", period); // will do rest of updating for us
}

// Function called when extension is enabled + when screen is unlocked
function enable() {
	// read vars from settings
	_getMax();
	period = settings.get_int("period");

	// Indicator button
	indicator_button = new PanelMenu.Button(null, MainPanelID);
	// null is the menu – empty at first
	icon = new St.Icon({
        icon_name: "appointment-symbolic",
        style_class: "system-status-icon"
    });
	indicator_button.actor.add_actor(icon);

	// Switcher item
	switcher = new PopupMenu.PopupSwitchMenuItem('');
	switcher.connect("toggled", _onToggle);
	switcher.setToggleState(settings.get_boolean("enabled"));
	_onToggle();
	indicator_button.menu.addMenuItem(switcher);
	
	// Slider item
	let sliderItem = new PopupMenu.PopupMenuItem('');
	slider = new Slider.Slider(Math.log(period) / max_pow);
	slider.connect("value-changed", _onSliderChanged);
	sliderItem.actor.add(slider.actor, {expand: true});
	indicator_button.menu.addMenuItem(sliderItem);

	// Finally
	Main.panel.addToStatusArea(MainPanelID, indicator_button);
	_updatePeriod(); // display label

	// Settings updates
	settings.connect('changed::period', _onSettingsChanged);
	settings.connect('changed::max-interval', _onSettingsChanged);
	settings.connect('changed::command', _onSettingsChanged);
	
	// TODO: remove
}

// Function is called when extension is disabled + screen is locked
function disable() {
	Main.panel.statusArea[MainPanelID].destroy();
	timer.stop();
}

/*
function _openPrefs() {
	Util.spawn(["gnome-shell-extension-prefs", Extension.uuid]);
}
*/
