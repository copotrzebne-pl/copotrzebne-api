variable "name" {
  description = "Name used as identifier of created resources"
  type        = string
}

variable "container_port" {
  description = "Port used by application in container"
  type        = number
}

variable "stack_name" {
  description = "Identifier for stack resources"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
}

variable "aws_account_id" {
  description = "AWS account id where resources will be created"
  type        = number
}
