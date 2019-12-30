---
aliases:
  - /my-blog-architecture/
date: "2020-01-06"
description: "I get questions about my blog and the technologies I used. If you're reading this, means I finally published :)"
slug: "my-blog-architecture"
tags:
  - "personal development"
title: "My Blog Architecture"
---


![No Regrets Sketch][]


I get questions around what technologies I used for my blog, how I handled continuous deployment and the monthly cost of running my blog. My blog isn't an entirely new creation but rather a modification of someone I really admire, although I don't have full context on how he handles some processes, thereby most modifications came from my own experience and research.

[Source code for my blog on Github][] can be used freely or referenced and I am willing to give additional context if required, just mail me.


## Technology Stack

Choosing a technology stack wasn't hard since the core of my blog actually exists already, I just had to decide on the cloud provider to use, domain name provider and how to manage continuous deployment.


![Akinjide Blog Architecture Diagram][]


**Hugo**

I know there are several static site generators like [Jekyll][], [Gatsby][]. But I particularly like [Hugo][] because it was built using Go, configuring and tweaking Hugo is super easy making it beginner-friendly. The Hugo community is huge and the documentation is easy to navigate and constantly updated which indicates dedication from the contributors.

Hugo is open source and completely free with a well-defined structure with stacks of customizable themes and intuitive command-line programs which allows you to integrate with any build process program. I use [GNU Make][] to run commands like *hugo server* and deploying to AWS S3. Check out Hugo [Documentation][] and [Showcase][] for more.

**Google Analytics**

Sometimes you need to know:

- When do your users visit?
- Where are your users?
- What are your top devices?
- What pages do your users visit?
- How are your active users trending over time?
- and How do you acquire users?

[Google Analytics][] gives you that insight by tracking and reporting your website traffic and usage, although due to its ubiquity, it raises some privacy concerns since it tracks each website visits using users' IP Address to accurately determine users geographic location. I personally don't need fine-grained details about my viewers but rather aggregate data and that's why I have the most minimal analytics configuration.

In the future, I might pull off this service integration but for now, I need to know how well my articles are performing as this will guide what I write about and I'd know what my audience finds interesting.

**Travis CI**

[Travis CI][], [CircleCI][] and others share a similar goal but the difference is support for open source testing. Travis CI is home for open source with intuitive UI and it supports build on Linux, Windows, and macOS, unlike CircleCI that requires a monthly fee to support all platforms even for open source projects.

Setting up Travis CI is super easy as well and documentation is easy to follow through and it integrates well with most cloud providers and numerous programming language.

**Mailchimp**

Pushing email notifications to users will keep them engaged with your blog. Mailchimp provides seamless and affordable service for managing subscribers, managing email templates and sending emails to your audience. The pricing is reasonable at $0/mo, you can maintain 2000 subscribers and with $7/mo, you can bump that number to 50,000.

Mailchimp offers several other marketing channels but I utilize just Email, you can definitely give them a try and see if it fits your brand or use case. My push email notification frequency is whenever I publish a new article and I am currently at 150 subscribers.

**Amazon Web Services**

[AWS][] offers reliable, loosely coupled but well-connected and inexpensive cloud computing services. I definitely recommend AWS for low and medium scale services, applications or businesses that want 100% cloud computing because it saves money.

- [IAM][] - configures user with limited access for Travis CI deployment to S3 and CloudFront distribution invalidation.
- [Certificate Manager][] - handles issuing SSL Certificates for CloudFront distribution.
- [S3][] - provides security and data availability of my blog static content.
- [CloudFront][] - provides fast global low latency content delivery (CDN[^1]) and custom configurations like force HTTP to HTTPS.

I have a recurring cost of about $0.10/mo and that's largely due to some free services like Certificate Manager and reasonable pricing. I strongly recommend you have a look at the pricing and also the monthly limits (i.e. CloudFront $0.0090/10,000req), which means you won't pay if you get less than 10,000req.

**GitHub**

[GitHub][] is a development platform that is designed to host projects and foster collaboration by providing tools integration for open source, teams or individuals. It's fairly priced for individuals paying $0/mo for a basic account and $7/mo for a pro account, although, I don't really see much value in the pro account except you have large collaborators on your project.

