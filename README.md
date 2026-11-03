# Used Textbook Marketplace

**Team:** Aryan, Darsh, Samhita

## Problem Statement

Every year, seniors have textbooks they no longer need, while juniors spend a lot buying new ones, and there is no simple place on campus where the two can find each other. This project is a marketplace for that. A seller lists a book with their roll number, subject, condition and asking price. Buyers make offers, the seller accepts one offer (which reserves the book) and marks it sold after the hand-over. Only the seller can change the price, remove the listing or decide on offers, and there are no logins. It is built with a FastAPI + SQLite backend (port 8001) and a React frontend.

## Database

One SQLite file, `textbook.db`, with two tables:

- **listings:** id, seller_roll, title, subject, condition, price, listed_on, status
- **offers:** id, listing_id, buyer_roll, offer_price, status, offered_on

## API Endpoints

| # | What it does | Method | Path | Who | Request body |
|---|--------------|--------|------|-----|--------------|
| E1 | Browse available listings | | | Samhita | |
| E2 | View one listing | | | Samhita | |
| E3 | List a book | | | Samhita | |
| E4 | Change price | | | Samhita | |
| E5 | Remove listing | | | Aryan | |
| E6 | Make an offer | | | Aryan | |
| E7 | Accept/decline offer | | | Aryan | |
| E8 | Mark sold | PATCH | /listings/{id}/sold | Darsh | seller_roll |
| E9 | Student's listings | GET | /students/{roll_no}/listings | Darsh | none |
| E10 | Student's offers | GET | /students/{roll_no}/offers | Darsh | none |