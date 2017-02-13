---
aliases:
  - /git-signing-commits/
date: "2017-01-18"
description: "I really enjoy signing commits -- Here's why?"
slug: "git-signing-commits"
tags: ["terminal", "programming"]
title: "Git: Signing Commits"
---


![Four Symbols Seal Sketch][]


A few weeks back I associated my GPG key with Git and my Github account, this enabled me to sign commits which I'm really enjoying. I thought it would be cool to reflect on this, get you started, and share my experience signing commits.

However, setting it up can be confusing. In this article, I’ll cover how to set up auto signing commits with GPG and verifying those signatures on GitHub.

Git is cryptographically secure, but it’s not foolproof. When you're building software with people from around the world, it's important you validate and verify that commits are actually from a trusted or identified source, Git has a few ways to sign and verify your work using GPG, and Github will show you when commits are signed.


![Screen Shot 2016-12-31 14 25 02][]


When you view a signed commit, you'll see a badge indicating if the signature could be verified using any of the contributor's GPG keys added to GitHub. Many open source projects and companies want to be sure that a commit is from a verified source.


## GPG (GNU Privacy Guard)

If you want to sign anything you'll need to get GPG configured, generate a GPG key and your personal key installed.

**Note**: If you expect to use GPG more extensively, I strongly advise you to read more documentation, refer to the links at the end of this article.


### Installing

Install the core GPG command line tools, which are intended to be used in a terminal. If, you prefer a graphical user interface (or GUI) for accessing GPG functionality (e.g. encrypting email communications, or encrypting documents in a GUI text editor), refer to the links at the end of this article.


###### Red Hat / CentOS

``` console
$ yum install gnupg
```


###### Ubuntu / Debian

``` console
$ apt-get install gnupg
```

###### Mac OS X

The easiest way to install the GPG command line tools is to install [Homebrew][], a package management system that makes thousands of software packages available for install on Mac.

When that’s complete, install the GPG software package. The last two package will be used for storing the GPG key passphrase in OS X’s keychain.

```
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew doctor
$ brew install gnupg gnupg2 gpg-agent pinentry-mac
```

Download and install the [GPG and GPG command line tools][] for your operating system like **VMS**, **GPG4Win**.

**Note**: Steps below are performed on OSX. Sorry Linux users, but you probably know how to do this stuff already.


### Generate

Before you generatea a GPG key, check for existing GPG keys.

``` console
$ gpg -k

/Users/akinjide/.gnupg/pubring.gpg
----------------------------------
pub   4096R/EA43D3E1 2016-08-30
uid       [ultimate] Akinjide Bankole (Git signing key) <r@akinjide.me>
sub   4096R/303070EE 2016-08-30
```

If you don’t have a key installed or you don't want to use any that are available for signing commits, you can generate one with `gpg --gen-key`.

``` console
$ gpg --gen-key
```

