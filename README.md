
# Task Management System – DevOps Project

## Authors
22i-0869
22i-1313
22i-1021

## Overview

This project applies modern DevOps practices to containerize and orchestrate a **Task Management System** using Docker, Kubernetes, CI/CD pipelines, infrastructure automation, monitoring, and GitOps tools.

##  Team & Work Distribution

| Member Name     | Responsibilities                                             |
| --------------- | ------------------------------------------------------------ |
| Member 1 (Lead) | Dockerization, Kubernetes manifests, GitHub repo setup       |
| Member 2        | Ingress setup, ConfigMaps/Secrets, CI/CD with GitHub Actions |
| Member 3        | Terraform IaC for Kubernetes cluster setup                   |




##  Tools & Technologies

| Tool                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| GitHub              | Code repository and version control            |
| Dockerfile          | Containerizing microservices                   |
| Kubernetes          | Orchestration (deployments, services, ingress) |
| ConfigMap & Secrets | Configuration and sensitive data               |
| Terraform           | Infrastructure provisioning                    |
| Ansible             | Configuration management & app deployment      |
| GitHub Actions      | CI/CD pipelines                                |
| ArgoCD              | GitOps for deployment                          |
| Prometheus          | Monitoring                                     |
| Grafana             | Visualization & Dashboards                     |



##. Deployment Instructions

### 1. Clone the Repository


git clone https://github.com/munhim/task-management-system.git
cd task-management-system

### 2. Dockerize and Push Images


docker build -t user-service ./backend/user-service
docker build -t task-service ./backend/task-service
docker build -t notification-service ./backend/notification-service
docker build -t frontend ./frontend
docker push <your-dockerhub-username>/user-service
# Repeat for others


### 3. Apply Kubernetes Resources


kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/

### 4. Configure ArgoCD

* Add GitHub repo to ArgoCD
* Sync Kubernetes manifests for GitOps delivery


