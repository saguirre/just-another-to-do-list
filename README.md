<a name="readme-top"></a>
<br />
<div align="center">
<h3 align="center">Just Another To-Do list app</h3>

  <p align="center">
    Just another completely unnecessary To-Do list app!
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#why">Why</a></li>
      </ul>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
      <ul>
        <li><a href="#tools-used">Tools used</a></li>
      </ul>
    </li>
    <li>
      <a href="#starting">Starting up</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



## About the project

The objective of this project is to allow you to resolve an issue that has previously been unsolvable for milennia: Having a To-Do list web app!

## Why
Besides the obvious challenge of solving an issue that has pestered humanity for ages, this project also aims to be a tutorial for the developer (me) in order to build a SaaS app with payment integrations.

## Features

### Registering a new account
Users should be able to sign in using a Social sign on. For this project, you will be able to sign in using Google, Github or Discord. There will be no need to register if you don't wish to save your to-do lists for posterity. You can use the app freely and anonymously!

### Logging in
Logging in will allow you to view your previous to-do lists, manage your subscriptions and it also allows for added features like a pomodoro timer and usage based statistics with awesome looking charts!

### Dashboard
In your dashboard you can view all your to-do lists, as well as your usage statistics (if you've given up your money - I mean, subscribed). You can also review and manage your subscription and checkout your payment history.

### Subscribe
By subscribing (you can do it on a monthly or yearly basis), you will unlock premium features such as your usage based statistics and a pomodoro timer for your coding-ninja productive needs. Don't worry, subscribing is amazingly cheap, since it is only meant to cover the expenses used for building and hosting this project (and maybe get a lambo)!

### Unsubscribe :(
Got bored? Got way too many subscriptions and don't wanna give up on that Disney+ subscription you use once a quarter? You can also unsubscribe at any time! We'll suspend the payments and will be ready for you if you ever decide to get your tasks in order!

### Pomodoro timer
As mentioned previously, if you've (incredibly) decided to spend some money on this project, you can also use a pomodoro timer on your tasks, which will later be tracked in your usage statistics (more in the next feature).

### Usage statistics
View analytics on your completed tasks, filter through to-do lists, and gain insight on your pomodoro-time productivity! 

### Additional features
These could be stuff like dedicated to-do lists for your everyday tasks that don't involve productivity! Something like shopping lists, travel itinerary lists and stuff of the sort.

### General considerations
* The app should be localized (initially in english and spanish)
* There MUST be a dark mode
* There should be really cool animations and graphics!
* Animations should be customizable (duration, disabling)
* There should be funny easter eggs around the app
* There should be funny phrases made to seem as tips

## Tools used

In this section you get a glimpse of the tools that were used to build this project

* [![Next][Next.js]][Next-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Vercel][Vercel]][Vercel-url]
* [![Supabase][Supabase]][Supabase-url]
* [![Postgres][Postgres]][Postgres-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Stripe][Stripe]][Stripe-url]
* [![Github][Github]][Github-url]
* [![Git][Git]][Git-url]

## Starting up

You're probably wondering: "That's nice and all but... how do I get started??". Here's how!

### Prerequisites

* Have Git installed
* Have npm or yarn installed
* Clone the repo!
```sh
   git clone https://github.com/saguirre/just-another-to-do-list.git
   ```

### Installation

* Move into the project folder
* Inside the folder `just-another-to-do-list` you should run the following command:
```sh
  cp .env.example .env
```

## Contact

* Santiago Aguirre - saguirrews@gmail.com


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[Vercel]: https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[Stripe]: https://img.shields.io/static/v1?style=for-the-badge&message=Stripe&color=008CDD&logo=Stripe&logoColor=FFFFFF&label=
[Stripe-url]: https://stripe.com/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://prisma.io/
[Typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Postgres]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[Github]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white
[Github-url]: https://github.com/
[Git]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Git-url]: https://git-scm.com/
