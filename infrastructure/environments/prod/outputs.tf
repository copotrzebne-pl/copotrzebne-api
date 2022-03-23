output "target_group_arn" {
  value       = module.app_api.target_group_arn
  description = "ARN of Target Group used by API"
}
