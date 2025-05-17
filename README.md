# 🏥 MediVault

**MediVault** is a secure, cloud-based medical report management platform. Built using **React.js**, **AWS S3**, **DynamoDB**, **Lambda**, and **Amazon Cognito**, it allows users to upload, view, and manage medical reports and appointments seamlessly.

---

## 🚀 Features

- 🔐 **Secure Authentication**  
  Sign up and log in using **AWS Cognito** with email/password. Sessions auto-expire for enhanced security.

- 📁 **Upload Medical Reports**  
  Upload PDFs or images directly to **Amazon S3** with pre-signed URLs.

- 📊 **Report Management**  
  View, filter, and search your medical reports by type, doctor, or date.

- 📅 **Appointments Scheduling**  
  Schedule and track your upcoming medical appointments.

- 🧠 **Smart Filters**  
  Dynamically filter your reports using type and search bar.

- ☁️ **Cloud-Native Backend**  
  Serverless architecture using **AWS Lambda**, **DynamoDB**, and **API Gateway**.

---

## 🛠️ Tech Stack

| Frontend | Backend | Cloud Services |
|----------|---------|----------------|
| React.js | Node.js (Lambda) | AWS S3 |
| CSS      | Express-style handlers | DynamoDB |
| React Router | REST API | Cognito |
| aws-amplify | Fetch API | API Gateway |

---

## 🔗 Live Demo

**🧪 Try it out here:**  
👉 [MediVault Live App](http://medivault-frontend11.s3-website.ap-south-1.amazonaws.com/)

---

## 🔐 Login Instructions

> **📢 Note:** You must create a new account to use MediVault. This ensures secure, personalized access.

1. Go to the [Live App](http://medivault-frontend11.s3-website.ap-south-1.amazonaws.com/)
2. Click on **Sign Up**
3. Enter your email and password (valid email required)
4. Enter the **confirmation code** sent to your email
5. Login using your credentials

---

## 💡 Use Case: Why MediVault?

Managing medical records across clinics and hospitals is a hassle. MediVault solves this by:

- 📂 Letting users upload medical reports (PDFs/images) in a secure, encrypted cloud space
- 🔎 Making it easy to search and filter reports by **type**, **doctor**, or **date**
- 📅 Helping users track **appointments**
- 📬 Ensuring your reports are **accessible anywhere**, even if you switch hospitals or doctors

---

## 🚀 Features

- ✅ Secure **User Authentication** via Amazon Cognito
- 📁 Upload & Store reports securely in **Amazon S3**
- 🔍 Filter/Search your reports easily
- 📅 Schedule and view appointments
- 🛡️ Automatic **token expiry detection** and **logout**
- ⚙️ Serverless architecture using **AWS Lambda** & **DynamoDB**

---
