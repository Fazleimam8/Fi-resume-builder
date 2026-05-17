# 📄 Interactive Role-Based Resume Builder

A dynamic, front-end web application that allows users to seamlessly build, customize, and download a professional resume. Built with modern web standards, this tool features real-time data binding, dynamic UI theming, and a robust role-based authentication system managed entirely within the browser.

## ✨ Key Features

* **Real-Time Live Preview:** Edits made in the configuration panel are instantly reflected on the resume UI without page reloads.
* **Role-Based Authentication:**
  * **Guest Mode:** New visitors can test out the configuration panel and see live updates. If they attempt to save, they are prompted to create an account.
  * **Standard User:** Upon signing up, the system creates a dedicated, clean-slate instance for the user in `localStorage` to save their unique resume data.
  * **Admin Mode:** Admins can log in to bypass standard user restrictions and manage configurations.
* **Theme Customization:** Users can change the resume's primary accent color and toggle the visibility of specific sections (Stats, Proficiency Bars, ATS Keywords, etc.).
* **Persistent Local Storage:** Uses browser `localStorage` and `sessionStorage` to keep user sessions active and save individual configurations safely on the client side.
* **Print-Ready Export:** Optimized `@media print` CSS ensures that the resume looks perfect when downloaded or printed as a PDF, hiding all configuration panels automatically.

## 🛠️ Tech Stack

* **HTML5:** Semantic layout and structure.
* **CSS3:** Custom CSS variables, responsive Grid/Flexbox layouts, and modern glass-morphism UI elements. No external CSS frameworks are used.
* **Vanilla JavaScript (ES6+):** Handles state management, DOM manipulation, real-time input binding, and local storage database logic without relying on external libraries like React or Angular.

## 🚀 Getting Started

Since this project is entirely front-end, no complex server setup or build step is required.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/resume-builder.git](https://github.com/yourusername/resume-builder.git)
