---
aliases:
  - /vim-future-past/
date: "2016-08-03"
description: "A little rant about Vim, Bram Moolenaar et al.  Vim is awesome, learn why."
slug: "vim-future-past"
tags: ["terminal", "devops"]
title: "Vim -- Future Past"
---


![Vim Icon][]


vim. VIM!

Writing software can be a pretty draining work. It is insanely fun when you’re in the zone and feeling good, and insanely dull when you’re not feeling your best.

Programmers spend most of their time looking at the development environment, so it is natural that we want something pretty as well as functional. Certainly, there are a lot of things professionals consider when selecting tools for their work. This is true for every profession, including software development. Quite often, however, selection is based on personal taste, not something easily tangible.

A great programmer could write her code into Notepad and still deliver great stuff. 

What are the things a programmer should evaluate when choosing a set of programming tools like a programming editor of choice? The answer to this question is not as simple as it might sound. Software development is close to an art, and there are quite few “fuzzy” factors that separate a masterpiece from an overpriced collectable.

In my personal experience, I’ve found that my programming ability is directly correlated to my code editor. Since I’m having a pretty good day today, I thought I’d take a moment to reflect on programming and editors.


## What Makes Good Code Editor?

Whether you’re a programmer or a writer, a good text editor is a must-have on any computer, 
in any operating system. The humble text editor is great for managing code, writing down quick notes, or just as a distraction-free writing tool.

In today’s development environment, a steep learning curve is a liability, regardless of feature set. Time is always valuable, so a good editor should be easy to get used to. Ideally, the programmer should be able to start work immediately, without having to jump through too many hoops.


### User Interface, Features, and Workflow

Let’s take a closer look at UI, different features and capabilities, and frequently used tools that should be a part of any programming editor.

Line numbers, of course, should be on by default and simple to turn on or off.

Snippets are useful for inserting standardized blocks of text in a fixed layout. However, programming is a lot about saying things just once, so be careful with snippets as they might make your code hard to maintain in the future.

The ability to lint, or syntax-check, the current file is useful, as is the ability to launch it. Without this facility, a programmer must switch to an external command line window, choose and run the correct command, and then step through error messages to find the source of the error.

Word-completion is helpful since it is fast, and almost as reliable as in-edit documentation, while being less intrusive. It is satisfying to enter just a few characters of a word and then hit enter to get the rest. Otherwise, one labors under the strain of excess typing, abhorred by lazy programmers, who want to type **ee** rather than the more lengthy **exponentialFunctionSquared**. Word completion satisfies by minimizing typing, enforcing coherent naming and by not getting in the way.

Source files can sometimes grow a lot. Code-folding is a nice feature that simplifies reading through long files.

Find/Replace with scope limitation to local, incremental, or global with meta characters and regular expressions are part of the minimum requirement these days, as is syntax highlighting.


### IDE vs General Purpose Text Editor

An integrated development environment (IDE) (or interactive development environment) is a software application that provides comprehensive facilities to computer programmers for software development. An IDE normally consists of a source code editor, build automation tools, and a debugger, and many support lots of additional plugins and extensions.

Text editors are simpler applications. Compared to IDEs, they usually correspond to just the code editor segment of an IDE. However, they are often much more than that. IDEs are created to serve the purpose of software development, while many text editors are designed to be used by non-programmers as well.


#### Select JetBrains IDE: IntelliJ IDEA, RubyMine, PyCharm, PHPStorm

![JetBrains Icon][]


[JetBrains][] Offers a family of IDEs for Java, Ruby, Python and PHP; all based on the same core engine. 
Very capable in its own right, JetBrains IDEs have been gaining a growing following. 

However, they are not free, but you'd get community editions for free, and ultimate version for a 30-day trial is available, and 
pricing is reasonable.


### Other IDE and Text Editor

![Editor Logos][]


Over one year, I have gone through quite a number of editors, below are my thoughts about them:

[Vi/Vim][] a powerful terminal-based editor. Designed to bring simplicity of Vi to every platform and 
programmer who need a configurable but not too-heavy editor, it comes standard with most *NIX OS.

