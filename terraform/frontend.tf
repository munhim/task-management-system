resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "frontend" }
  }

  spec {
    replicas = 1

    selector {
      match_labels = { app = "frontend" }
    }

    template {
      metadata { labels = { app = "frontend" } }
      spec {
        container {
          name  = "frontend"
          image = "abdulmunhim/task-management-system-frontend:latest"

          port {
            container_port = 5050
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.task_app.metadata[0].name
  }

  spec {
    selector = { app = kubernetes_deployment.frontend.metadata[0].labels.app }

    port {
      protocol    = "TCP"
      port        = 80
      target_port = 5050
    }

    type = "ClusterIP"
  }
}