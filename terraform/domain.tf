data "aws_route53_zone" "selected" {
  name = local.route53_zone_name
}

resource "aws_route53_record" "blog" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "google_search_console" {
  zone_id = data.aws_route53_zone.selected.zone_id
  name    = local.domain
  type    = "TXT"
  ttl     = "3600"
  records = ["google-site-verification=w2_cY-1YQcAq87zOZZhBegMk3L_hW-xGBg10fLKZnU8"]
}
