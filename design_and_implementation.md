# Design and Implementation Documentation

## 1. Introduction and Overview

The project is a **Multi-purpose Planner** designed to help users create, manage, and collaborate on travel plans and budget plans. The system allows users to:

- Authenticate and authorize users securely.
- Create travel plansTravel Plans with detailed itineraries.
- Invite collaborators to contribute to travel plans.
- View daily itineraries and manage travel details.
- Create Budget Plan with income/expense records.

The system is built using a **Django REST Framework (DRF)** backend and a **React.js** frontend. It leverages RESTful APIs for communication between the frontend and backend.

## 2. System Architecture

The system follows a **client-server architecture**:

### Client-side (Frontend)

- React.js
- Provides an interactive user interface for managing travel plans and itineraries.

#### Key Frontend Modules

- Login
- SignUp
- ForgotPassword
- PasswordReset
- Dashboard
- TravelPlannerHome
- TravelPlanner
- BudgetPlannerHome
- BudgetPlanner
- ItineraryCard
- LocationSearch

### Server-side (Backend)

- Django
- Django REST Framework
- Handles business logic, data persistence, and API endpoints.
- **Database:** Django REST Framework built-in models is used for data storage during development.
- **Deployment:** Docker is used for containerization, ensuring consistent environments for development and deployment.

#### Key Backend Modules

- **Users System**
  - `CustomUser`
  - `RegisterViewSet`
  - `LoginViewSet`
  - `UserInfoViewSet`
  - `UserSerializer`

- **Travel Planner**
  - `Travel`
  - `Itinerary`
  - `TravelViewSet`
  - `ItineraryViewSet`
  - `TravelSerializer`
  - `ItinerarySerializer`

- **Budget Planner**
  - `Budget`
  - `Expense`
  - `Income`
  - `BudgetViewSet`
  - `ExpenseViewSet`
  - `IncomeViewSet`
  - `BudgetSerializer`
  - `ExpenseSerialize`
  - `IncomeSerializer`

## 3. Data Design

### Database Models

#### 1. **CustomUser**

- Fields: `id`, `email`, `password`, `username`, `first_name`, `last_name`, `date_joined`, `last_login`, `birthday`
- Relationships: Related to travel and budget model

#### 2. **Travel**

- Fields: `id`, `title`, `start_date`, `end_date`, `description`, `destination`, `user`, `collaborators`.
- Relationships:
  - `user`: ForeignKey to `CustomUser` (owner of the travel plan).
  - `collaborators`: ManyToManyField to `CustomUser`.

#### 3. **Itinerary**

- Fields: `id`, `travel`, `start_date`, `end_date`, `start_time`, `end_time`, `title`, `notes`, `location`, `location_lat`, `location_lon`, `location_url`, `tag`.
- Relationships:
  - `travel`: ForeignKey to `Travel`.

