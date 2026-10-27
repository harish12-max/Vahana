# Vahana — Vehicle Advertising Platform

Vahana is a web-based platform designed to connect vehicle owners with advertisers who want to promote their brands through vehicle-based advertising campaigns. The platform provides role-based access, vehicle management, campaign management, and administrative controls in one place.

## Live Demo

| Resource | Link |
|---|---|
| Frontend Application | https://vahana-ten.vercel.app/ |
| Backend API | https://vahana-8gu4.onrender.com |
| API Health Check | https://vahana-8gu4.onrender.com/api/v1/health |
| GitHub Repository | https://github.com/harish12-max/Vahana |
| Video demo link | https://1drv.ms/v/c/e59715d6e51da736/IQBxLiHqZvfTTbwnTRNsmowKAcyOfplUFa-ngA5u56rZzEA?e=foheUx |

## Project Overview

Traditional advertising often requires businesses to find suitable advertising spaces and coordinate with advertising partners manually. Vahana aims to simplify this process by connecting advertisers with vehicle owners through a centralized digital platform.

The application supports three primary roles:

- **Auto Owner:** Manages their profile, registers vehicles, uploads documents, and participates in advertising campaigns.
- **Advertiser:** Manages their profile and creates and manages advertising campaigns.
- **Administrator:** Oversees platform users, vehicles, campaigns, and related verification or approval workflows.

## Key Features

### Authentication and Authorization
- User registration and login.
- Secure password verification.
- JWT-based authentication using HTTP-only cookies.
- Role-based access control.
- Protected routes and user-specific functionality.

### Auto Owner Management
- Manage auto owner profiles.
- Register and manage vehicles.
- Upload vehicle-related documents.
- Access relevant campaign and vehicle information.

### Advertiser Management
- Manage advertiser profiles.
- Create and manage advertising campaigns.
- Access campaign-related information and workflows.

### Campaign Management
- Organize advertising campaigns.
- Manage campaign information and status.
- Support administrative review and management workflows.

### Admin Dashboard
- Access administrative functionality through a protected dashboard.
- Manage platform users and related records.
- Review vehicles, documents, and campaigns according to implemented permissions.

### Document Management
- Upload supported documents.
- Store private documents using Cloudinary.
- Retrieve documents through backend-controlled access.
- Apply file type and file size restrictions.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), HTTP-only cookies |
| File Storage | Cloudinary |
| Version Control | Git, GitHub |

## System Architecture

```text
                 ┌──────────────────────┐
                 │   React Frontend     │
                 │  React + Vite        │
                 └──────────┬───────────┘
                            │
                     Axios / HTTP
                            │
                 ┌──────────▼───────────┐
                 │   Express Backend    │
                 │   REST API           │
                 └──────┬────────┬──────┘
                        │        │
             ┌──────────▼───┐  ┌─▼─────────────┐
             │   MongoDB    │  │  Cloudinary   │
             │ Application  │  │ Private Files │
             │     Data     │  │               │
             └──────────────┘  └───────────────┘
```

## User Roles

| Role | Responsibilities |
|---|---|
| Auto Owner | Profile management, vehicle registration, document uploads, and campaign participation |
| Advertiser | Profile management and advertising campaign management |
| Administrator | Platform administration and management of users, vehicles, documents, and campaigns |

Access to individual features depends on the permissions implemented by the backend.

## Admin Demo Access

The administrator account is created through the backend's admin creation process rather than ordinary public registration.

**Admin Dashboard:** [Add your deployed admin dashboard URL]

The following details are reserved for providing your instructor with access to the administrator account.

| Detail | Value |
|---|---|
| Admin Email | harish12@gmail.com |
| Admin Password | 1234567890 |

**Security note:** Do not publish admin passwords, secret keys, database credentials, JWT secrets, or Cloudinary API secrets in this public README. Share temporary demonstration credentials privately with your instructor and change or revoke them after the evaluation.

## Getting Started

Follow these instructions to run Vahana locally.

### Prerequisites

Install the following before starting:

- Node.js and npm
- MongoDB or a MongoDB Atlas connection
- A Cloudinary account for document storage
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/harish12-max/Vahana.git
cd Vahana
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_random_jwt_secret
JWT_EXPIRES_IN=7d

FRONTEND_URLS=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your own configuration. Never commit your real `.env` file to GitHub.

Start the backend in development mode:

```bash
npm run dev
```

To start the backend using its production script, use:

```bash
npm start
```

The backend will use the configured port, which defaults to `5000`.

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

**Note:** Make sure the frontend API URL, backend CORS configuration, and authentication cookie settings are compatible with your local or deployed environment.

## Creating an Administrator Account

Vahana includes a backend script for creating an administrator account.

From the backend directory, run:

```bash
npm run create-admin
```

Follow the prompts or configuration requirements defined by the existing admin creation script.

Ensure that the backend environment variables and database connection are configured correctly before running the command. Use a strong password and keep administrator credentials private.

## Environment Variables

### Backend

| Variable | Purpose |
|---|---|
| `PORT` | Port on which the backend server runs |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `FRONTEND_URLS` | Allowed frontend origin or origins, according to the backend configuration |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

Only use placeholder values in documentation. Configure actual secrets through local environment files or your hosting provider's environment settings.

## Project Structure

```text
Vahana/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── Documentation/
│   ├── Project-Vahana-Development-v1.0-Formatted (1).docx
│   ├── Project-Vahana-PRD-v1.0-Formatted (2).docx
│   ├── Project-Vahana-SRS-v1.0-Formatted (1).docx
│   ├── Project-Vahana-System-Architecture-v1.0 (1).docx
│   └── Project-Vahana-UI-UX-v1.0-Formatted (1).docx
└── README.md
```

*The directory tree is representative. Refer to the repository for the complete and current file structure.*

## Security Considerations

- Passwords are verified using secure password-hashing practices.
- Authentication uses JWTs and HTTP-only cookies.
- Protected backend routes enforce authentication and role-based permissions.
- Private documents are managed through backend-controlled access.
- Sensitive credentials should be stored in environment variables.
- Uploaded files should be validated and restricted to supported formats and sizes.

## Future Improvements

Potential enhancements for Vahana include:

- Improved campaign matching between advertisers and vehicle owners.
- More detailed campaign analytics and reporting.
- Notifications for campaign updates and document approvals.
- Enhanced search and filtering.
- Additional administrative monitoring and reporting tools.

## Project Documentation

The `Documentation/` directory contains the project's supporting documents, including:

- Product Requirements Document (PRD)
- Software Requirements Specification (SRS)
- System Architecture
- UI/UX documentation
- Development documentation

## Author

**Harish Seervi**

GitHub: https://github.com/harish12-max

---

Vahana — Connecting vehicle owners and advertisers through a unified advertising platform.
