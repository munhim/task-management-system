
# 📝 Task Management System

A microservices-based Task Management System with user authentication, task operations, notifications, and a clean web frontend. Deployed using Docker and Kubernetes, integrated with a full CI/CD pipeline via GitHub Actions.

---

## 📁 Project Structure

```
.
├── backend/
│   ├── user-service/              # Handles user registration and authentication
│   ├── task-service/              # Manages tasks (CRUD operations)
│   └── notification-service/      # Sends notifications
│
├── frontend/                      # HTML/CSS/JS frontend (Dockerized)
│
├── kubernetes/                    # All K8s deployment and config files
│   ├── ingress.yaml
│   ├── mongo-configmap.yaml
│   ├── namespace.yaml
│   ├── mongo-deployment.yaml
│   ├── user-service.yaml
│   ├── task-service.yaml
│   ├── notification-service.yaml
│   └── frontend.yaml
│
├── docker-compose.yaml            # Optional for local multi-service setup
├── .github/workflows/ci-cd.yaml   # GitHub Actions CI/CD pipeline
```

---

## 🚀 Features

- 📦 Microservices-based architecture using **Node.js**
- 🌐 Clean **HTML/CSS/JS frontend**
- 🐳 Dockerized services
- ☸️ Kubernetes deployment
- 🔐 MongoDB database integration
- 🔄 GitHub Actions for CI/CD (build, test, push images)
- 🚢 ArgoCD for GitOps-style Kubernetes deployment

---

## ⚙️ Microservices Overview

### 1. User Service
- REST APIs for user registration, login, and authentication.
- Interacts with MongoDB for storing user data.

### 2. Task Service
- Handles CRUD operations for tasks.
- Allows users to create, view, update, and delete tasks.

### 3. Notification Service
- Sends notifications to users regarding their tasks.

### 4. Frontend
- Clean UI built using HTML, CSS, and JavaScript.
- Interacts with backend services via API calls.

---

## 🛠️ Technologies Used

- **Node.js** for backend services.
- **MongoDB** for database.
- **Docker** for containerization of services.
- **Kubernetes** for orchestration and deployment.
- **GitHub Actions** for CI/CD pipeline automation.
- **ArgoCD** for GitOps-based deployment.
- **Docker Compose** for local multi-service setup.

---

## 📝 How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. Install dependencies for each service:

   For **user-service**:

   ```bash
   cd backend/user-service
   npm install
   ```

   For **task-service**:

   ```bash
   cd backend/task-service
   npm install
   ```

   For **notification-service**:

   ```bash
   cd backend/notification-service
   npm install
   ```

3. Start the services using **Docker Compose** (optional):

   ```bash
   docker-compose up --build
   ```

4. Open the frontend in your browser by navigating to `http://localhost:3000`.

---

## ⚙️ Deployment

1. **Kubernetes Deployment:**
   - The project is configured to deploy on a Kubernetes cluster.
   - Kubernetes manifests are located in the `kubernetes/` folder.
   - Use `kubectl` to apply the configurations:
   
   ```bash
   kubectl apply -f kubernetes/namespace.yaml
   kubectl apply -f kubernetes/mongo-configmap.yaml
   kubectl apply -f kubernetes/user-service.yaml
   kubectl apply -f kubernetes/task-service.yaml
   kubectl apply -f kubernetes/notification-service.yaml
   kubectl apply -f kubernetes/frontend.yaml
   ```

2. **CI/CD Pipeline (GitHub Actions):**
   - GitHub Actions automatically builds and pushes Docker images to Docker Hub.
   - The workflow is defined in `.github/workflows/ci-cd.yaml`.
   - It triggers on every push to the `main` branch.
   - Images are tagged with `latest` and pushed to Docker Hub.

---

## 🛠️ Set Up for CI/CD Pipeline

1. Create a `.github/workflows/ci-cd.yaml` file in your repository.
2. Configure the Docker Hub credentials in GitHub Secrets (`DOCKER_USERNAME` and `DOCKER_PASSWORD`).
3. The pipeline will trigger on every push to the `main` branch and push new Docker images to Docker Hub.

---

## 🎓 Authors

- **Abdul Munhim Hussain**
- **Emaan Fatima**
- **Aden Sial**

---

## 🔄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
