output "target_group_arn" {
  value       = aws_lb_target_group.default.arn
  description = "ARN of Target Group used by API"
}
