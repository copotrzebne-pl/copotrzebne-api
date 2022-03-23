locals {
  service_name   = "service-${var.name}"
  container_name = "container-${var.name}"
}

data "aws_region" "current" {}

resource "aws_cloudwatch_log_group" "default" {
  #checkov:skip=CKV_AWS_158:Disabled to save money

  name              = var.name
  retention_in_days = 1
}

resource "aws_ecs_task_definition" "default" {
  family = local.service_name

  container_definitions = jsonencode([
    {
      name : local.container_name
      image : "crccheck/hello-world"
      cpu : 256
      memory : 256
      portMappings = [
        {
          containerPort = 8000
        }
      ]
      logConfiguration : {
        logDriver : "awslogs"
        options : {
          awslogs-group : var.name
          awslogs-stream-prefix : "api"
          awslogs-region : data.aws_region.current.name
        }
      }
    }
  ])
}

resource "aws_ecs_service" "default" {
  name            = local.service_name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.default.arn

  desired_count = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.default.arn
    container_name   = local.container_name
    container_port   = 8000
  }
}

resource "aws_lb_target_group" "default" {
  name     = "tg-${var.name}"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check {
    path = "/"
  }
}
