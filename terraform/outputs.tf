
output "app_ecr_repository_url" {
  description = "Registry URL for app container builds"
  value       = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${lower(var.project_name)}-app"
}
