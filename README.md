# CephAlignify

CephAlignify is an AI-powered cephalometric analysis tool designed to assist dentists, orthodontists, and oral/maxillofacial surgeons in treatment planning. The system automates landmark detection from cephalometric X-ray images, providing precise measurements and insights to streamline clinical workflows.

## Features
- **Automated Cephalometric Landmark Detection**: Uses AI to identify key anatomical landmarks.
- **Patient Record Management**: Securely store and manage patient data.
- **AI-Driven Analysis**: Generates cephalometric measurements and reports.
- **Interactive 3D Visualization**: Visual representation of skeletal structures.
- **Appointment Scheduling**: Seamlessly manage patient appointments.
- **User Roles**: Supports different access levels (Doctor, Secretary).

## Installation

### Note that this file is a boilerplate and will constantly be updated when a new technology is used in the project.

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Python 3](https://www.python.org/)
- [Django](https://www.djangoproject.com/)

### Backend Setup (Django)
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/CephAlignify.git
   cd CephAlignify/backend
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install backend dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Apply database migrations:
   ```sh
   python manage.py migrate
   ```
5. Run the backend server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install  # or `yarn install`
   ```
3. Start the frontend development server:
   ```sh
   npm run dev  # or `yarn dev`
   ```

## Usage
- Open `http://localhost:3000` to access the frontend.
- API runs on `http://127.0.0.1:8000` (Django backend).
- Login as a doctor or secretary to start managing patient records and analyzing cephalometric images.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
CephAlignify is currently open source but may transition to a commercial license in the future.
