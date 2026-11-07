# Robotics Hardware Vendor Outreach

This directory is the working pack for reaching robotics hardware manufacturers, distributors, and developer-relations teams for:

- Early-access hardware tryouts and beta testing
- Engineering samples and in-kind donations
- Educational discounts and bulk pricing
- Co-marketing around student projects and competition teams

The core positioning is simple: MakerWorks Lab is not asking for charity. We are offering a serious Mumbai-based robotics testbed that can turn donated or trial hardware into technical feedback, student builds, public proof, and long-term ecosystem adoption.

## Files

- `strategy.md`: outreach positioning, ask ladder, proof points, and negotiation guidance.
- `email_templates.md`: ready-to-use email, LinkedIn, follow-up, and response templates.
- `lab_one_pager.md`: a one-page partnership brief to attach or paste into replies.
- `vendor_targets.csv`: India and global hardware targets with contact routes and ask angles.
- `vendor_outreach_email.html`: personalized HTML email template for direct email sending.
- `send_vendor_outreach.py`: Gmail SMTP sender for contacts that have direct email addresses.
- `sources.md`: official sources used to verify vendor/contact routes.

## Recommended workflow

1. Fill in missing lab metrics in `lab_one_pager.md`.
2. Review `vendor_targets.csv` and mark the first 10 vendors as `ready`.
3. For rows with direct emails, run a dry run:

```bash
python3 outreach/hardware-vendors/send_vendor_outreach.py \
  --contacts outreach/hardware-vendors/vendor_targets.csv \
  --html outreach/hardware-vendors/vendor_outreach_email.html \
  --dry-run
```

4. For rows with contact forms, copy the relevant template from `email_templates.md` into the vendor form.
5. Send in small batches, then follow up after 5 business days and 12 business days.

To actually send email through the existing MakerWorks Gmail SMTP flow:

```bash
export MWL_GMAIL_APP_PASSWORD='your-gmail-app-password'
python3 outreach/hardware-vendors/send_vendor_outreach.py \
  --contacts outreach/hardware-vendors/vendor_targets.csv \
  --html outreach/hardware-vendors/vendor_outreach_email.html \
  --only-priority high \
  --yes
```

The sender skips rows without a direct email address, so contact-form vendors stay in the tracker but are not emailed accidentally.

