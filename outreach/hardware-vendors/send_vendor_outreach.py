#!/usr/bin/env python3
"""Send personalized MakerWorks Lab hardware vendor outreach emails."""

from __future__ import annotations

import argparse
import csv
import html
import os
import random
import re
import smtplib
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from send_mwl_email import (  # noqa: E402
    DEFAULT_FROM_EMAIL,
    DEFAULT_FROM_NAME,
    DEFAULT_PASSWORD_ENV,
    EMAIL_RE,
    build_message,
    html_to_text,
)


DEFAULT_SUBJECTS = [
    "MakerWorks Lab Mumbai: hardware tryout partnership for {{COMPANY_NAME}}",
    "India robotics testbed for {{COMPANY_NAME}} hardware",
    "Can MakerWorks test {{SPECIFIC_HARDWARE}} in student robotics builds?",
    "Education samples and feedback partnership | MakerWorks Lab",
]
REQUIRED_COLUMNS = {
    "company_name",
    "priority",
    "email",
    "greeting",
    "specific_hardware",
    "ask_type",
    "company_note",
}
BOLD = "\033[1m"
RESET = "\033[0m"


def read_contacts(path: Path, only_priority: str | None) -> tuple[list[dict[str, str]], int]:
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED_COLUMNS.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing columns in {path}: {', '.join(sorted(missing))}")

        rows: list[dict[str, str]] = []
        seen: set[str] = set()
        skipped_without_email = 0

        for line_number, row in enumerate(reader, 2):
            clean = {key: (value or "").strip() for key, value in row.items()}
            priority = clean.get("priority", "").lower()
            if only_priority and priority != only_priority.lower():
                continue

            email = clean.get("email", "")
            if not email:
                skipped_without_email += 1
                continue

            if not EMAIL_RE.match(email):
                raise ValueError(f"Invalid email on line {line_number}: {email}")

            normalized = email.lower()
            if normalized in seen:
                continue
            seen.add(normalized)
            rows.append(clean)

    return rows, skipped_without_email


def render_template(template: str, row: dict[str, str], *, escape_values: bool = True) -> str:
    rendered = template
    for key, raw_value in row.items():
        placeholder = "{{" + key.upper() + "}}"
        value = html.escape(raw_value) if escape_values else raw_value
        rendered = rendered.replace(placeholder, value)
    return rendered


def choose_subject(args: argparse.Namespace) -> str:
    if args.subject:
        return args.subject
    return random.choice(DEFAULT_SUBJECTS)


def bold_text(value: str) -> str:
    if not sys.stdout.isatty():
        return value
    return f"{BOLD}{value}{RESET}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Send personalized MakerWorks hardware vendor outreach emails.")
    parser.add_argument(
        "--contacts",
        default=Path("outreach/hardware-vendors/vendor_targets.csv"),
        type=Path,
    )
    parser.add_argument(
        "--html",
        default=Path("outreach/hardware-vendors/vendor_outreach_email.html"),
        type=Path,
    )
    parser.add_argument("--only-priority", choices=["high", "medium", "low"], default=None)
    parser.add_argument(
        "--subject",
        default=None,
        help=f"Optional fixed subject. By default, each email randomly uses one of {len(DEFAULT_SUBJECTS)} subjects.",
    )
    parser.add_argument("--from-email", default=DEFAULT_FROM_EMAIL)
    parser.add_argument("--from-name", default=DEFAULT_FROM_NAME)
    parser.add_argument("--reply-to", default=DEFAULT_FROM_EMAIL)
    parser.add_argument("--password-env", default=DEFAULT_PASSWORD_ENV)
    parser.add_argument("--delay-seconds", default=8, type=int)
    parser.add_argument("--smtp-host", default="smtp.gmail.com")
    parser.add_argument("--smtp-port", default=465, type=int)
    parser.add_argument("--timeout", default=30, type=int)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--yes", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.delay_seconds < 0:
        print("Delay cannot be negative.", file=sys.stderr)
        return 2

    try:
        contacts, skipped_without_email = read_contacts(args.contacts, args.only_priority)
        template = args.html.read_text(encoding="utf-8")
    except (OSError, ValueError) as exc:
        print(exc, file=sys.stderr)
        return 1

    if not contacts:
        print("No contacts with direct email addresses matched the filters.", file=sys.stderr)
        if skipped_without_email:
            print(f"Skipped {skipped_without_email} rows without direct email addresses.", file=sys.stderr)
        return 1

    print(f"HTML template: {args.html}")
    print(f"Email contacts: {len(contacts)}")
    print(f"Skipped contact-form-only rows: {skipped_without_email}")
    print(f"From: {args.from_name} <{args.from_email}>")
    print(f"Reply-To: {args.reply_to}")
    if args.only_priority:
        print(f"Priority filter: {args.only_priority}")
    if args.subject:
        print(f"Subject override: {bold_text(args.subject)}")
    else:
        print(f"Subject mode: random pick from {len(DEFAULT_SUBJECTS)} subject lines per email")
    print(f"Delay: {args.delay_seconds} seconds between emails")
    print("Delivery mode: one personalized To-only email per vendor")

    rendered_messages: list[tuple[dict[str, str], str, str, str]] = []
    for contact in contacts:
        rendered_html = render_template(template, contact)
        rendered_subject = render_template(choose_subject(args), contact, escape_values=False)
        rendered_messages.append((contact, rendered_subject, rendered_html, html_to_text(rendered_html)))

    if args.dry_run:
        for index, (contact, subject, _rendered_html, plain_text) in enumerate(rendered_messages[:5], 1):
            preview = " ".join(plain_text.splitlines()[:7])
            print(f"Dry run [{index}/{len(contacts)}] {contact['email']} | {contact['company_name']}")
            print(f"Subject: {bold_text(subject)}")
            print(f"Preview: {preview[:300]}")
        if len(contacts) > 5:
            print(f"...and {len(contacts) - 5} more personalized emails")
        print("Dry run complete. No emails were sent.")
        return 0

    if not args.yes:
        confirmation = input("Type SEND to start sending personalized vendor emails: ").strip()
        if confirmation != "SEND":
            print("Cancelled. No emails were sent.")
            return 0

    password = re.sub(r"\s+", "", os.environ.get(args.password_env, ""))
    if not password:
        print(f"Missing Gmail app password. Set {args.password_env}.", file=sys.stderr)
        return 1

    try:
        with smtplib.SMTP_SSL(args.smtp_host, args.smtp_port, timeout=args.timeout) as smtp:
            smtp.login(args.from_email, password)
            total = len(rendered_messages)
            for index, (contact, subject, rendered_html, plain_text) in enumerate(rendered_messages, 1):
                message = build_message(
                    recipient=contact["email"],
                    html=rendered_html,
                    plain_text=plain_text,
                    subject=subject,
                    from_name=args.from_name,
                    from_email=args.from_email,
                    reply_to=args.reply_to,
                )
                smtp.send_message(message)
                print(
                    f"[{index}/{total}] Sent to {contact['email']} | "
                    f"{contact['company_name']} | Subject: {bold_text(subject)}"
                )
                if index < total and args.delay_seconds > 0:
                    time.sleep(args.delay_seconds)
    except (OSError, smtplib.SMTPException) as exc:
        print(f"Send failed: {exc}", file=sys.stderr)
        return 1

    print("All personalized vendor emails sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