Since GitHub integrates pleasingly with services like *Travis CI*, I had my blog source code hosted on its server as a public repository and hooked up with Travis CI for continuous deployment of my blog compiled code to AWS S3.

Setting up a public repository and hooking up with Travis CI was trivial, with just a [.travis.yml][] file configured with branch triggers to compile and deploy my source code to AWS S3 whenever it detects changes on the master branch.


## Drawbacks

#### Comments

Since my blog is statically generated and without a database, it becomes a problem processing comments, however, there are several embeddable comment system which I might eventually look into. But I am not actively looking to improve this and I believe if my readers really need to connect with me, they'd shoot me an email which to me proves someone cares about the content I publish.

If you are thinking about architecting your own blog, I suggest you look at [Disqus][] as I have reviewed the software and it's really nice however not free software. Another option is creating a self-hosted comment service and integrating it into your blog as a widget or module.

#### Content Management

Currently, all the articles on my blog are originally markdown files converted to hypertext markup files during deployment, and this prevents quick updates to those files without repeating the entire deployment phase. Since there is no hosted database storing my articles I need to rely on both GitHub repositories to store this content and use git commits as history management for reverting to old versions of my articles.


## Final Thoughts

I definitely didn't cover every aspect of my blog (i.e. [PWA][][^2]) but I hope this article will inspire you to build your own blog or even modify your existing blog architecture to make it simple and scalable while saving cost.

  [^1]: [CDN][] refers to a geographically distributed group of servers working together to provide fast delivery of internet content.
  [^2]: Progressive Web Apps provides fast and reliable User Experiences and offline engagment for users, see [Google Dev Summit Videos][] and install my blog.

  [No Regrets Sketch]: /static/images/2020/no-regrets-sketch.png "No Regrets Sketch"
  [Source code for my blog on Github]: https://github.com/akinjide/akinjide-www "akinjide/akinjide-www: Mein persönlich webseite und blog"
  [Akinjide Blog Architecture Diagram]: /static/images/2020/akinjide-blog-architecture-diagram.jpg "Akinjide Blog Architecture Diagram"
  [Jekyll]: https://jekyllrb.com "Jekyll – Transform your plain text into static websites and blogs"
  [Gatsby]: https://www.gatsbyjs.org "GatsbyJS"
  [GNU Make]: https://www.gnu.org/software/make/ "Make – GNU Project – Free Software Foundation"
  [Hugo]: https://gohugo.io "Hugo"
  [Documentation]: https://gohugo.io/documentation/ "Hugo Documentation – Hugo"
  [Showcase]: https://gohugo.io/showcase/ "Showcase – Hugo"
  [Google Analytics]: https://analytics.google.com/analytics/web/ "Google Analytics"
  [Travis CI]: https://travis-ci.org "Travis CI – Test and Deploy Your Code with Confidence"
  [CircleCI]: https://circleci.com "Continuous Integration and Delivery – CircleCI"
  [AWS]: https://aws.amazon.com "Amazon Web Services (AWS) – Cloud Computing Services"
  [IAM]: https://aws.amazon.com/iam/?nc2=h_ql_prod_se_iam "AWS Identity and Access Management – Amazon Web Services"
  [Certificate Manager]: https://aws.amazon.com/certificate-manager/?nc2=h_ql_prod_se_cm "AWS Certificate Manager – Amazon Web Services"
  [S3]: https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3 "Amazon S3 – Amazon Web Services"
  [CloudFront]: https://aws.amazon.com/cloudfront/?nc2=h_ql_prod_nt_cf "Amazon CloudFront – Amazon Web Services"
  [GitHub]: https://github.com "GitHub – Website"
  [.travis.yml]: https://github.com/akinjide/akinjide-www/blob/master/.travis.yml "akinjide-www/.travis.yml at master · akinjide/akinjide-www"
  [Disqus]: https://disqus.com "Disqus – Express Yourself"
  [PWA]: https://developers.google.com/web/progressive-web-apps/ "Progressive Web Apps – Google Developers"
  [CDN]: https://en.m.wikipedia.org/wiki/Content_delivery_network "Content delivery network – Wikipedia"
  [Google Dev Summit Videos]: https://www.youtube.com/playlist?list=PLNYkxOF6rcIAWWNR_Q6eLPhsyx6VvYjVb "Progressive Web App Summit 2016 – Youtube"
