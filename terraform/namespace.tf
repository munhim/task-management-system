resource "kubernetes_namespace" "task_app" {
  metadata {
    name = "task-app"
  }
}