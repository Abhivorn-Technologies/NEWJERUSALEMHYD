from django.db import models

class Review(models.Model):
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, blank=True)
    rating = models.IntegerField(default=5)
    review_text = models.TextField()
    avatar = models.ImageField(upload_to='reviews/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
