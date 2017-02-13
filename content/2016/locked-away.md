---
aliases:
  - /locked-away/
date: "2016-08-03"
description: "My best attempt at explaining what I actually did, and how I got locked out of my Apple iCloud account."
slug: "locked-away"
tags: ["personal development"]
title: Locked Away
draft: true
---


![Hulk Beats Superman Sketch][]


Apple has offered two-factor authentication for a while, although certain aspects of its iCloud storage service have remained curiously unprotected. In the wake of some furor surrounding the service's security, Apple's two-factor authentication now applies to more of iCloud — if, and only if, you activate it.
Ars Technica put the new two-factor authentication through its paces. As recently as last week, anyone with an Apple username and password could access a user's iCloud storage, which backs up documents and photos from iPhones and iPads by default. Apple passwords are not terribly difficult to acquire; software like the Elcomsoft Phone Password Breaker (intended for legitimate password recovery) can often do the trick.

After activating two-factor authentication on iCloud, the Ars Technica researchers found that they received an unspecified HTTP request error when trying to download backups with Elcomsoft. Two-factor authentication will now also protect against those who try to access your iCloud account directly — if they've come across your password from a data breach, for example.
In case you've never used two-factor authentication, it's a simple idea that can thwart just about any kind of online account compromise. Instead of logging in with a simple username and password, the service in question will also send a temporary code to your phone or another e-mail address. Unless a malefactor also has your phone or email login details in his or her possession, your data remains safely yours.
There's only one problem: As two-factor authentication is an optional process, most iCloud users are still unprotected. Not only does this leave their data potentially unprotected, but also opens up another potential catastrophe: If an unauthorized user activates two-factor authentication, that effectively locks the legitimate owner out of his or her account.
If you use iCloud, consider activating two-factor authentication by following the instructions on Apple's website. Alternatively, back up your data manually rather than automatically syncing it to iCloud. The process is more cumbersome, but also less prone to intrusion.




Apple drops Recovery Key in new two-factor authentication for El Capitan and iOS 9
Apple said at WWDC it would build a more integrated and comprehensive two-factor security system into its next OS releases, and today explains what that means.

In early June, Apple said two-factor authentication would be tightly integrated into OS X 10.11 El Capitan and iOS 9, but provided little detail as to what that means. The current setup is scattered across sites and methods in order to deliver a second one-time use, time-limited code or other method of verification when a user logs in to an Apple site or on an Apple device with an Apple ID set up for it.

Apple today posted a detailed explanation about how two-factor authentication works starting with the public betas of iOS 9 and El Capitan.

Among other changes, the Recovery Key option that has tripped up users in the past, and led in some cases to users having to abandon an Apple ID as permanently unavailable, has been removed, an Apple spokesperson confirmed. With the new system, Apple customer support will work through a detailed recovery process with users who lose access to all their trusted devices and phone numbers.

Two-factor authentication systems can deter or defeat attempts to log into accounts remotely, as an attack has to not just have a password, but also access to a device, computer, or phone number belonging to the target account. This turns hacking from “wholesale” to “retail”: unless a flaw is found in the underlying system, each protected account has to be cracked one at a time.

A longer code, a simpler process

As in the existing system, you have to set up at least one—but up to any number—of iOS and OS X systems as “trusted devices.” These appear in a list in your Apple ID account and can be removed from there, as well as in OS X in iCloud system preferences, by clicking Account Details, and in iOS 9 in Settings > iCloud > Account. You also have to verify at least one phone number as a backup.

Currently, the phone has to receive text messages, but in the update, a phone can receive texts or phone calls, which indicates an option will be to have the code spoken aloud by an automatic system, typical with other two-factor systems.

The current system, labeled “two-step” by Apple, requires an (ironic) extra step during login. When you log in at an Apple site that supports two-step now, after entering an Apple ID account name and password, a pop-up dialog or screen of some sort prompts you to select a trusted device or trusted phone number to which a four-digit code is sent, and then enter that code in a following step.

In the new system for El Capitan and iOS 9, the need to specify a device to which a code is sent is removed. After entering the account name and password, Apple says all trusted devices running the newer OSes will display a six-digit verification code. That code, as before, only appears when a iOS device or OS X system is unlocked. Apple notes there will be an option to send the code to a trusted phone from the code-entry page by clicking “Didn’t Get a Code?”

While Apple doesn’t specify it here, in the current system only some Apple sites and systems require two-step. Apple developers; users of its iTunes Connect system for book, music, and app uploads; and other sites allow access with just an account name and password, even for two-step-enabled accounts. This is likely to change as part of this integration, as these are all holes that can be exploited by wily crackers.

The current two-step method will continue to work indefinitely, so as not to lower security for older users nor break systems. When using iOS 8 or earlier or OS X 10.10 Yosemite or earlier, a verification field won’t appear. Rather, after attempting a login with the Apple ID and password, and having the verification code appear on trusted devices, a user will then need to log in again appending the six-digit code at the end of the password in the password field. Only El Capitan and iOS 9 devices will display six-digit codes.

The use of a phone number as part of the two-factor system provides better flexibility for users, but it can also provide an opening for individual targeting. The SMS system isn’t designed for security and integrity, and iOS 8 and Yosemite’s SMS Relay option allows text messages to be received on computers logged into the same iCloud account as an iPhone anywhere in the world. (See “Private I,” October 23, 2014.)

The end of Recovery Key

The current two-step system relies on two factors, but also included a third element for regaining access to an account: Recovery Key. The 14-character Recovery Key is generated during the two-step signup process and is meant as a backup. If you forget your password or lose access to all trusted devices and your phone number (but not both), the Recovery Key was the only way to restore your Apple ID account.


Without it, the data and purchases associated with that ID were lost for good. This could also be triggered if Apple decided your account was under attack and reset your password. Some reports indicated that Apple’s customer service could reset accounts without the Recovery Key, but it seemed to be available only in limited cases and with support’s discretion.

In the new two-factor authentication system, Apple confirmed that Recovery Key is gone. Instead, Apple provides more general guidance, noting that you might need to work through what it’s calling in lower case “account recovery” if you “can’t sign in, reset your password, or receive verification codes.”

The process described in the FAQ should help overcome social engineering and identity theft, widely described as ways in to user accounts at many sites over the last several years. Apple will get in touch via a “verified phone number,” which one assumes is one associated with your Apple ID account—it’s worth noting that one can associate multiple numbers there.

There’s a process that’s loosely described as having one’s case reviewed, and then needing to provide detailed information to prove you’re the rightful owner of the Apple ID account. “The process is designed to get you back into your account as quickly as possible while denying access to anyone who might be pretending to be you,” the FAQ notes.

Not immediately available to all beta testers

Not every account will be eligible to sign up during beta testing. Apple notes, “Individual accounts will be made eligible gradually until we can offer the service to everyone.”

If an account is eligible, a user will be alerted after signing in with an Apple ID on a public beta in the Setup Assistant. Apple says users will see a “two-factor authentication” screen if they can opt in.



  [Hulk Beats Superman Sketch]: /static/images/2016/hulk-beats-superman-sketch.jpg "Hulk Beats Superman Sketch"