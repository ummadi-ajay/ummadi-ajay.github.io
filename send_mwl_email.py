#!/usr/bin/env python3
"""Send the MakerWorks Lab HTML campaign through Gmail SMTP.

The script sends one email per recipient using only the To header. It does not
use CC, BCC, or a shared recipient list.
"""

from __future__ import annotations

import argparse
import os
import random
import re
import smtplib
import sys
import time
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
from html.parser import HTMLParser
from pathlib import Path


DEFAULT_FROM_EMAIL = "makerworkslab@gmail.com"
DEFAULT_FROM_NAME = "MakerWorks Lab"
DEFAULT_PASSWORD_ENV = "MWL_GMAIL_APP_PASSWORD"
DEFAULT_SUBJECTS = [
    "Make the best use of summer break with MakerWorks Lab",
    "Robotics, AI, and engineering programs for curious students",
    "Help your child build real engineering skills this summer",
    "Build robots, code AI, and prepare for STEM competitions",
    "A hands-on maker program for young innovators",
    "Summer robotics and AI learning at MakerWorks Lab",
    "From projects to competitions: MakerWorks Lab programs",
    "Give your child a stronger STEM foundation",
    "Portfolio-building robotics and AI programs for students",
    "Learn, build, compete: MakerWorks Lab programs",
]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style"}:
            self._skip_depth += 1
        if tag in {"p", "div", "tr", "h1", "h2", "h3", "br", "li"}:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style"} and self._skip_depth:
            self._skip_depth -= 1
        if tag in {"p", "div", "tr", "h1", "h2", "h3", "li"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        text = data.strip()
        if text:
            self.parts.append(text)

    def text(self) -> str:
        lines = []
        for raw_line in "".join(self.parts).splitlines():
            line = re.sub(r"\s+", " ", raw_line).strip()
            if line:
                lines.append(line)
        return "\n".join(lines)


def html_to_text(html: str) -> str:
    extractor = TextExtractor()
    extractor.feed(html)
    return extractor.text()


def read_recipients(path: Path) -> list[str]:
    recipients: list[str] = []
    seen: set[str] = set()

    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        email = raw_line.strip()
        if not email or email.startswith("#"):
            continue

        if not EMAIL_RE.match(email):
            raise ValueError(f"Invalid email on line {line_number}: {email}")

        normalized = email.lower()
        if normalized not in seen:
            recipients.append(email)
            seen.add(normalized)

    return recipients


def build_message(
    *,
    recipient: str,
    html: str,
    plain_text: str,
    subject: str,
    from_name: str,
    from_email: str,
    reply_to: str | None,
) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr((from_name, from_email))
    message["To"] = recipient
    message["Date"] = formatdate(localtime=True)
    message["Message-ID"] = make_msgid(domain=from_email.split("@", 1)[-1])

    if reply_to:
        message["Reply-To"] = reply_to

    message.set_content(plain_text, subtype="plain", charset="utf-8")
    message.add_alternative(html, subtype="html", charset="utf-8")
    return message


def choose_subject(args: argparse.Namespace) -> str:
    if args.subject:
        return args.subject
    return random.choice(DEFAULT_SUBJECTS)


def send_messages(args: argparse.Namespace, recipients: list[str], html: str, plain_text: str) -> None:
    raw_password = os.environ.get(args.password_env, "")
    password = re.sub(r"\s+", "", raw_password)

    if not password:
        raise RuntimeError(
            f"Missing Gmail app password. Set it with: export {args.password_env}='your-app-password'"
        )

    with smtplib.SMTP_SSL(args.smtp_host, args.smtp_port, timeout=args.timeout) as smtp:
        smtp.login(args.from_email, password)

        total = len(recipients)
        for index, recipient in enumerate(recipients, 1):
            subject = choose_subject(args)
            message = build_message(
                recipient=recipient,
                html=html,
                plain_text=plain_text,
                subject=subject,
                from_name=args.from_name,
                from_email=args.from_email,
                reply_to=args.reply_to,
            )
            smtp.send_message(message)
            print(f"[{index}/{total}] Sent to {recipient} | Subject: {subject}", flush=True)

            if index < total and args.delay_seconds > 0:
                print(f"Waiting {args.delay_seconds} seconds before the next email...", flush=True)
                time.sleep(args.delay_seconds)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Send invite_email_mwl_programs.html through Gmail, one To-only email per recipient."
    )
    parser.add_argument(
        "--recipients",
        required=True,
        type=Path,
        help="Text file with one recipient email per line. Blank lines and # comments are ignored.",
    )
    parser.add_argument(
        "--html",
        default=Path("invite_email_mwl_programs.html"),
        type=Path,
        help="HTML email file to send.",
    )
    parser.add_argument(
        "--subject",
        default=None,
        help="Optional fixed subject override. By default, each email randomly uses one of 10 subjects.",
    )
    parser.add_argument("--from-email", default=DEFAULT_FROM_EMAIL)
    parser.add_argument("--from-name", default=DEFAULT_FROM_NAME)
    parser.add_argument("--reply-to", default=DEFAULT_FROM_EMAIL)
    parser.add_argument("--password-env", default=DEFAULT_PASSWORD_ENV)
    parser.add_argument("--delay-seconds", default=60, type=int)
    parser.add_argument("--smtp-host", default="smtp.gmail.com")
    parser.add_argument("--smtp-port", default=465, type=int)
    parser.add_argument("--timeout", default=30, type=int)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate inputs and show what would be sent, without logging in or sending email.",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip the confirmation prompt before sending.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.delay_seconds < 0:
        print("Delay cannot be negative.", file=sys.stderr)
        return 2

    try:
        recipients = read_recipients(args.recipients)
        html = args.html.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"Could not read input file: {exc}", file=sys.stderr)
        return 1
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if not recipients:
        print("No recipients found.", file=sys.stderr)
        return 1

    plain_text = html_to_text(html)

    print(f"HTML file: {args.html}")
    print(f"Recipients: {len(recipients)}")
    print(f"From: {formataddr((args.from_name, args.from_email))}")
    print(f"Reply-To: {args.reply_to}")
    if args.subject:
        print(f"Subject override: {args.subject}")
    else:
        print(f"Subject mode: random pick from {len(DEFAULT_SUBJECTS)} subject lines per email")
    print(f"Delay: {args.delay_seconds} seconds between emails")
    print("Delivery mode: one individual To-only email per recipient")

    if args.dry_run:
        preview_count = min(5, len(recipients))
        for index, recipient in enumerate(recipients[:preview_count], 1):
            print(f"Dry run subject sample [{index}/{len(recipients)}] {recipient}: {choose_subject(args)}")
        if len(recipients) > preview_count:
            print(f"...and {len(recipients) - preview_count} more recipients")
        print("Dry run complete. No emails were sent.")
        return 0

    if not args.yes:
        confirmation = input("Type SEND to start sending: ").strip()
        if confirmation != "SEND":
            print("Cancelled. No emails were sent.")
            return 0

    try:
        send_messages(args, recipients, html, plain_text)
    except (smtplib.SMTPException, RuntimeError, OSError) as exc:
        print(f"Send failed: {exc}", file=sys.stderr)
        return 1

    print("All emails sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
