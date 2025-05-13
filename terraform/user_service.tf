resource "kubernetes_deployment" "user_service" {
  metadata {
    name      = "user-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "user-service" }
  }

  spec {
    replicas = 1

    selector {
      match_labels = { app = "user-service" }
    }

    template {
      metadata { labels = { app = "user-service" } }
      spec {
        container {
          name  = "user-service"
          image = "abdulmunhim/task-management-system-user-service:latest"

          port {
            container_port = 3000
          }

          env {
            name = "MONGO_URI"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.mongo_config.metadata[0].name
                key  = "MONGO_URI_USER"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "user_service" {
  metadata {
    name      = "user-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "user-service" }
  }

  spec {
    selector = { app = kubernetes_deployment.user_service.metadata[0].labels.app }

    port {
      protocol    = "TCP"
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}