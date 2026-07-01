import os
import django

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from contact.models import ContactSubmission, PrayerRequest, MagazineSubscription
from pages.models import Magazine

print("Adding Contact Submissions...")
ContactSubmission.objects.create(
    name="John Doe",
    email="john.doe@example.com",
    phone="+1234567890",
    subject="Question about Sunday School",
    message="I would like to know the timings for the Sunday school."
)
ContactSubmission.objects.create(
    name="Jane Smith",
    email="jane.smith@example.com",
    phone="+0987654321",
    subject="Volunteering",
    message="How can I volunteer for the upcoming event?"
)

print("Adding Prayer Requests...")
PrayerRequest.objects.create(
    name="Michael Johnson",
    phone="555-1234",
    request_text="Please pray for my mother's health, she is in the hospital."
)
PrayerRequest.objects.create(
    name="Sarah Williams",
    phone="555-5678",
    request_text="Praying for guidance in my new job."
)

print("Adding Magazine Subscriptions...")
MagazineSubscription.objects.create(
    name="Robert Brown",
    phone="111-222-3333",
    email="robert.b@example.com",
    address="123 Main St, Springfield, IL 62701",
    is_active=True
)
MagazineSubscription.objects.create(
    name="Emily Davis",
    phone="444-555-6666",
    email="emily.d@example.com",
    address="456 Elm St, Metropolis, NY 10001",
    is_active=True
)

print("Adding Digital Magazines...")
Magazine.objects.create(
    title="Chinnarula Jalari - Issue 1",
    month_year="January 2026",
    language="Telugu",
    cover_image="magazines/covers/dummy_cover1.jpg",
    file="magazines/files/dummy_file1.pdf"
)
Magazine.objects.create(
    title="Chinnarula Jalari - Issue 2",
    month_year="February 2026",
    language="Telugu",
    cover_image="magazines/covers/dummy_cover2.jpg",
    file="magazines/files/dummy_file2.pdf"
)

print("Mock data successfully added!")
