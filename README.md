Certainly! Here is the **updated complete README** for your **Task Management System** project, with **ArgoCD integration and setup commands included** for GitOps-based continuous deployment to Kubernetes.

---

# 📝 Task Management System

A microservices-based Task Management System with user authentication, task operations, notifications, and a clean web frontend. Deployed using Docker, Kubernetes, and managed infrastructure provisioning via Terraform, integrated with a full CI/CD pipeline via GitHub Actions and continuous delivery via ArgoCD.

---

## 📁 Project Structure

```
.
├── ansible/                      # Ansible deployment configuration
│   ├── deploy.yml                # Ansible playbook to deploy the app
│   └── inventory.ini             # Inventory file specifying remote hosts
│
├── backend/
│   ├── user-service/              # Handles user registration and authentication
│   ├── task-service/              # Manages tasks (CRUD operations)
│   └── notification-service/      # Sends notifications
│
├── frontend/                      # HTML/CSS/JS frontend (Dockerized)
│
├── k8s/                           # Raw Kubernetes manifests (optional reference)
│   ├── ingress.yaml
│   ├── mongo-configmap.yaml
│   ├── namespace.yaml
│   ├── mongo-deployment.yaml
│   ├── user-service.yaml
│   ├── task-service.yaml
│   ├── notification-service.yaml
│   └── frontend.yaml
│             
├── terraform/                    # Terraform configurations to manage K8s resources
│   ├── provider.tf
│   ├── namespace.tf
│   ├── configmap.tf
│   ├── mongodb.tf
│   ├── frontend.tf
│   ├── notification.tf
│   ├── task_service.tf
│   └── user_service.tf
│
├── docker-compose.yaml           # Optional for local multi-service setup
├── .github/workflows/ci-cd.yaml  # GitHub Actions CI/CD pipeline
└── README.md                     # Project overview and instructions

```

---

## 🚀 Features

* 📦 Microservices-based architecture using **Node.js**
* 🌐 Clean **HTML/CSS/JS frontend files**
* 🐳 Dockerized services
* ☸️ Kubernetes orchestration
* 🔧 Infrastructure as Code via **Terraform**
* 🔐 MongoDB database integration
* 🔄 GitHub Actions for CI/CD (build, test, push images)
* 🔁 ArgoCD for GitOps Continuous Delivery to Kubernetes

---

## ⚙️ Microservices Overview

### 1. User Service

* REST APIs for user registration, login, and authentication.
* Interacts with MongoDB for storing user data.

### 2. Task Service

* Handles CRUD operations for tasks.
* Allows users to create, view, update, and delete tasks.

### 3. Notification Service

* Sends notifications to users regarding their tasks.

### 4. Frontend

* Clean UI built using HTML, CSS, and JavaScript.
* Interacts with backend services via API calls.

---

## 🛠️ Technologies Used

* **Node.js** for backend services
* **MongoDB** for database
* **Docker** for containerization of services
* **Kubernetes** for orchestration and deployment
* **Terraform** for Kubernetes resource management
* **GitHub Actions** for CI/CD pipeline automation
* **Docker Compose** for local multi-service setup
* **ArgoCD** for continuous deployment via GitOps

---

## 🔧 Terraform Setup

All Kubernetes resources are managed through Terraform in the `terraform/` directory. Follow these steps to provision your cluster resources:

1. **Initialize Terraform**

   ```bash
   cd terraform
   terraform init
   ```

2. **Review Plan**

   ```bash
   terraform plan
   ```

3. **Apply Configuration**

   ```bash
   terraform apply
   ```

   Confirm with `yes` when prompted.

4. **Import Existing Resources (if needed)**

   If resources already exist in the cluster, import them to Terraform state:

   ```bash
   # Namespace
   terraform import kubernetes_namespace.task_app task-app

   # ConfigMap
   terraform import kubernetes_config_map.mongo_config task-app/mongo-config

   # MongoDB
   terraform import kubernetes_deployment.mongodb task-app/mongodb
   terraform import kubernetes_service.mongodb task-app/mongodb

   # Frontend
   terraform import kubernetes_deployment.frontend task-app/frontend
   terraform import kubernetes_service.frontend task-app/frontend

   # Notification Service
   terraform import kubernetes_deployment.notification_service task-app/notification-service
   terraform import kubernetes_service.notification_service task-app/notification-service

   # Task Service
   terraform import kubernetes_deployment.task_service task-app/task-service
   terraform import kubernetes_service.task_service task-app/task-service

   # User Service
   terraform import kubernetes_deployment.user_service task-app/user-service
   terraform import kubernetes_service.user_service task-app/user-service
   ```

---

## 📝 Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. Install dependencies for each service:

   ```bash
   cd backend/user-service && npm install
   cd ../task-service && npm install
   cd ../notification-service && npm install
   ```

3. Start with Docker Compose (optional):

   ```bash
   docker-compose up --build
   ```

4. Access the frontend at `http://localhost:5050`

