from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    content = models.TextField(blank=True)
    meta_description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    wp_post_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title


class SiteSettings(models.Model):
    """Singleton model for global site configuration."""
    site_name = models.CharField(max_length=255, default='New Jerusalem Ministries')
    phone1 = models.CharField(max_length=50, blank=True)
    phone2 = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    footer_tagline = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        # Enforce singleton: only one row allowed
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class NavMenuItem(models.Model):
    """Navigation menu items with optional dropdown parent."""
    label = models.CharField(max_length=100)
    url = models.CharField(max_length=255)
    parent = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.CASCADE,
        related_name='children'
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = 'Nav Menu Item'
        verbose_name_plural = 'Nav Menu Items'

    def __str__(self):
        if self.parent:
            return f'  └─ {self.label} (under {self.parent.label})'
        return self.label


class HeroItem(models.Model):
    """Feature cards on the hero banner."""
    icon = models.CharField(max_length=10, help_text='Emoji icon character')
    text = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.icon} {self.text}'


class Belief(models.Model):
    """Cards on the What We Believe page."""
    icon = models.CharField(max_length=10, help_text='Emoji icon character')
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class BibleResource(models.Model):
    """Cards on the Bible Resources page."""
    title = models.CharField(max_length=200)
    image = models.CharField(max_length=500, help_text='Path to image, e.g. /wp-content/uploads/...')
    link = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class StoryCategory(models.Model):
    """Story categories on the Bible Stories page."""
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Story Category'
        verbose_name_plural = 'Story Categories'

    def __str__(self):
        return self.title


class Activity(models.Model):
    """Activity cards on the Activities page."""
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=10, help_text='Emoji icon character')
    link = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Activity'
        verbose_name_plural = 'Activities'

    def __str__(self):
        return self.title


class ContentItem(models.Model):
    """Unified model for various content sections like stories, infographics, maps, etc."""
    SECTION_CHOICES = [
        # Bible Resources
        ('Infographics', 'Infographics'),
        ('Maps', 'Maps'),
        ('Resource Stories', 'Resource Stories'),
        ('Downloads', 'Downloads'),
        ('Genealogies', 'Genealogies'),
        # Missionary Stories
        ('Missionary Stories', 'Missionary Stories'),
        # Bible Stories & Activities
        ('Old Testament', 'Old Testament Stories'),
        ('New Testament', 'New Testament Stories'),
        ('Topical', 'Topical Lessons'),
        ('Biographical', 'Biographical Stories'),
        ('Pre School', 'Pre School Lessons'),
        ('Coloring', 'Coloring Activities'),
        ('Puzzles', 'Bible Puzzles'),
        ('Quizzes', 'Bible Quizzes'),
    ]

    title = models.CharField(max_length=255)
    section = models.CharField(max_length=50, choices=SECTION_CHOICES)
    link = models.CharField(max_length=500, blank=True, help_text='URL or file path')
    second_link = models.CharField(max_length=500, blank=True, help_text='Secondary URL or file path (optional)')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Content Item'
        verbose_name_plural = 'Content Items'

    def __str__(self):
        return f"{self.title} ({self.section})"

class ResourceDownload(models.Model):
    """Functional downloads for Software and PPTs."""
    CATEGORY_CHOICES = (
        ('Software', 'Software'),
        ('PPT', 'PPT'),
    )
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Software')
    file = models.FileField(upload_to='downloads/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = 'Resource Download'
        verbose_name_plural = 'Resource Downloads'

    def __str__(self):
        return f"{self.title} ({self.category})"


class Magazine(models.Model):
    """Digital Magazines for download."""
    title = models.CharField(max_length=200)
    month_year = models.CharField(max_length=100, help_text="e.g. May 2026")
    language = models.CharField(max_length=100, default="Telugu")
    cover_image = models.FileField(upload_to='magazines/covers/')
    file = models.FileField(upload_to='magazines/files/')
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Magazine'
        verbose_name_plural = 'Magazines'

    def __str__(self):
        return f"{self.title} - {self.month_year}"

