from django.contrib import admin
from .models import (
    Page, SiteSettings, NavMenuItem, HeroItem,
    Belief, BibleResource, StoryCategory, Activity
)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'phone1', 'phone2', 'email')
    fieldsets = (
        ('Site Identity', {'fields': ('site_name',)}),
        ('Contact Information', {'fields': ('phone1', 'phone2', 'email', 'address')}),
        ('Footer', {'fields': ('footer_tagline',)}),
    )

    def has_add_permission(self, request):
        # Only one row allowed (singleton)
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(NavMenuItem)
class NavMenuItemAdmin(admin.ModelAdmin):
    list_display = ('label', 'url', 'parent', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('parent', 'is_active')
    ordering = ('order',)


@admin.register(HeroItem)
class HeroItemAdmin(admin.ModelAdmin):
    list_display = ('icon', 'text', 'order')
    list_editable = ('order',)


@admin.register(Belief)
class BeliefAdmin(admin.ModelAdmin):
    list_display = ('icon', 'title', 'order')
    list_editable = ('order',)


@admin.register(BibleResource)
class BibleResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'order')
    list_editable = ('order',)


@admin.register(StoryCategory)
class StoryCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'order')
    list_editable = ('order',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'link', 'order')
    list_editable = ('order',)


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'updated_at')
    list_filter = ('is_published',)
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}

