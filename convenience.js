const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;

function getSettings(schema) {
    let extension = ExtensionUtils.getCurrentExtension();

    schema = schema || extension.metadata['settings-schema'];

    const GioSSS = Gio.SettingsSchemaSource;


    let schemaDir = extension.dir.get_child('schemas');
    let schemaSource = GioSSS.new_from_directory(schemaDir.get_path(),
												 GioSSS.get_default(),
												 false);

    let schemaObj = schemaSource.lookup(schema, true);
    if (!schemaObj)
        throw new Error('Schema ' + schema + ' could not be found for extension '
                        + extension.metadata.uuid + '. Please check your installation.');

    return new Gio.Settings({ settings_schema: schemaObj });
}
