// A lot of the code in this file comes from Raphaël Rochet's Arch Linux Updates Indicator Gnome extension.

const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Extension.imports.convenience;


// Global vars
let settings;

// needed
function init() {
	settings = Convenience.getSettings();
}

function buildPrefsWidget() {
	let builder = new Gtk.Builder();
	builder.add_from_file(Extension.dir.get_path() + "/prefs.xml");
	let frame = builder.get_object("prefs_widget");

	// Bind fields to settings
	settings.bind("period", builder.get_object("field_period"), "value", Gio.SettingsBindFlags.DEFAULT);
	settings.bind("max-interval", builder.get_object("field_max-interval"), "value", Gio.SettingsBindFlags.DEFAULT);
	settings.bind("command", builder.get_object("field_command"), "text", Gio.SettingsBindFlags.DEFAULT);
	settings.bind("eager", builder.get_object("field_eager"), "active", Gio.SettingsBindFlags.DEFAULT);

	frame.show_all();
	return frame;
}
