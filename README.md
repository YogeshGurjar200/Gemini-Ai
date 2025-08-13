# Gemini AI Chat Application (Frontend)

A Gemini-style conversational AI chat application built with **React**, **Vite**, **Redux Toolkit**, **React Hook Form + Zod**, **Tai lwind CSS**, and **DaisyUI**.  
Features OTP-based authentication, login, logout, toggle dark theme, chatroom management, throttled search, , infinite scroll, and form validation.

---

## 🚀 Live Demo
[🔗 Live Link](https://gemini-ai-steel.vercel.app/)

---

## 📌 Project Overview

This project replicates a Gemini-style conversational AI interface with the following key features:

- **OTP Authentication** (Login/Signup) with country codes.
- **Country code fetching** from `restcountries.com` API.
- **Chatroom listing & search** with debounced filtering.
- **Infinite Scroll** for chatrooms.
- **Form validation** using React Hook Form + Zod.
- **Theming support** via DaisyUI.
- **State management** via Redux Toolkit.
- **LocalStorage persistence** for authentication ,theme and Chatroom state.
- **Responsive UI** optimized for mobile and desktop.

---

## 🛠 Tech Stack

- **Frontend Framework:** React + Vite
- **UI Library:** DaisyUI (Tailwind CSS)
- **State Management:** Redux Toolkit
- **Form Handling:** React Hook Form + Zod
- **Icons:** React Icons
- **API Client:** Axios
- **Routing:** React Router DOM
- **Build Tool:** Vite

---

## ⚙️ Setup & Run Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YogeshGurjar200/Gemini-Ai.git
   cd Gemini-Ai-main
   npm install
   npm run dev



🔍 Feature Implementation Details
|
1️⃣ OTP Authentication
Simulated OTP send & verify using setTimeout.

Country codes & flags fetched from restcountries.com.

Auth state persistence in LocalStorage:

json
Copy
Edit
{
  "isLoggedIn": true,
  "user": {
    "countryCode": "+91",
    "phone": "9876543210",
    "otp": "123456"
  }
}
2️⃣ Throttled Search
Implemented with a custom useDebounce hook to prevent excessive API calls.

Updates the chatroom list only after the user stops typing for a set delay.

3️⃣ Infinite Scroll
Chatroom data loaded in small chunks to optimize performance.

Desktop view: Uses traditional pagination.

Mobile view: Infinite scroll.

Trigger mechanism: A scroll event listener detects when the user reaches the bottom and fetches the next set of data.

4️⃣ Form Validation
Implemented using React Hook Form + Zod.

Phone & OTP fields accept numbers only:


z.string().regex(/^\d+$/, "Digits only")
Real-time error messages for instant feedback.



   