Having Vim skills will make your life much simpler when operating through SSH, and you won't have 
problems with speed once you get familiar with keystrokes and commands. It supports dozens of languages, 
keeps a history of your actions so you can easily repeat or undo them, supports macro recording, 
automatically recognizes file types, and lives -- once installed—at your command line.

The learning curve is still quite steep (although its extensive help is useful for beginners), also its 
free (GPL licensed) meaning instead of paying for the app, the team behind it suggests you donate to 
children in Uganda who could use the support via the ICCF.

[Sublime Text][] is a truly Cross-platform and feature packed text editor. It is closed source, so it can't 
be modified at low level. It offers a minimal and straightforward UI, such as a scaled down display code 
on the right of the UI, allowing users to quickly scroll through their code and navigate with relative ease. 

It is distributed as evaluation software (meaning it’s free to try, but there’s no time limit on how long you can use it for free) 
and a full license will cost you $70.

[Atom][] an Open Source project that can easily be hacked to suit your needs. While it is still a work in progress, its a very capable editor with a vibrant community of programmers 
keen on new extensions, JavaScript libraries and more. It’s built by the team at GitHub, and incorporates some of the lessons the 
team there learned by managing so much code on a regular basis. It’s flexible, customizable, 
themeable, and even though it’s relatively new, it already has a large following and tons of plugins, thanks to its open API.

Its downsides include some UI quirks, the possibility that some add-on packages could misbehave, 
and reported performance issues when working with (very) big files. But the project is under active development, 
and current shortcomings are likely to be improved.

[Visual Studio Code][] Another widely used IDE, Visual Studio is very popular among .NET programmers, but has been adapted to many different platforms. We could argue that its monolithic architecture is a rock that will pull it under the water, but it is still one of the most popular platforms among programmers.


### My Thoughts and Choice 

It would be presumptuous to declare just one as the best programming editor among these great tools. And there are quite a few editors I did not even try. There is no one-size-fits-all solution. This is what compelled me to try out a number of different editors.

I'm currently using [Vi/Vim][], but its because it fits my requirements. I have been able to develop and maintain Node.js code-base. Your line of development might set a different set of requirements, and I hope I saved you some time in researching for the most appropriate programming editors.


## Vim in Action

A picture is worth a thousand words. I won’t bore you any further, here are some 
screenies of vim in action.

This first picture is just a simple display of vim with version 7.4 (note the status bar at the bottom):

![Vim Version 7.4][]

Next, we have a single vim window open, broken into two panes: vertically split. As you can see, this 
makes coding quite convenient and fun.

![Vim Multiple Panes][]

Here I just entered vim command mode `:command`, and activated [Ntree][] to list files in my cwd. Nice huh?

![Vim Ntree][]

![Vim Gallery 1][]

![Vim Gallery 2][]


## Installation

Console version of vim is built into Mac OS, but it is outdated and not compiled 
 with Ruby and Python support. Vim uses `.vimrc` configuration file to load custom configuration settings; 
 this is incompatible with Vim 7.2. However, there are few rather simple options for 
 updating Vim. :)

[Homebrew][] is every programmer OS X package manager. If you are not familiar with Homebrew, check it 
out. You can use Homebrew to install MacVim, which includes both a GUI and console version of Vim 7.3 

```bash
$ brew install macvim --override-system-vim

# If you need the app bundle linked in /Applications folder.
$ brew linkapps
```

Using `--override-system-vim` flag will instruct brew to setup the necessary symlinks to replace 
the system console Vim with the version provided by MacVim.

Vim shipped with MacVim might not be good enough, you also have the option to build Vim directly from 
the source using Homebrew.

```bash
# mercurial required - install if you don't already have it.
$ brew install mercurial

# install Vim
$ brew install vim

# if /usr/bin is before /usr/local/bin in your $PATH,
# hide the system Vim so the new version is found first
$ sudo mv /usr/bin/vim /usr/bin/vim73

# should return /usr/local/bin/vim
$ which vim
```

