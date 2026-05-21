from rest_framework import routers, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from songs.models import Song, SongCategory
from pages.models import (
    Page, SiteSettings, NavMenuItem, HeroItem,
    Belief, BibleResource, StoryCategory, Activity
)

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

# ── Song ViewSets ─────────────────────────────────────────────────────────────

class SongViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Song.objects.filter(is_published=True)
    serializer_class = SongSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        language = self.request.query_params.get('language')
        category = self.request.query_params.get('category')
        letter = self.request.query_params.get('letter')
        if language:
            queryset = queryset.filter(language=language)
        if category:
            queryset = queryset.filter(categories__slug=category)
        if letter:
            queryset = queryset.filter(first_letter=letter)
        return queryset

class SongCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SongCategory.objects.all()
    serializer_class = SongCategorySerializer

# ── Page ViewSets ─────────────────────────────────────────────────────────────

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    lookup_field = 'slug'

class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

class NavMenuViewSet(viewsets.ReadOnlyModelViewSet):
    # Only return top-level items (children are nested inside)
    queryset = NavMenuItem.objects.filter(is_active=True, parent=None)
    serializer_class = NavMenuItemSerializer

class HeroItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroItem.objects.all()
    serializer_class = HeroItemSerializer

class BeliefViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Belief.objects.all()
    serializer_class = BeliefSerializer

class BibleResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BibleResource.objects.all()
    serializer_class = BibleResourceSerializer

class StoryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StoryCategory.objects.all()
    serializer_class = StoryCategorySerializer

class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

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