#### 4. **Expense**
- Fields:
- Relationships:
  - `

## 4. Interface Design

### Internal API Endpoints

#### 1. **Travel Endpoints**

- **Common Header:**
  - `token`: User authentication token

- `GET /api/travel/`: List all travels for the authenticated user.
  - **Parameters:** None.
- `POST /api/travel/`: Create a new travel plan for the current user.
  - **Parameters (JSON Body):**
    - `title` (string, required): Title of the travel plan.
    - `start_date` (string, optional): Start date of the travel plan (YYYY-MM-DD).
    - `end_date` (string, optional): End date of the travel plan (YYYY-MM-DD).
    - `description` (string, optional): Description of the travel plan.
    - `destination` (string, optional): Destination of the travel plan.
- `GET /api/travel/<id>/`: Retrieve details of a specific travel plan.
  - **Parameters:**
    - `id` (integer, required): ID of the travel plan.
- `PATCH /api/travel/<id>/`: Update a travel plan.
  - **Parameters (JSON Body):**
    - `title` (string, optional): Updated title of the travel plan.
    - `start_date` (string, optional): Updated start date (YYYY-MM-DD).
    - `end_date` (string, optional): Updated end date (YYYY-MM-DD).
    - `description` (string, optional): Updated description.
    - `destination` (string, optional): Updated destination.
- `DELETE /api/travel/<id>/`: Delete a travel plan.
  - **Parameters:**
    - `id` (integer, required): ID of the travel plan.
- `POST /api/travel/<id>/invite_collaborator/`: Invite a collaborator to a travel plan.
  - **Parameters (JSON Body):**
    - `email` (string, required): Email of the user to invite.

#### 2. **Itinerary Endpoints**

- **Common Header:**
  - `token`: User authentication token

- `GET /api/travel/<travel_id>/itineraries/`: List itineraries for a specific travel plan.
  - **Parameters:**
    - `travel_id` (integer, required): ID of the travel plan.

- `POST /api/travel/<travel_id>/itineraries/`: Create a new itinerary.
  - **Parameters (JSON Body):**
    - `title` (string, required): Title of the itinerary.
    - `start_date` (string, required): Start date of the itinerary (YYYY-MM-DD).
    - `end_date` (string, required): End date of the itinerary (YYYY-MM-DD).
    - `start_time` (string, optional): Start time of the itinerary (HH:MM:SS).
    - `end_time` (string, optional): End time of the itinerary (HH:MM:SS).
    - `location` (string, optional): Location of the itinerary.
    - `location_lat` (string, optional): Latitude of the location.
    - `location_lon` (string, optional): Longitude of the location.
    - `location_url` (string, optional): URL of the location.
    - `notes` (string, optional): Notes for the itinerary.
    - `tag` (string, optional): Tag for the itinerary (e.g., "visit", "food").

- `PATCH /api/travel/<travel_id>/itineraries/<id>/`: Update an itinerary.
  - **Parameters (JSON Body):**
    - `id` (integer, required): ID of the itinerary.
    - `title` (string, optional): Updated title of the itinerary.
    - `start_date` (string, optional): Updated start date (YYYY-MM-DD).
    - `end_date` (string, optional): Updated end date (YYYY-MM-DD).
    - `start_time` (string, optional): Updated start time (HH:MM:SS).
    - `end_time` (string, optional): Updated end time (HH:MM:SS).
    - `location` (string, optional): Updated location.
    - `location_lat` (string, optional): Updated latitude of the location.
    - `location_lon` (string, optional): Updated longitude of the location.
    - `location_url` (string, optional): Updated URL of the location.
    - `notes` (string, optional): Updated notes for the itinerary.
    - `tag` (string, optional): Updated tag for the itinerary.

- `DELETE /api/travel/<travel_id>/itineraries/<id>/`: Delete an itinerary.
  - **Parameters:**
    - `travel_id` (integer, required): ID of the travel plan.
    - `id` (integer, required): ID of the itinerary.

#### 3. **User Information Endpoints (Require Authentication Token):**

- **Common Header:**
  - `token`: User authentication token

- `GET /api/userinfo/`: Retrieve details of the authenticated user.
  - **Parameters:** None.

- `PATCH /api/userinfo/<id>/`: Update user profile information.
  - **Parameters (JSON Body):**
    - `username` (string, optional): Updated username.
    - `first_name` (string, optional): Updated first name.
    - `last_name` (string, optional): Updated last name.
    - `birthday` (string, optional): Updated birthday (YYYY-MM-DD).

- `DELETE /api/userinfo/<id>/`: Delete the user account.
  - **Parameters:**
    - `id` (integer, required): ID of the user.

#### 4. **Password Reset Endpoints**

- `POST /api/password_reset/`: Request a password reset email.
  - **Parameters (JSON Body):**
  - `email` (string, required): Email of the user requesting the reset.

- `POST /api/password_reset/confirm/`: Reset the password using a token.
  - **Parameters (JSON Body):**
  - `password` (string, required): New password.
  - `token` (string, required): Password reset token.

#### 5. **Sign Up Endpoint**

- `POST /api/signup/`: Sign up new user.  
  - **Parameters (JSON Body):**
    - `email` (string, requried): New email.
    - `password` (string, required): New password.

#### 6. **Login Endpoint

- `POST /api/login/`: Sign up new user.
  - **Parameters (JSON Body):**
    - `email` (string, requried): User's email.
    - `password` (string, required): User's password.

#### 7. Budget Endpoint
- 

### External API References

1. **Location Search:**
   - **API Used:** OpenStreetMap Nominatim API.
   - **Purpose:** Provides location search and autocomplete functionality.
   - **Parameters:**
     - `q` (string, required): Search query.
     - `format` (string, required): Response format (e.g., "json").
     - `addressdetails` (integer, optional): Whether to include address details (1 for true, 0 for false).
     - `limit` (integer, optional): Maximum number of results to return.

## 5. Component Design

### Backend Components

#### Apps

users: Handles user authentication, registration, and profile management.
travel: Manages travel plans, itineraries, and collaborator functionality.
budget: Manages budget plans, income, and expense records.

#### Models

- CustomUser (users): Represents users in the system with fields like username, email, password, and birthday.
- Travel (travel): Represents travel plans with fields like title, start_date, end_date, description, and destination.
- Itinerary (travel): Represents individual itinerary items with fields like title, start_date, end_date, location, and tag.
- Budget (budget): Represents budget plans with fields like title and total_amount.
- Expense (budget): Represents expenses in a budget plan with fields like amount, category, and description.
- Income (budget): Represents income in a budget plan with fields like amount, source, and description.

#### Views

- TravelViewSet (travel): Handles CRUD operations for travel plans and collaborator invitations.
- ItineraryViewSet (travel): Handles CRUD operations for itineraries.
- BudgetViewSet (budget): Handles CRUD operations for budget plans.
- ExpenseViewSet (budget): Handles CRUD operations for expenses.
- IncomeViewSet (budget): Handles CRUD operations for income records.
- UserInfoViewSet (users): Handles user profile retrieval and updates.
- RegisterViewSet (users): Handles user registration.
- LoginViewSet (users): Handles user login and token generation.

#### Serializers

- TravelSerializer (travel): Serializes travel plans and nested itineraries.
- ItinerarySerializer (travel): Serializes individual itineraries.
- BudgetSerializer (budget): Serializes budget plans.
- ExpenseSerializer (budget): Serializes expenses.
- IncomeSerializer (budget): Serializes income records.
- UserSerializer (users): Serializes user data for authentication and profile management.

### Frontend Components

#### 1. **Pages:**

- `Login`: Allows users to log in with email and password.
- `SignUp`: Allows new users to register.
- `ForgotPassword`: Allows users to request a password reset.
- `PasswordReset`: Allows users to reset their password using a reset token.
- `Dashboard`: Displays an overview of recent and shared travel plans.
- `TravelPlannerHome`: Lists all travel plans for the user and provides options to create, view, or delete travel plans.
- `TravelPlanner`: Displays details of a travel plan, allows users to add/edit itineraries, invite collaborators, and includes a daily view of itineraries.
- `BudgetPlannerHome`: Lists all travel plans for the user and provides options to create, view, or delete budget plans.
- `BudgetPlanner`: Displays details of a budget plan, allows users to add/edit income/expenses.
- `Calendar`: Displays a calendar view for managing travel dates.
- `Profile`: Displays user profile information.
- `Settings`: Allows users to change application settings, such as theme and map provider.
- `BudgetPlannerHome`: Provides tools for managing travel budgets, including creating, viewing, and deleting budget plans.
- `Portal`: Serves as a landing page with navigation options to key pages like Login, SignUp, and Dashboard.
- `Start`: Guides new users through the initial setup process.
- `NotFound`: Displays a 404 error page when a user navigates to a non-existent route.

#### 2. **Reusable Components:**

- `DailyView`: Displays daily itineraries and allows navigation between days.
- `ItineraryCard`: Represents a single itinerary item, including details like title, location, and notes, with options to edit or delete.
- `LocationSearch`: Provides an input field with autocomplete functionality for selecting locations.
- `Panel`: Implements a collapsible sidebar navigation menu.
- `NavigateButton`: A button component for navigating between pages.
- `PreviewFrame`: Displays a preview card with a title, image, and link.

## 6. User Interface Design

### Key Screens

#### 1. `Login`

- Allows users to log in with email and password.

#### 2. `SignUp`

- Allows new users to register.

#### 3. `ForgotPassword`

- Allows users to request a password reset.

#### 4. `PasswordReset`

- Allows users to reset their password using a reset token.

#### 5. `Dashboard`

- Displays an overview of recent and shared travel plans.

#### 6. `TravelPlannerHome`

- Lists all travel plans.
- Provides options to create, view, or delete travel plans.

#### 7. `TravelPlanner`

- Displays details of a travel plan.
- Allows users to add/edit itineraries and invite collaborators.
- Includes a daily view of itineraries.

#### 8. `BudgetPlannerHome`

- Lists all budget.
- Provides options to create, view, or delete budget.

#### 9. `BudgetPlanner`

- Displays details of a budget.
- Allows users to add/edit income and expenses.

#### 10. `Calendar`

- Displays a calendar view for managing travel dates.

#### 11. `Profile`

- Displays user profile information.

#### 12. `Setting`

- Allow users to change settings.

## 7. Assumptions and Dependencies

### Assumptions

1. Users must be authenticated to access travel plans and itineraries.
2. Collaborators can only view or edit travel plans they are invited to.
3. The system assumes valid date and time inputs for itineraries.

### Dependencies

#### 1. **Backend:**

- Django 4.x
- Django REST Framework
- SQLite (development) or PostgreSQL (production)

#### 2. **Frontend:**

- React.js 19.x
- Axios 1.8.4 for API requests
- Radix UI for components:
  - `@radix-ui/react-form` 0.1.2
  - `@radix-ui/react-icons` 1.3.2
  - `@radix-ui/react-portal` 1.1.4
  - `@radix-ui/themes` 3.2.1
- Tailwind CSS 4.0.15 for styling
- ag-Grid for grid views in the Travel Planner:
  - `ag-grid-community` 33.2.1
  - `ag-grid-react` 33.2.2
- React Router DOM 7.3.0 for routing
- PropTypes 15.8.1 for type checking
- Vite 5.0.0 for development and build tooling
- dotenv 16.4.7 for environment variable management

#### 3. **Deployment:**

- Docker for containerization.

## 8. Glossary of Terms

1. **Travel Plan:** A collection of itineraries and details for a specific trip.
2. **Itinerary:** A single activity or event within a travel plan.
3. **Collaborator:** A user invited to contribute to a travel plan.
4. **Daily View:** A view that displays itineraries for a specific day.
5. **API (Application Programming Interface):** A set of endpoints for communication between the frontend and backend.
6. **Serializer:** A Django REST Framework component that converts complex data types (e.g., models) into JSON and vice versa.
