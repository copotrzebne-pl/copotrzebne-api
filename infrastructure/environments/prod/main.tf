data "terraform_remote_state" "common" {
  backend = "common"
}

module "app_api" {
  source = "../../modules/app_api"
  name   = "${var.stack_name}-api"

  cluster_id     = data.terraform_remote_state.common.ecs_cluster_id
  vpc_id         = data.terraform_remote_state.common.network_vpc_id
  container_port = var.container_port
}
