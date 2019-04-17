---
aliases:
  - /locked-away/
date: "2017-04-15"
description: "My best attempt at explaining what I actually did, and how I got locked out of my Apple iCloud account."
slug: "locked-away"
tags:
  - "personal development"
title: Locked Away
---


![Man Locked Behind Sketch][]


Apple has offered two-factor authentication for a while in the wake of some furor surrounding the service's security, although now applies to more of iCloud — if, and only if, you activate it. Two-factor authentication also protect against those who try to access your iCloud account directly — if they've come across your password from a data breach.

In case you've never used two-factor authentication, it's a simple idea that can thwart just about any kind of online account compromise. Instead of logging in with a simple username and password, Apple will also send a temporary code to your phone or another e-mail address. The system requires a user to have a second "trusted" device that is used to verify a user's identity in addition to an extra security code called the "Recovery Key". However, that Recovery Key also has the potential to completely lock you out of your account if you're being hacked.


## Undoing

I found that someone had tried to hack my iCloud account. Apple's two-factor system kicked in and locked my account, denying entry to me. When I went to dubbed iForgot, Apple's account recovery service, I assumed two of my password, Recovery Key or trusted device would unlock my account, as I was led to believe by an Apple support document. I discovered that there was no way back in without my recovery key. That’s when it hit me; I had my recovery key in my [1Password][] vault which I can't access. I was on the verge of losing important data, purchases associated with that ID and _mein_ "digital life" **:(**.

I called Apple customer support and was told that I had forfeited my Apple ID by losing my Recovery Key and that there was no way Apple can help me. I called back a second time.

> When an Apple personnel got back on the line, the story was just as bleak. “We take your security very seriously at Apple” I was told “but at this time we cannot grant you access back into your Apple account. We recommend you create a new Apple ID.”

After a couple more days of talking to Apple customer support, I continued to receive same responses:

> “We take your security very seriously at Apple, but at this time we cannot grant you access back into your Apple account. We recommend you create a new Apple ID”.

I was locked out of my account due to someone trying to hack into it and couldn't unlock it without a Recovery Key even though Apple's support document says it's possible with a trusted device. Eventually, I gave up abandoning my data and purchases associated with that ID! I created a new Apple ID without two-factor authentication and reset my devices allowing me to finally setup my devices as new, although my iPhone wouldn't sign out of my previous ID.


## My Thoughts

If you'd like or use Apple two-factor authentication you should take far greater care in protecting and remembering where you store your Recovery Keys, as losing it could permanently lock you out, your data and purchases associated with that Apple ID would be lost for good with Apple unable to do anything to help.

Although some reports indicated that Apple’s customer service could reset accounts without the Recovery Key, but it seemed to be available only in limited cases and with support’s discretion.

  [Man Locked Behind Sketch]: /static/images/2017/man-locked-behind-sketch.png "Man Locked Behind Sketch"
  [1Password]: https://www.1password.com "1Password"
