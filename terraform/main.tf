
terraform {
  required_version = ">= 0.12.0"

  backend "s3" {
    region = "ap-northeast-1"
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

