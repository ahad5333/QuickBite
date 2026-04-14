# QuickBite - Modern Food Delivery Application

QuickBite is a high-performance, full-stack food delivery web application built with a modern tech stack. It features real-time menu updates, a seamless shopping cart experience, secure user authentication, and an administrative dashboard for order management.

## 🚀 Technologies Used

### Frontend
- **React 19**: The latest version of React for building a fast and interactive user interface.
- **TypeScript**: Ensures type safety and improves developer productivity.
- **Vite**: A lightning-fast build tool and development server.
- **React Router 7**: Handles client-side routing and navigation.
- **Tailwind CSS 4**: A utility-first CSS framework for modern, responsive styling.
- **shadcn/ui (Base UI)**: Accessible, high-quality UI components built on top of Base UI primitives.
- **Lucide React**: A beautiful and consistent icon library.
- **Motion**: Used for smooth animations and transitions.

### Backend & Database
- **Firebase Authentication**: Secure Google Sign-In integration.
- **Cloud Firestore**: A real-time NoSQL database for storing menu items, orders, and user data.
- **Firebase Security Rules**: Ensures data integrity and protects user information.

### State Management & Utilities
- **React Context API**: Manages global state for the Shopping Cart and User Authentication.
- **Sonner**: Provides sleek, toast-based notifications.
- **Date-fns**: Used for formatting timestamps and dates.

---

## 🛠️ Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites
- **Node.js**: Version 18 or higher.
- **npm**: Standard Node package manager.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd quickbite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
The application requires a Firebase project. 
1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Google Authentication**.
3. Create a `firebase-applet-config.json` file in the root directory with your credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "firestoreDatabaseId": "(default)"
}
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
```
The production-ready files will be generated in the `dist/` folder.

---

## 📖 Key Features

- **Real-time Menu**: Browse a wide variety of food items with live availability updates.
- **Smart Search & Filters**: Quickly find your favorite dishes by name or category.
- **Persistent Cart**: Add items to your cart and manage quantities easily.
- **Secure Checkout**: Place orders with your delivery address after signing in.
- **Order History**: View your past orders and their current status.
- **Admin Dashboard**: Specialized view for administrators to manage and update order statuses.
- **Error Handling**: Robust error boundaries to ensure a smooth user experience.

---

## 📄 License
This project is licensed under the MIT License.