If you're interested in Vim, but don't want to install Homebrew. You can download and install the 
[MacVim][] app bundle and setup an alias to point to its version of Vim. 
Assuming you have MacVim installed to `/Applications/`

```bash
alias vim='/Applications/MacVim.app/Contents/MacOS/Vim' # or something like that
```


## Upgrading to Vim 7.4

It's best to not muck with the Apple installed bits, don't overwrite the buit-in Vim, OS X 
expects that nothing will ever change in `/usr/bin` unbeknownst to it, so any time you overwrite 
stuff in there you risk breaking some intricate interdependency. And, Let's say you do break 
something -- there's no way to "undo" that damage. You will be sad and alone. You may have to 
reinstall OS X 


![Sasuke VS Naruto Battle][]


### Dark Side

Assuming you're set on doing that, you are definitely on track. To install on top of your 
current installation, you need to set the "prefix" directory. That's done like this:

```bash
# Download, compile, and install the latest Vim
$ hg clone https://bitbucket.org/vim-mirror/vim or git clone https://github.com/vim/vim.git

$ cd vim
$ ./configure --prefix=/usr
$ make
$ sudo make install
```

You can pass "configure" a few other options too, if you want. Do `./configure --help` 
to see them. I hope you've got a backup before you do it, though, in case something goes wrong....


### The One True Way

The "clean" way is to install in a separate place, and make the new binary higher priority in 
the $PATH. Here is how I recommend doing that with config parameters:

```bash
# Create the directories you need
$ sudo mkdir -p /opt/local/bin

# Download, compile, and install the latest Vim
$ cd ~
$ hg clone https://bitbucket.org/vim-mirror/vim or git clone https://github.com/vim/vim.git

$ cd vim
$ ./configure --prefix=/opt/local \
              --enable-pythoninterp=yes
$ make
$ sudo make install

# Add the binary to your path, ahead of /usr/bin
$ echo 'PATH=/opt/local/bin:$PATH' >> ~/.bash_profile

# Reload bash_profile so the changes take effect in this window
$ source ~/.bash_profile
```

**NOTE**: Contrasted with old config parameters of vim, there is only a difference, that is the parameter `--enable-pythoninterp` is "yes" or "dynamic". The old one is `--enable-pythoninterp=dynamic`, which leads to the “py library not been loaded”. If this parameter is "yes", all the problems are solved.

Voila! Now when we use vim we will be using the old one. But, to get back to our old configuration in the event of huge f*ckups, we can just delete the `/opt` directory.

```bash
$ which vim
/opt/local/bin/vim

$ vim --version | head -n 2
VIM - Vi IMproved 7.4 (2013 Aug 10, compiled Nov  4 2015 00:35:01)
MacOS X (unix) version
```

See how clean this is.

I recommend not to install in `/usr/local/bin` when you want to override binaries in /usr/bin, 
because by default OS X puts `/usr/bin` higher priority in "$PATH" than `/usr/local/bin`, and 
screwing with that opens its own can of worms.... So, that's what you SHOULD do.

**NOTE**: This can be done with [Vim 8.0][] as well. You should check it out.

## Configuration

Vim can be configured also however you'd like, and it requires almost no configuration to be useful. Building a 
`.vimrc` file takes time and poking around.

Below is my `~/.vimrc` file, and is personalized for my own usage, but you can [fork][] and use it however 
you'd like. Might look long, but it's very simple:

