from rest_framework import routers, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from songs.models import Song, SongCategory
from pages.models import (
    Page, SiteSettings, NavMenuItem, HeroItem,
    Belief, BibleResource, StoryCategory, Activity, ContentItem,
    ResourceDownload, Magazine
)
from contact.models import ContactSubmission, PrayerRequest, MagazineSubscription
from reviews.models import Review

# ── Song Serializers ──────────────────────────────────────────────────────────

class SongCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SongCategory
        fields = '__all__'

class SongSerializer(serializers.ModelSerializer):
    categories = SongCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Song
        fields = '__all__'

class SongListSerializer(serializers.ModelSerializer):
    categories = SongCategorySerializer(many=True, read_only=True)
    class Meta:
        model = Song
        fields = ['id', 'title', 'slug', 'language', 'first_letter', 'categories', 'thumbnail', 'is_published', 'created_at']

# ── Page Serializers ──────────────────────────────────────────────────────────

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class NavMenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = NavMenuItem
        fields = ['id', 'label', 'url', 'order', 'is_active', 'children']

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return NavMenuItemSerializer(children, many=True).data

class HeroItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroItem
        fields = '__all__'

class BeliefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Belief
        fields = '__all__'

class BibleResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BibleResource
        fields = '__all__'

class StoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryCategory
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = '__all__'

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = '__all__'

class PrayerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerRequest
        fields = '__all__'

class MagazineSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MagazineSubscription
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ResourceDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceDownload
        fields = '__all__'

class MagazineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Magazine
        fields = '__all__'

# ── Song ViewSets ─────────────────────────────────────────────────────────────

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

    def get_queryset(self):
        # Allow authenticated admins to see all songs, otherwise only published
        if self.request.user.is_authenticated:
            queryset = Song.objects.all().prefetch_related('categories')
        else:
            queryset = Song.objects.filter(is_published=True).prefetch_related('categories')

        language = self.request.query_params.get('language')
        category = self.request.query_params.get('category')
        letter = self.request.query_params.get('letter')
        if language and language != 'all':
            queryset = queryset.filter(language=language)
        if category:
            queryset = queryset.filter(categories__slug=category)
        if letter:
            queryset = queryset.filter(first_letter=letter)
        return queryset

class SongCategoryViewSet(viewsets.ModelViewSet):
    queryset = SongCategory.objects.all()
    serializer_class = SongCategorySerializer

# ── Page ViewSets ─────────────────────────────────────────────────────────────

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Page.objects.all()
        return Page.objects.filter(is_published=True)

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

class NavMenuViewSet(viewsets.ModelViewSet):
    # Only return top-level items (children are nested inside)
    queryset = NavMenuItem.objects.filter(is_active=True, parent=None)
    serializer_class = NavMenuItemSerializer

class HeroItemViewSet(viewsets.ModelViewSet):
    queryset = HeroItem.objects.all()
    serializer_class = HeroItemSerializer

class BeliefViewSet(viewsets.ModelViewSet):
    queryset = Belief.objects.all()
    serializer_class = BeliefSerializer

class BibleResourceViewSet(viewsets.ModelViewSet):
    queryset = BibleResource.objects.all()
    serializer_class = BibleResourceSerializer

class StoryCategoryViewSet(viewsets.ModelViewSet):
    queryset = StoryCategory.objects.all()
    serializer_class = StoryCategorySerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class ContentItemViewSet(viewsets.ModelViewSet):
    queryset = ContentItem.objects.all()
    serializer_class = ContentItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        section = self.request.query_params.get('section')
        if section and section != 'all':
            queryset = queryset.filter(section=section)
        return queryset

class ContactSubmissionViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all().order_by('-submitted_at')
    serializer_class = ContactSubmissionSerializer

class PrayerRequestViewSet(viewsets.ModelViewSet):
    queryset = PrayerRequest.objects.all().order_by('-submitted_at')
    serializer_class = PrayerRequestSerializer

class MagazineSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = MagazineSubscription.objects.all().order_by('-subscribed_at')
    serializer_class = MagazineSubscriptionSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

class ResourceDownloadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResourceDownload.objects.all()
    serializer_class = ResourceDownloadSerializer

class MagazineViewSet(viewsets.ModelViewSet):
    queryset = Magazine.objects.all()
    serializer_class = MagazineSerializer

# ── Router ────────────────────────────────────────────────────────────────────

router = routers.DefaultRouter()
router.register(r'songs', SongViewSet)
router.register(r'categories', SongCategoryViewSet)
router.register(r'pages', PageViewSet)
router.register(r'site-settings', SiteSettingsViewSet)
router.register(r'nav-menu', NavMenuViewSet)
router.register(r'hero-items', HeroItemViewSet)
router.register(r'beliefs', BeliefViewSet)
router.register(r'bible-resources', BibleResourceViewSet)
router.register(r'story-categories', StoryCategoryViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'content-items', ContentItemViewSet)
router.register(r'contact-submissions', ContactSubmissionViewSet)
router.register(r'prayer-requests', PrayerRequestViewSet)
router.register(r'magazine-subscriptions', MagazineSubscriptionViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'resource-downloads', ResourceDownloadViewSet)
router.register(r'magazines', MagazineViewSet)
