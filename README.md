# Carz - Car Dealership Platform

This is a comprehensive car dealership platform built with Next.js, Prisma, and a variety of other modern technologies. It provides a feature-rich admin dashboard for managing classifieds and customers, as well as a public-facing interface for users to browse and reserve vehicles.

## Features

### Admin Dashboard

*   **Authentication:** Secure admin authentication with two-factor authentication (2FA) via email.
*   **Classifieds Management:**
    *   Create, read, update, and delete (CRUD) car classifieds.
    *   AI-powered classified generation from a single image.
    *   Multi-image uploads for each classified.
    *   Rich text editor for detailed descriptions.
    *   Advanced filtering and sorting options.
*   **Customer Management:**
    *   CRUD operations for customers.
    *   Track customer lifecycle and status (e.g., interested, contacted, purchased).
*   **Dashboard Analytics:**
    *   Key performance indicator (KPI) cards for a quick overview.
    *   Sales charts to visualize trends.

### Public-Facing Website

*   **Inventory Browsing:**
    *   Browse the car inventory with advanced filtering and sorting.
    *   View detailed classified pages with image carousels.
*   **Vehicle Reservation:**
    *   Users can reserve a vehicle by filling out a form.
*   **Favorites:**
    *   Users can save their favorite classifieds.
*   **Newsletter Subscription:**
    *   Users can subscribe to a newsletter.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/)
*   **Schema Validation:** [Zod](https://zod.dev/)
*   **AI:** [OpenAI GPT-4o](https://openai.com/gpt-4o)
*   **Image Upload:** [ImgBB](https://imgbb.com/)
*   **In-memory Store:** [Redis](https://redis.io/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [pnpm](https://pnpm.io/)
*   [Docker](https://www.docker.com/) (for running a local PostgreSQL instance)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd carz
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/carz"
    GTH_OPENAI_API_KEY="your-openai-api-key"
    OPENAI_ENDPOINT="your-openai-endpoint"
    REDIS_URL="redis://localhost:6379"
    AUTH_SECRET="your-auth-secret"
    ```

4.  **Start the database:**

    You can use Docker to start a PostgreSQL and Redis instance:

    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**

    ```bash
    pnpm prisma migrate dev
    ```

6.  **Seed the database:**

    ```bash
    pnpm prisma db seed
    ```

### Running the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into the following main directories:

*   `src/app`: Contains the Next.js pages and layouts.
    *   `(presentation)`: Public-facing pages.
    *   `admin`: Admin dashboard pages.
    *   `api`: API routes.
*   `src/components`: Reusable React components.
*   `src/actions`: Server-side actions for form submissions and data mutations.
*   `src/schemas`: Zod schemas for data validation.
*   `src/lib`: Utility functions and libraries.
*   `prisma`: Prisma schema, migrations, and seed scripts.
*   `public`: Static assets like images and fonts.

## API Endpoints

The application exposes several API endpoints for various functionalities:

*   `/api/auth/*`: NextAuth.js authentication routes.
*   `/api/favorites`: Manages user favorites.
*   `/api/images/single-upload`: Handles single image uploads.
*   `/api/taxonomy`: Provides taxonomy data (makes, models, etc.).

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes the following models:

*   `Classified`: Represents a car classified.
*   `Customer`: Represents a customer.
*   `CustomerLifecycle`: Tracks the status changes of a customer.
*   `Image`: Stores images for classifieds.
*   `PageView`: Tracks page views.
*   `Session`: NextAuth.js session model.
*   `User`: Admin user model.
*   `Make`, `Model`, `ModelVariant`: Taxonomy models for car makes, models, and variants.

## Conclusion

This project serves as a robust and modern foundation for a car dealership platform. By leveraging the power of Next.js, Prisma, and AI, it provides a seamless experience for both administrators and users. The modular architecture allows for easy customization and extension, making it an ideal starting point for any car sales business looking to establish a strong online presence.