```viml
" Use Vim settings, rather then Vi settings (much better!). This must be
" first, because it changes other options as a side effect.
set nocompatible


" ========== Vundle Initialization ==========
" Required for Vundle to work properly. Disabled file type detection.
filetype off

" This loads all the plugins in ~/.vim/bundle.
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" Install and manage all our Vim scripts using Vundle. To install (or update)
" all these scripts at once, run:
"
"   :PluginInstall
"
" To remove unused scripts, run:
"
"   :PluginClean
Plugin 'VundleVim/Vundle.vim'
Plugin 'tpope/vim-fugitive'
Plugin 'vim-scripts/python.vim--Vasiliev'
Plugin 'vim-scripts/django.vim'
Plugin 'tpope/vim-markdown'
Plugin 'Shougo/neocomplcache'
. . .

call vundle#end()

" Reactivate file type support.
filetype plugin indent on

" ========== Leader Config ==========

" Make , the default shortcut key. This allows us to easily add custom
" key mappings later on without breaking any of Vim's default functionality.
let mapleader=","

" ========== General Config ==========

set number                      " Line numbers are good.
set backspace=indent,eol,start  " Allow backspace in insert mode.
set history=1000                " Store lots of :cmdline history.
set showcmd                     " Show incomplete cmds down the bottom.
set showmode                    " Show current mode down the bottom.
set hidden                      " Allow buffers to exist in the background.
set autoread                    " Reload files changed outside vim
set list                        " Display unprintable characters.
set listchars=tab:▸\ ,trail:·,eol:¬ " Make tabs, trailing whitespace, and EOL characters easy to spot.
syntax on                       " Enable syntax highlighting.

" ========== Search Settings ==========

set incsearch                   " Find the next match as we type the search.
set smartcase                   " Search by case only if specified.
set hlsearch                    " Hilight searches by default.
set ignorecase                  " Allow case searches.
set viminfo='100,f1             " Save up to 100 marks, enable capital marks.

" ========== Swap Files ==========

set noswapfile                  " Don't use a swapfile for buffers.
set nobackup                    " Disable file backups when writing files.
set nowritebackup               " Don't backup before overwriting files.

" ========== Persistent Undo ==========

set undodir=~/.vim/undodir      " Store all change information in a undodir.
set undofile                    " Write changes to the undofile.
set undolevels=1000             " Maximum number of changes that can be undone.
set undoreload=10000            " Maximum number lines to save for undo on a buffer reload.

" ========== Indentation ==========

set autoindent                  " Copy indent from current line when starting a new line.
set smartindent                 " Do smart autoindenting when starting a new line.
set smarttab                    " A <tab> in front of a line inserts spaces.
set shiftwidth=4                " Number of spaces to use for each step of autoindent.
set softtabstop=4               " Number of spaces that a <tab> counts for while editing.
set tabstop=4                   " Number of spaces that a <tab> in the file counts for.
set expandtab                   " Use the appropriate number of spaces to insert a <tab>.

" Set smaller tab settings for HTML type stuff.
au FileType coffee,javascript,css,xml,xhtml,html,htmldjango,haml,json set shiftwidth=2 tabstop=2

" ========== Editor Width ==========

set nowrap                      " Don't wrap lines.
set linebreak                   " Wrap lines when convenient. This doesn't effect text, only display.
set textwidth=79                " Make all lines 79 chars or less.

" ========== Filetype Config ==========

filetype plugin on              " Automatically load filetype specific configs.
filetype indent on              " Automatically load filetype specific indent configs.

" ========== Folds ==========

set foldmethod=indent           " Fold based on indent.
set foldnestmax=3               " Limit folds to three levels of depth.
set foldenable                  " Fold by default.

" ========== Completion ==========

set wildmode=list:longest       " When more than one match, list all and look for the longest.
set wildmenu                    " Auto complete command line operations using <tab> and <ctr-p>/<ctr-n>.
set wildignore=*.o,*.obj,*~     " Filenames to ignore when auto completing.
set wildignore+=*vim/backups*   " (continued)
set wildignore+=*.pyc,*.pyo     " (continued)

" ========== Scrolling ==========

set scrolloff=8                 " Minimal number of screen lines to keep above and below the cursor.
set sidescrolloff=15            " Minimal number of screen columns to keep to the left and the right of the cursor.
set sidescroll=1                " Minimal number of columns to scroll horizontally.

" ========== Reload ==========

" Automatically reload Vim if you make changes to vimrc.
augroup reloadvim
    au!
    au BufWritePost .vimrc source $MYVIMRC
augroup end

" ========== neocomplcache ==========

let g:neocomplcache_enable_at_startup = 1
let g:neocomplcache_enable_smart_case = 1
let g:neocomplcache_min_syntax_length = 3
let g:neocomplcache_auto_completion_start_length = 3

. . .
```

