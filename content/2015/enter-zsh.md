---
aliases:
  - "/enter-zsh/"
date: "2015-10-16"
description: "As a programmer, I work from my terminal most of the time, sounds weird right? Well it is because it is faster and more productive."
slug: "enter-zsh"
tags:
  - "programming"
  - "development"
  - "terminal"
title: Enter ZSH
---


![Superman Facing Sketch][]


As a programmer, I work from my terminal most of the time, *sounds weird right?*. Well it is because it is faster and much more productive.

If you support me then you sure know of **Bourne Again shell (bash)**, **Bourne shell (sh)**, **Korn shell (ksh)** and **Z shell (zsh)**


## A brief History


![Clock Shield Sketch][]


**Z shell (zsh)**

[Zsh][] is a *Unix shell* that can be used as an interactive login shell and as a powerful command interpreter for shell scripting. *Zsh* can be thought of as an extended *bash* with a large number of improvements, including some features of *bash* and *ksh*.

**oh my zsh**

[oh my zsh][] is an open source, community-driven framework for managing your zsh configuration.


## zsh - Configuration

One of the great things about zsh is that it requires almost no configuration to be useful.

Below is my `~/.zshrc` file, and is personalized for my own usage, but you can [fork][] and use it however you'd like. As you can see, it's very simple:

```viml
# Require other configuration files.
source ~/.zsh/global_aliases
source ~/.zsh/aliases
source ~/.zsh/dir_aliases
source ~/.zsh/batt_aliases
source ~/.zsh/env_keys

# Use vim as the default text editor.
export EDITOR=vim

# Set name of the theme to load.
ZSH_THEME="avit"

# Uncomment the following line to use case-sensitive completion.
CASE_SENSITIVE="false"

# Uncomment the following line to disable bi-weekly auto-update checks.
DISABLE_AUTO_UPDATE="false"

# Uncomment the following line to change how often to auto-update (in days).
export UPDATE_ZSH_DAYS=7

# Uncomment the following line to display red dots whilst waiting for completion.
COMPLETION_WAITING_DOTS="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
plugins=(git web-search osx jsontools alias-tips)

# User configuration
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Load oh my zsh.
source $ZSH/oh-my-zsh.sh

# rbenv enable shims and autocomplete
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# Node Version Manager NVM.
export NVM_DIR="/Users/akinjide/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
```

The changes I made are simple and for my own preferences. Here's what my changes do:

-  Load custom configuration files. That means all aliases, environment variables and other random stuffs.
-  Set vim as my default editor. `I love vim`, but you can switch to `emacs` or others.
-  Set default theme for oh my zsh. You can set random to use different theme anytime you start your terminal.
-  Set plugins you want oh my zsh to load into your terminal.
-  rbenv is a Ruby version manager to maintain different Ruby version. Likewise, nvm, a Node version manager to maintain different NodeJS version.

As you can see, I had to make very few changes to oh my zsh in order for it to be useful to me.

## zsh - Resources

If you'd like to give zsh a try, here are some resources to get you going. zsh has become my favorite and most used tools since I started using it earlier this year. I'd highly recommend it to anyone who does a lot of terminal work.

-  [Installation][]
-  [The main zsh website.][Zsh]
-  [zsh wiki][]
-  `man zsh` has great information and is highly readable.
-  [oh my zsh source][oh my zsh], a really great introduction to using Oh My Zsh.
-  [oh my zsh series][], a series of blog posts explaining zsh and oh my zsh in depth. A great read.
-  [oh my zsh theme][], a simple oh my zsh theme.


  [Superman Facing Sketch]: /static/images/2015/superman-facing-sketch.jpg "Superman Facing Sketch"
  [Clock Shield Sketch]: /static/images/2015/clock-shield-sketch.jpg "Clock Shield Sketch"
  [Zsh]: http://www.zsh.org/ "Zsh powerful shell scripting"
  [oh my zsh]: http://ohmyz.sh/ "Oh My Zsh is a way of life"
  [fork]: https://github.com/akinjide/dot-zsh "My ZSH dotfiles."
  [Installation]: https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH "Configuring oh my zsh"
  [zsh wiki]: http://zshwiki.org/home/ "Zsh wiki"
  [oh my zsh series]: https://www.smashingmagazine.com/2015/07/become-command-line-power-user-oh-my-zsh-z/ "Become A Command-Line Power User"
  [oh my zsh theme]: https://github.com/akinjide/chi "oh my zsh theme for zsh"
