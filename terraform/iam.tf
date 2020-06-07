data "aws_iam_policy_document" "deploy_policy_document" {
  statement {
    actions = [
      "s3:ListBucket",
    ]

    resources = [
      "${aws_s3_bucket.site.arn}",
    ]
  }

  statement {
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = [
      "${aws_s3_bucket.site.arn}/*",
    ]
  }

  statement {
    actions = [
      "cloudfront:ListDistributions",
      "cloudfront:CreateInvalidation"
    ]

    resources = [
      "${aws_cloudfront_distribution.site.arn}"
    ]
  }
}

resource "aws_iam_user_policy" "deployer" {
  name   = "site-${local.domain}-deployer-policy"
  user   = aws_iam_user.deployer.id
  policy = data.aws_iam_policy_document.deploy_policy_document.json
}

resource "aws_iam_user" "deployer" {
  name = "site-${local.domain}-deployer"
}
