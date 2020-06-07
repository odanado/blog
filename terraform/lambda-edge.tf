data "archive_file" "function" {
  type        = "zip"
  source_dir  = "./function"
  output_path = "./function.zip"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_edge" {
  name = "${local.domain}-lambda-edge-role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_edge" {
  role       = aws_iam_role.lambda_edge.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "lambda_edge" {
  // lambda edge は virginia 限定
  provider = aws.virginia

  function_name = "${local.id}-lambda-edge"
  handler       = "process-trailing-slash.handler"

  filename         = data.archive_file.function.output_path
  source_code_hash = filebase64sha256(data.archive_file.function.output_path)

  role = aws_iam_role.lambda_edge.arn

  runtime = "nodejs12.x"

  // publish = true にすると apply するたびにバージョンが発行される
  // このバージョンが cloudfront に lambda edge を設定する時に必須
  publish = true
}