The changes I made are much and for my own preferences but don't be dismayed, hack it however you'd like. Here's what my changes do:

- I use ([vundle][]) to manage my plugins.
- Set general config like line numbers, syntax highlighting and other cool stuffs.
- Vim enables file swaps and backups this can be annoying at times, but you can give it a try.
- Indentation, every programmer needs this.
- Configure stuffs like line length and line breaks.
- Auto reloading .vimrc when you reconfigure it.
- Set plugins configuration that vim will load into your terminal.

As you can see, I made quite much changes to vim in order for it to be useful to me.


## Takeaway

![Walking Away Sketch][]


Every programming language, be it Java, C#, PHP, Python, Ruby, JavaScript, and so on, has its own development practices related to project structure, debugging, and deploying. However, one thing they all have in common is writing code. 

The next time you're about to dive into some code, take a second or two and analyze what tool it is you're about to use. Vim is insanely fun, but navigating through code is even more fun.

Now get out there and write some code with **vim**!


## Resources

If you'd like to learn or give vim a try, here are some resources to get you started. Vim has become 
my favorite and most used tool especially when editing files on servers; started using it late last 
year. I'd highly recommend it to any programmer who does a lot of server side stuff.

- [Installation][]
- [The main vim website][]
- [vim wiki][]
- `man vim` has great information and is highly readable.
- `vim tutor` is designed to describe enough of the commands that you will be able to easily use Vim as an all-purpose editor.
- [vim source][]

  
  [Vim Icon]: /static/images/2016/vim-icon.png "Vim Icon"
  [JetBrains Icon]: /static/images/2016/jetbrains-icon.png "JetBrains Icon"
  [Editor Logos]: /static/images/2016/editor-logos.png "Editor Logos"
  [Vi/Vim]: http://www.vim.org "Vim"
  [Sublime Text]: https://www.sublimetext.com "Sublime Text"
  [Atom]: https://atom.io "Atom"
  [JetBrains]: https://www.jetbrains.com "JetBrains"
  [Visual Studio Code]: https://code.visualstudio.com "Visual Studio Code"
  [Vim Version 7.4]: /static/images/2016/vim-7_4.png "Vim Version 7.4"
  [Vim 8.0]: https://github.com/vim/vim/releases/tag/v8.0.0000 "Vim Version 8.0"
  [Vim Multiple Panes]: /static/images/2016/vim-multiple-panes.png "Vim Multiple Panes"
  [Vim Ntree]: /static/images/2016/vim-ntree.png "Vim Ntree"
  [Ntree]: https://github.com/scrooloose/nerdtree "Ntree Github"
  [Vim Gallery 1]: /static/images/2016/vim-gallery-1.png "Vim Gallery 1"
  [Vim Gallery 2]: /static/images/2016/vim-gallery-2.png "Vim Gallery 2"
  [Homebrew]: https://mxcl.github.com/homebrew/ "Homebrew Github"
  [MacVim]: https://github.com/macvim-dev/macvim "MacVim Github"
  [Sasuke VS Naruto Battle]: /static/images/2016/sasuke-vs-naruto-battle.gif "Sasuke VS Naruto Battle"
  [Vundle]: https://github.com/VundleVim/Vundle.Vim "Vundle Github"
  [Walking Away Sketch]: /static/images/2016/walking-away-sketch.gif "Walking Away Sketch"
  [Installation]: / "Installing and Configuring vim"
  [The main vim website]: http://www.vim.org "The main vim website"
  [vim wiki]: http://www.vim.org/docs.php "vim wiki"
  [vim source]: https://github.com/vim/vim "vim source"
  [fork]: https://github.com/akinjide/dot-vim "Akinjide vim .vimrc"
  
