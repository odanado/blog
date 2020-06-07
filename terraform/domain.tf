data "aws_route53_zone" "selected" {
  name         = local.route53_zone_name
}

resource "aws_route53_record" "blog" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name = local.domain
  type = "A"

  alias {
    name = aws_cloudfront_distribution.site.domain_name
    zone_id = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = true
  }
}
