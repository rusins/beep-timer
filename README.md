# Beep Timer
Gnome extension that makes a sound play once every X seconds / runs a command.
Its main purpose is to combat procrastination by giving the user a sense of the passing of time, but because the command being run can be customized, it can be used for other purposes as well.

## How to install:
1) download the repo as a zip
2) unzip it
3) put it in a folder named `beep-timer@rusins.github.com`
4) move that folder to `~/.local/share/gnome-shell/extensions/`
5) refresh shell by relogging / alt+f2 then type r+enter
6) should be enabled by default, if not, you can do it in `gnome-tweak-tool` or `gnome-shell-extension-prefs`

### Notes:
Relative paths in the command don't work. This can be avoided by just calling a shell script if really necessary. By default the commands are executed in the user's home directory, so `mplayer .beep.mp3` would make mplayer play the file `/home/<username>/.beep.mp3`.
