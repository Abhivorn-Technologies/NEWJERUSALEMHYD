from django.db import models

class SongCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Song(models.Model):
    LANGUAGE_CHOICES = [
        ('telugu', 'Telugu'),
        ('sunday_telugu', 'Sunday School Telugu'),
        ('others', 'Others'),
        ('sunday_hindi', 'Sunday School Hindi'),
        ('sunday_english', 'Sunday School English'),
    ]
    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, max_length=500)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='telugu')
    first_letter = models.CharField(max_length=10)
    categories = models.ManyToManyField(SongCategory, blank=True)
    
    telugu_lyrics = models.TextField(blank=True)
    hindi_lyrics = models.TextField(blank=True)
    english_lyrics = models.TextField(blank=True)
    powerpoint_slides = models.TextField(blank=True)
    audio_video = models.TextField(blank=True)
    chords = models.TextField(blank=True)
    
    thumbnail = models.ImageField(upload_to='songs/', blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    wp_post_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title
