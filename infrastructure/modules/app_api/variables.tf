variable "name" {
  description = "Name used as identifier of created resources"
  type        = string
}

variable "cluster_id" {
  description = "ECS Cluster ID"
  type        = string
}

variable "vpc_id" {
  description = "VPC Id"
  type        = string
}


variable "container_port" {
  description = "Port used by application in container"
  type        = number
}
