resource "kubernetes_deployment" "task_service" {
  metadata {
    name      = "task-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "task-service" }
  }

  spec {
    replicas = 1

    selector {
      match_labels = { app = "task-service" }
    }

    template {
      metadata { labels = { app = "task-service" } }
      spec {
        container {
          name  = "task-service"
          image = "abdulmunhim/task-management-system-task-service:latest"

          port {
            container_port = 3001
          }

          env {
            name = "MONGO_URI"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.mongo_config.metadata[0].name
                key  = "MONGO_URI_TASK"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "task_service" {
  metadata {
    name      = "task-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "task-service" }
  }

  spec {
    selector = { app = kubernetes_deployment.task_service.metadata[0].labels.app }

    port {
      protocol    = "TCP"
      port        = 3001
      target_port = 3001
    }

    type = "ClusterIP"
  }
}