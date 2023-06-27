---
title: "MacOS Command Line Tools"
date: 2023-06-28T00:15:38+09:00
tags: ["CLI", "macOS", "terminal"]
featured_image: "/images/terminal.jpg"
draft: false
---

This post will have some command line tools used in macOS. Truth be told, I do not use ALL of these commands all of the time but I consider them useful nonetheless.

### caffeinate (sleep)

- `caffeinate` to prevent your mac from going to sleep as long as the command is running.
- `caffeinate -u -t <seconds>` to specify the time.
Adding the `-d` flag prevents the display from going to sleep.
- `caffeinate <command>` will start the command in a new process and will prevent sleep until that process exits.


### textutils (document file converter)

- `textutil` converts files to and from MS Word, plain text, rich text, and HTML formats.
- `textutil -convert html text.doc` converts **text.doc** into **text.html**.
- Possible values for `-convert` are : **txt, html, rtf, rtfd, doc, docx**.

### mdfind (search with Spotlight)

- `mdfind <query>` performs a keyword-based Spotlight search with the query.
- `mdfind kMDItemAppStoreHasReceipt=1` finds all apps installed from the App Store.
- `mdfind name <name>` searches all files with the name **name**.
- `-onlyin <dir>` flag restricts the search to a given directory.

### networkQuality (measure Internet speed)

- `networkQuality` to run an Internet Speed test from your Mac.
- `-v` flag for verbose.
- `-i` flag to run a network test on a specific network interface.

### screencapture (screenshots)

- `screencapture -c` to take a screenshot and copy to clipboard.
- `screencapture <file>` to take screenshot and save to a file.
- Add the `-T <seconds>` to take the screenshot after a certain time.

### pbcopy and pbpase
- `<command> | pbcopy` copies the output of the command to the clipboard.
- `pbpaste` outputs the contents of the clipboard to stdout.

MacOS:
```bash
# Copy the output of a command into your clipboard
$ cat readme.txt | pbcopy

# Output the ocntents of your clipboard
$ pbpaste
```

Linux:
```bash
# Create aliases using xsel
alias pbcopy=’xsel — clipboard — input’
alias pbpaste=’xsel — clipboard — output’

# Create using xclip
alias pbcopy="xclip -selection clipboard"
alias pbpaste="xclip -selection clipboard -o"
```

### taskpolicy (control scheduling of processes)

- `taskpolicy -b <command>` executes the command in the background. *On Apple silicon Macs, the process will only run on the efficiency cores.
- `taskpolicy -b -p <pid>` downgrades an existing process to run in the background
- `taskpolicy -B -p <pid>` removes the specified process from running in the background. *On Apple silicon, the process may now run on the efficiency or performance cores. This only works on processes that have been downgraded to the background, and not processes that started in the background*
- `taskpolicy -s <command>` starts the given command in suspended state; it is useful to allow a debugger to attach to the process right at the start of execution.

### say (TTS engine)

- `say <message>` announces the given message.
- `say -f input.txt -o output.aiff` to create an audiobook from the given text file.

### sips (image manipulation)

- `sips -z <height> <width> <image>` resizes the specified image, ignoring the previous aspect ratio.
- `sips -Z <size> <image>` resizes the largest side of the specified image, preserving aspect ratio.
- `sips -r <degrees> <image>` rotates the image.

### open (open files)

- `open .` opens the current directory in a new Folder window.
- `open -a <app> <file>` opens the given file with a specific app.


### pmset (power management)

- `pmset -g` prints all available power configuration information.
- `pmset -g assertions` for information about power-related assertions made by other processes; **useful for finding a process that is preventing your Mac from going to sleep**.
- `pmset -g thermlog` for information about any processes that have been throttled; **useful for running benchmarks**.
- `pmset displaysleepnow` puts the display to sleep without putting the rest of the system to sleep.
- `pmset sleepnow` to put the entire system to sleep.

### networksetup (network settings)

- `networksetup -listnetworkserviceorder` prints a list of available network services.
- `networksetup -getinfo <networkservice>` prints info about a specified network service.
- `networksetup -getdnsservers <networkservice>` prints the DNS servers for the specified network service.
- `networksetup -setairportnetwork <device> <network> [password]` joins the specified WIFI  network. *The \<device\> argument should be "en0"* in most cases.

### qlmanage (manage Quick Look)

- `qlmanage -p <file>` opens a Quick Look preview window of the file.
- `qlmanage -m` prints status info about the Quick Look server process.
- `qlmanage -r` restarts Quick Look server process.
- `qlmanage -r cache` resets teh Quick Look thumbnail cache.


### softwareupdate (OS updates)
- `softwareupdate --list` prints out all available software updates.
- `sudo softwareupdate -ia` installs all available updates.
- `softwareupdate --fetch-full-installer --full-installer-version <version>` tries to download the full installer of the specified macOS version to /Applications.





[research link](https://saurabhs.org/advanced-macos-commands)