- You'll need to specify the kind of key you want, **RSA and RSA** is default.
- Use **4096** as your key size but there are options for others.
- Use the default selection (indicating key doesn't expire) when selecting the length of time the key should be valid.
- After verifying your selections are correct.
- Use your email address for Github account when prompted for user ID information.
- Type a secure passphrase, make the password as long as possible, but something you'll not forget as there's no way to recover it if forgotten (Consider making a backup copy of your private key).
- Copy your pub key by using the email you provided earlier.

``` console
$ gpg --export --armor youremail@example.com > pubkey.asc

# your GPG pub key, should begin with
# -----BEGIN PGP PUBLIC KEY BLOCK-----
# and end with
# -----END PGP PUBLIC KEY BLOCK-----
```

The relationship between private and public key is actually very simple. Anything encrypted using the public key can only be decrypted with the related private key. Therefore, you'll provide your public key to another person, and they'll provide you with their public key. Anything encrypted to your public key can only be decrypted by you. Anything encrypted to the other person’s public key can only be decrypted by the other person.

The next step is to upload the public key -- **pubkey.asc** you exported earlier to Github. Github supports **RSA**, **EIGamal**, **DSA**, **ECDH**, **ECDSA**, **EdDSA**. If you add a key generated with an unsupported algorithm, you may encounter an error.


## Signing Commits

In more recent versions of Git (v1.7.9 and above), you can sign individual commits. If you’re interested in signing commits directly, when committing changes in your local branch, add the -S flag to the git commit command.

After you create your commit, provide the passphrase you set up when you generated your GPG key.

``` console
$ git commit -S -m your commit message

# Creates a signed commit
You need a passphrase to unlock the secret key for
user: "Akinjide Bankole (Git signing key) <r@akinjide.me>"
4096-bit RSA key, ID EA43D3E1, created 2016-08-30

[master fd52e21] signed commit
 1 file changed, 3 insertions(+), 3 deletions(-)
```


### Adding GPG to Git

To sign all commits, set the options in your global git config. If your committer email matches the email in your GPG key, you're off and running. All your commits will be signed and they'll show up as verified on Github.

To set your GPG signing key in Git, substituting in the GPG key ID you'd like to use. Copy your GPG **sec key** ID.

``` console
$ gpg --list-secret-keys --keyid-format LONG

/Users/akinjide/.gnupg/secring.gpg
----------------------------------
sec   4096R/<your-signing-key-sec-id> 2016-08-30
uid                          Akinjide Bankole (Git signing key) <r@akinjide.me>
ssb   4096R/6018CA62303070EE 2016-08-30
```

To set all commits for a repository to be signed by default, in Git versions 2.0.0 and above, run `git config commit.gpgsign true`. To set all commits in any local repository on your computer to be signed by default, run `git config --global commit.gpgsign true`.

``` console
git config --global commit.gpgsign true
git config --global user.signingkey <your-signing-key-sec-id>
git config --global gpg.program gpg1
```

Now Git will use your key by default to sign commits if you want.

**Note**: Command Line Interface (or CLI) n00bs run to Github Desktop apparently it does not support GPG signing. :(

To see and verify these signatures, there is also a `--show-signature` option to `git log`.

``` console
$ git log --show-signature -1

commit fd52e21f54bba0a33a32da706aa52bc0155503c2
gpg: Signature made Mon Nov 14 19:49:17 2016 WAT
gpg:                using RSA key ID EA43D3E1
gpg: Good signature from "Akinjide Bankole (Git signing key) <r@akinjide.me>"
Author: Akinjide Bankole <r@akinjide.me>
Date:   Mon Nov 14 19:49:17 2016 -0700

    signed commit
```

``` console
$ git push
# Push your local commits to the remote repository.
```

**Note**: If you’re not interested in signing commits. You can add the `--no-gpg-sign` flag to the git commit command.

``` console
$ git commit --no-gpg-sign -m your commit message
```

Don't forget to upload your public key to Github!  There needs to be a three-way match on your email for Github to show the commit as 'verified': The commit email, Github email, & the email associated with the public key.


### Storing GPG Key passphrase

If you don’t want to have to enter your passphrase every time you sign a commit, there are a few steps to get that working. Otherwise, you can stop here.

Storing passphrase should be easier on Windows using [GPG4Win][]. On a Mac, the [gpg-agent][] doesn’t automatically integrate with the OSX keychain like ssh-agent but acts similarly in that it caches the keys in memory, providing a socket that Git and GPG use to communicate for key storage/retrieval, it requires more setup, so more work is required. 

You'll have to edit: "~/.gnupg/gpg.conf", "~/.gnupg/gpg-agent.conf", and "~/.bash_profile" or "~/.zshrc" -- depending on whether you use **bash** or **zsh**.

GPG software configuration is stored in your home directory within the "~/.gnupg/gpg.conf" file.  Edit this file using your favorite command line text editor (vim, nano, pico, emacs, etc).

###### gpg.conf

``` console
$ vim ~/.gnupg/gpg.conf

# Uncomment within config (or add this line)
# Tells GPG to use gpg-agent
use-agent

# Silences the "you need a passphrase" message
# Potential source of issues, but I haven't noticed any
# may prevent the successful interactive use of some operations.
batch
```

###### gpg-agent.conf

``` console
$ vim ~/.gnupg/gpg-agent.conf

# Enables GPG to find gpg-agent
use-standard-socket

# Connects gpg-agent to the OSX keychain via the brew-installed
# pinentry program from GPGtools. This is the OSX 'magic sauce',
# allowing the GPG key's passphrase to be stored in the login
# keychain, enabling automatic key signing.
pinentry-program /usr/local/bin/pinentry-mac

# If you want to adjust how long the agent holds onto your password,
# adjust the default-cache-ttl setting in ~/.gnupg/gpg-agent.conf.
# The setting is expressed in seconds, so if you want to type your
# password once per day, set it to 86400.
default-cache-ttl 86400
```

###### .bash_profile / .zshrc

Copy your GPG **pub key** ID, before you export **GPGKEY** below.

``` console
$ gpg -k

/Users/akinjide/.gnupg/pubring.gpg
----------------------------------
pub   4096R/<your-signing-key-pub-id> 2016-08-30
uid       [ultimate] Akinjide Bankole (Git signing key) <r@akinjide.me>
sub   4096R/303070EE 2016-08-30
```

``` console
$ vim ~/.zshrc

# In order for GPG to find gpg-agent, gpg-agent must be running,
# and there must be an env variable pointing GPG to the gpg-agent socket.
# This little script, which must be sourced
# in your shell's init script (ie, .bash_profile, .zshrc, whatever),
# will either start gpg-agent or set up the
# GPG_AGENT_INFO variable if it's already running.

# Add the following to your shell init to set up gpg-agent automatically for every shell

# gpg-agent
export GPG_TTY=$(tty)
export GPGKEY=<your-signing-key-pub-id>

[ -f ~/.gpg-agent-info ] && source ~/.gpg-agent-info
if [ -S "${GPG_AGENT_INFO%%:*}" ]; then
  export GPG_AGENT_INFO
else
  eval $( gpg-agent --daemon --write-env-file ~/.gpg-agent-info )
fi
```

Open a new shell and check that **GPG_AGENT_INFO** is set

``` console
$ echo $GPG_AGENT_INFO

# /Users/akinjide/.gnupg/your-agent-location
```

## Thoughts


![Higher Thoughts Sketch][]


I personally have enjoyed signing commits and that shiny green tag it adds to my commits, if you decide to use this in your normal workflow, you’ll have to make sure that everyone on your team understands how to do so. Otherwise, you might end up spending time helping them figure out how to rewrite their commits with signed versions.

I encourage you to learn more about GPG, Cryptography than what is explained within this article.  It is intended only to get you started. If you'd make use of the resources below it'll make me happy.


## Resources

If you'd like to learn more, here are some resources to get you going.

- [GnuPG][] (Software Website)
- [GnuPG Wikipedia][]
- [GPG Suite][] (GUI for Mac OS)
- [Using GPG Suite on Mac OS][]
- [GPG4Win][] (GUI for Windows)
- [Using GPG4Win on Windows][]
- [Archlinux GnuPG][]

  [Four Symbols Seal Sketch]: /static/images/2017/four-symbols-seal-sketch.png "Four Symbols Seal Sketch"
  [Screen Shot 2016-12-31 14 25 02]: /static/images/2017/Screen%20Shot%202016-12-31%2014%2025%2002.png "Screen Shot 2016-12-31 14 25 02"
  [Homebrew]: http://brew.sh "Homebrew - Package Manager for Mac OS X"
  [GPG and GPG command line tools]: https://www.gnupg.org/download/ "GPG and GPG command line tools"
  [Higher Thoughts Sketch]: /static/images/2017/higher-thoughts-sketch.jpg "Higher Thoughts Sketch"
  [GnuPG]: https://gnupg.org "GnuPG Software Website"
  [GnuPG Wikipedia]: https://en.wikipedia.org/wiki/GNU_Privacy_Guard "GnuPG on Wikipedia"
  [GPG Suite]: https://gpgtools.org/gpgsuite.html "GUI for Mac OS"
  [Using GPG Suite on Mac OS]: https://ssd.eff.org/en/module/how-use-pgp-mac-os-x "Using GPG Suite on Mac OS - Electronic Frontier Foundation"
  [GPG4Win]: https://www.gpg4win.org "GUI for Windows"
  [gpg-agent]: https://linux.die.net/man/1/gpg-agent "GPG Agent"
  [Using GPG4Win on Windows]: https://ssd.eff.org/en/module/how-use-pgp-windows "Using GPG4Win on Windows - Electronic Frontier Foundation"
  [Archlinux GnuPG]: https://wiki.archlinux.org/index.php/GnuPG "Archlinux GnuPG"