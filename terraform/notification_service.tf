resource "kubernetes_deployment" "notification_service" {
  metadata {
    name      = "notification-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "notification-service" }
  }

  spec {
    replicas = 1

    selector {
      match_labels = { app = "notification-service" }
    }

    template {
      metadata { labels = { app = "notification-service" } }
      spec {
        container {
          name  = "notification-service"
          image = "abdulmunhim/task-management-system-notification-service:latest"

          port {
            container_port = 3002
          }

          env {
            name = "MONGO_URI"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.mongo_config.metadata[0].name
                key  = "MONGO_URI_NOTIFICATION"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "notification_service" {
  metadata {
    name      = "notification-service"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels    = { app = "notification-service" }
  }

  spec {
    selector = { app = kubernetes_deployment.notification_service.metadata[0].labels.app }

    port {
      protocol    = "TCP"
      port        = 3002
      target_port = 3002
    }

    type = "ClusterIP"
  }
}