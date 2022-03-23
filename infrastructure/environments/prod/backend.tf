terraform {
  backend "s3" {
    bucket         = "terraform-remote-state-773224345969-eu-central-1"
    key            = "prod/api/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    kms_key_id     = "arn:aws:kms:eu-central-1:773224345969:key/18bf1c92-6ff5-4ff0-b338-12f111ec4056"
    dynamodb_table = "tf-remote-state-lock"
  }

  backend "common" {
    bucket         = "terraform-remote-state-773224345969-eu-central-1"
    key            = "prod/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    kms_key_id     = "arn:aws:kms:eu-central-1:773224345969:key/18bf1c92-6ff5-4ff0-b338-12f111ec4056"
    dynamodb_table = "tf-remote-state-lock"
  }
}
