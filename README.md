## HOW TO RUN CODE

```bash
git clone https://github.com/conortmills/BiddingSystemAssignment
cd BiddingSystemAssignment
npm install
```


## Set up environment variables

Create `.env` file in the root: 
*was having issues with .env.local and the current version of prisma

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luxor"
NEXTAUTH_SECRET=dev-secret


## Set up the database

```bash
createdb luxor
npx prisma db push
npm run seed
```


## Run the app

```bash
npm run dev
visit http://localhost:3000
```

## Logging in

use any of the seeded emails:

- `user1@example.com`
- `user2@example.com`
..
*no password required


## ANSWERING QUESTIONS

## HOW WOULD I MONITOR?

Sentry for error tracking and exception alerts

Health checks for monitoring uptime and API availability

Logging key actions (bids, updates, auth events) for traceability

Postgres metrics to catch slow queries and connection issues early

## SCALABILITY AND PERFORMANCE

Optimize DB access
-indexed fields
-reduce over-fetching with select and include

Cache hot endpoints

Use RSC + minimal client JS

Ensure horizontal scalability with stateless architecture

## DECISIONS vs OPTIMAL 

*generally tried to use the suggested stack, was not familiar with shade and required refreshers with next js

Simple mocked authentication vs full auth 

Loading of all data upfront rather than paginating

Using reload after changes rather than react query or a global state manager

Polish styling + mobile optimization

Improve UX by displaying higher priority content first

No automated testing vs unit tests for APIs

Would have spent more time testing edge cases if possible (duplicates, character miss matches, form type controls, API spamming)