# DAYPaTRON- The Power is in Each of Us

## Demo

Check out the live demo: [DayPatron Demo](https://day-patron-next.vercel.app/)

## Overview

DayPatron is a web application where you can learn about products, understand how they are used, make purchases, and write reviews.

### Pages

The project consists of 15 pages:

- **Home Page**: Provides main information about DAYPATRON products, video content, and mission statement.
- **About Page**: Offers users detailed information about DAYPATRON.
- **Products Page**: Displays all products available on the website.
- **Partners Page**: Information about DAYPATRON's partners and collaborations.
- **Contacts Page**: Contact information and form for inquiries.
- **Dashboard**: User dashboard for managing personal information and settings.

### Support Pages

- **Warranty**: Information about product warranties.
- **Rules & Reviews**: Guidelines for writing and submitting reviews.
- **Privacy**: Details about the privacy policy.
- **Guide**: Instructions and guides for using the website.

### Technologies Used

- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Next.js**: A React framework for server-side rendering and generating static websites.
- **Auth.js**: Authentication library for secure user authentication.
- **Prisma**: An ORM for seamless database interaction.
- **MongoDB**: NoSQL database for flexible and scalable data storage.
- **Vercel**: Deployment and hosting platform for web applications.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **React**: A JavaScript library for building user interfaces.

### SEO Optimization

This project follows best practices for SEO optimization:

- **Server-side Rendering**: With Next.js, pages are rendered on the server to ensure that search engines can index the content effectively.

- **Meta Tags**: Essential meta tags for SEO, such as title, description, and keywords, are included.
- **Responsive Design**: Ensures that the website is accessible and looks great on all devices, enhancing user experience and search engine rankings.
- **Clean URLs**: Uses clean and descriptive URLs to improve search engine readability.
- **Performance Optimization**: Optimized images, lazy loading, and efficient coding practices are employed to ensure fast loading times, which is crucial for SEO.

## Home_Page

![Home_Page](/public/images/readme-img/Home.png)

## Products

![Products_Page](/public/images/readme-img/Products.png)

## Product

![Product_Page](/public/images/readme-img/Product.png)

## Drawer

![Cart](/public/images/readme-img/Cart.png)

## Registration

![Registration](/public/images/readme-img/Registr.png)

## Guid

![Guid_Page](/public/images/readme-img/Cart.png)

## Response_design

### Mobile

<img src="/public/images/readme-img/Mobile-1.png" alt="Response Design Mobile 1" width="200" />
<img src="/public/images/readme-img/Mobile-2.png" alt="Response Design Mobile 2" width="200" />

### Tablet

<img src="/public/images/readme-img/Tablet.png" alt="Response Design Tablet" width="300" />

## Code Structure

```
DayPatron
│
├── public
│ └── images
│
│ ├── src
│ ├── actions
│ │ └── cart.ts
...
..
.
│ ├── api
│ │ ├── auth.ts
│ │ └── [...nextauth]
│ │   └── route.ts
│ │
│ ├── Products.tsx
│ │ ├── Checkout.tsx
│ │ ├── Dashboard.tsx
│ │ └── AboutUs.tsx
│ │   └── Contacts.tsx
...
..
.
│ ├── components
│ │
│ ├── lib
│ │ ├── db
│ │ │ └── content.json
│ │ ├── hooks
│ │ └── services
│ │   └── types.ts
│ │
│ ├── Utils
│ │ ├── font.ts
│ │ └── formatPrice.ts
│ │
│ ├── prisma.ts
│ ...
│ ..
│ .
└── middleware.ts

```

## Tech Stack

<p align="left">
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
    <img src="https://techicons.dev/icons/nextjs" alt="Vue" width="100" height="100"/>
  </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
    <img src="https://i.gyazo.com/967cdb89a3774e1f3e3ca6cf6baee755.png" alt="Tailwind" width="100" height="100"/>
  </a>
  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="HTML5" width="100" height="100"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="JavaScript" width="100" height="100" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript" width="100" height="100" />
    <a href="https://pinia.vuejs.org/" target="_blank" rel="noreferrer">
    <img src="https://pinia.vuejs.org/logo.svg" alt="Pinia" width="100" height="100" />
</p>
```
