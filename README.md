# Used Textbook Marketplace

**Team:** Aryan, Darsh, Samhita

## Problem Statement

Every year, seniors have textbooks they no longer need, while juniors spend a lot buying new ones, and there is no simple place on campus where the two can find each other. This project is a marketplace for that. A seller lists a book with their roll number, subject, condition and asking price. Buyers make offers, the seller accepts one offer (which reserves the book) and marks it sold after the hand-over. Only the seller can change the price, remove the listing or decide on offers, and there are no logins. It is built with a FastAPI + SQLite backend (port 8001) and a React frontend.

## Database

One SQLite file, `textbook.db`, with two tables:

- **listings:** id, seller_roll, title, subject, condition, price, listed_on, status
- **offers:** id, listing_id, buyer_roll, offer_price, status, offered_on

## API Endpoints

| # | What it does | Method | Path | Request body | Success code | Error codes | Who |
|---|--------------|--------|------|--------------|--------------|-------------|-----|
| E1 | Browse available listings | GET | /listings?subject=&condition=&max_price= | none | 200 | 422 | Samhita |
| E2 | View one listing | GET | /listings/{listing_id} | none | 200 | 404 | Samhita |
| E3 | List a book | POST | /listings | seller_roll, title, subject, condition, price | 201 | 422 | Samhita |
| E4 | Change price | PATCH | /listings/{listing_id}/price | seller_roll, price | 200 | 403 (roll number is not seller's), 404 (unavailable values), 422 (if price is not within range) | Samhita |
| E5 | Remove listing | | | | | | Aryan |
| E6 | Make an offer | | | | | | Aryan |
| E7 | Accept/decline offer | | | | | | Aryan |
| E8 | Mark sold | PATCH | /listings/{listing_id}/sold | seller_roll | 200 | 400 (listing is not reserved), 403 (roll number is not seller’s), 404 (listing id doesn’t exist), 422 (missing or empty roll number) | Darsh |
| E9 | Student's listings | GET | /students/{roll_no}/listings | none | 200 |  | Darsh |
| E10 | Student's offers | GET | /students/{roll_no}/offers | none | 200 |  | Darsh |