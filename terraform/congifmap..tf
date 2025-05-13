resource "kubernetes_config_map" "mongo_config" {
  metadata {
    name      = "mongo-config"
    namespace = kubernetes_namespace.task_app.metadata[0].name
  }

  data = {
    MONGO_URI_USER         = "mongodb://mongodb:27017/user-service"
    MONGO_URI_TASK         = "mongodb://mongodb:27017/task-service"
    MONGO_URI_NOTIFICATION = "mongodb://mongodb:27017/notification-service"
  }
}