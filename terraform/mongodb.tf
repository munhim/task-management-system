resource "kubernetes_deployment" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = kubernetes_namespace.task_app.metadata[0].name
    labels = { app = "mongodb" }
  }

  spec {
    replicas = 1

    selector {
      match_labels = { app = "mongodb" }
    }

    template {
      metadata { labels = { app = "mongodb" } }
      spec {
        container {
          name  = "mongodb"
          image = "mongo:latest"

          port {
            container_port = 27017
          }

          env {
            name  = "MONGO_INITDB_ROOT_USERNAME"
            value = "root"
          }

          env {
            name  = "MONGO_INITDB_ROOT_PASSWORD"
            value = "rootpassword"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongodb" {
  metadata {
    name      = "mongodb"
    namespace = kubernetes_namespace.task_app.metadata[0].name
  }

  spec {
    selector = { app = kubernetes_deployment.mongodb.metadata[0].labels.app }

    port {
      port        = 27017
      target_port = 27017
    }

    cluster_ip = "None"
  }
}