---

## ☸️ Kubernetes Deployment (Manual)

Apply the raw Kubernetes manifests (in the `k8s/` folder) using `kubectl`:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongo-configmap.yaml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/task-service.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/frontend.yaml
```

---

## 🚀 Ansible Setup for Deployment

Here's a brief summary of the Ansible setup for deploying to an EC2 instance:

1. **Provision EC2 Instance:**

   * Create an EC2 instance manually or via IaC (Terraform/CloudFormation).
   * Generate an SSH key pair and keep the private key locally.

2. **Configure Security:**

   * Add inbound rules to allow SSH (port 22) and any other required ports (e.g., HTTP/HTTPS).

3. **Prepare Ansible Inventory:**

   * Create an `inventory.ini` file listing your EC2 instance IP and SSH details for Ansible to connect.

4. **Write Ansible Playbook:**

   * Define tasks to install dependencies, configure services, deploy your app, etc., in `deploy.yaml`.

5. **Run Playbook:**

   * Use `ansible-playbook -i inventory.ini deploy.yaml` to connect to the EC2 instance and execute deployment steps.

6. **GitOps Integration (Optional):**

   * Use ArgoCD to watch your Git repo and automatically sync Kubernetes manifests for continuous deployment.

---


---

## 🚀 ArgoCD Setup for Continuous Delivery (GitOps)

ArgoCD watches your Git repository and deploys the Kubernetes manifests automatically, enabling GitOps.

### 1. **Install ArgoCD CLI**

```bash
# MacOS (Homebrew)
brew install argocd

# Linux (curl)
curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
chmod +x /usr/local/bin/argocd
```

### 2. **Install ArgoCD in your Kubernetes cluster**

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 3. **Access the ArgoCD Server**

```bash
# Port-forward ArgoCD API server to localhost:8080
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access ArgoCD UI at [https://localhost:8080](https://localhost:8080)

### 4. **Login to ArgoCD CLI**

```bash
# Get initial admin password (ArgoCD server pod name as example)
kubectl -n argocd get pods -l app.kubernetes.io/name=argocd-server

# Or fetch password from secret
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# Login via CLI
argocd login localhost:8080
# Use username: admin and the password retrieved above
```

* `--sync-policy automated` will auto-sync new changes.
* `--auto-prune` deletes resources removed from Git.
* `--self-heal` keeps cluster in sync with Git repo.

### 6. **Sync the Application**

```bash
argocd app sync task-management-system
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions workflow `.github/workflows/ci-cd.yaml` builds Docker images for each service, pushes them to Docker Hub (or other registry), and optionally triggers ArgoCD to sync deployments.

You can configure GitHub Actions to call ArgoCD API or CLI to automatically sync on image update.

---

Got it! Here's your **updated README snippet** to add **the self-hosted GitHub Actions runner setup commands** under a new section called **"Self-hosted Runner Setup (Windows PowerShell)"** in the README. I included your full commands with some formatting and notes for clarity and ease of copy-pasting:

---

## 🤖 Self-hosted Runner Setup (Windows PowerShell)

To run GitHub Actions workflows on your own Windows machine, follow these steps to install and configure the self-hosted runner:

1. **(Optional) Install latest PowerShell for new features:**
   [https://aka.ms/PSWindows](https://aka.ms/PSWindows)

2. **Open PowerShell and navigate to your runner directory:**

   ```powershell
   cd "C:\Users\Munhim\Desktop\actions-runner"
   ```

3. **Download the latest runner package:**

   ```powershell
   Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.323.0/actions-runner-win-x64-2.323.0.zip -OutFile actions-runner-win-x64-2.323.0.zip
   ```

4. **Extract the runner archive:**

   ```powershell
   Add-Type -AssemblyName System.IO.Compression.FileSystem
   [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD\actions-runner-win-x64-2.323.0.zip", "$PWD")
   ```

5. **Configure the runner (replace URL and token accordingly):**

   ```powershell
   .\config.cmd --url https://github.com/munhim/task-management-system --token BM7RDDK52WUO67NT5RZFQP3IEZL7C
   ```

   During configuration, follow the prompts:

   * Runner group: press Enter for default
   * Runner name: press Enter or specify (e.g., MUNHIM)
   * Additional labels: press Enter to skip
   * Work folder: press Enter for default `_work`
   * Run as service: enter `y` for yes
   * User account for service: press Enter for default `NT AUTHORITY\NETWORK SERVICE`

6. **Start the runner manually if service fails to start:**

   ```powershell
   .\run.cmd
   ```

   You should see logs indicating the runner is connected and listening for jobs.

---

**Note:** If the service installation fails or does not start properly, running `.\run.cmd` manually will keep the runner active.

---

## 🎓 Authors

* **Abdul Munhim Hussain**
* **Emaan Fatima**
* **Aden Sial**

---

If you want, I can help you generate sample ArgoCD app manifests or GitHub Actions triggers for ArgoCD sync. Just ask!
