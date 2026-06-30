from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Count, Q
from songs.models import Song, SongCategory
from pages.models import ContentItem
from contact.models import PrayerRequest

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Global Counts
        total_songs = Song.objects.count()
        active_songs = Song.objects.filter(is_published=True).count()
        inactive_songs = total_songs - active_songs
        audio_songs = Song.objects.exclude(audio_video='').exclude(audio_video__isnull=True).count()
        
        total_categories = SongCategory.objects.count()
        total_content = ContentItem.objects.count()
        active_content = ContentItem.objects.filter(is_active=True).count()
        
        unread_prayer_requests = PrayerRequest.objects.filter(is_read=False).count()

        # Stories & Activities Breakdown (from ContentItem)
        # Using the exact labels from the sections
        content_items_by_section = list(ContentItem.objects.values('section').annotate(
            total=Count('id'),
            active=Count('id', filter=Q(is_active=True))
        ))
        
        # Language Breakdown
        language_breakdown = list(Song.objects.values('language').annotate(
            total=Count('id'),
            active=Count('id', filter=Q(is_published=True)),
            inactive=Count('id', filter=Q(is_published=False))
        ))
        
        # Category Breakdown
        # We need to join SongCategory with Songs.
        # A category might have active and inactive songs.
        category_breakdown = list(SongCategory.objects.values('name').annotate(
            total=Count('song'),
            active=Count('song', filter=Q(song__is_published=True)),
            inactive=Count('song', filter=Q(song__is_published=False))
        ))
        
        # Letter Wise Breakdown
        letter_breakdown = list(Song.objects.values('language', 'first_letter').annotate(
            total=Count('id')
        ).order_by('language', 'first_letter'))

        return Response({
            'global_counts': {
                'total_songs': total_songs,
                'active_songs': active_songs,
                'inactive_songs': inactive_songs,
                'audio_songs': audio_songs,
                'total_categories': total_categories,
                'total_content': total_content,
                'active_content': active_content,
                'unread_prayer_requests': unread_prayer_requests,
            },
            'content_breakdown': content_items_by_section,
            'language_breakdown': language_breakdown,
            'category_breakdown': category_breakdown,
            'letter_breakdown': letter_breakdown
        })

class ChangePasswordView(APIView):
    from rest_framework.permissions import IsAuthenticated
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({'error': 'Old and new passwords are required.'}, status=400)

        if not user.check_password(old_password):
            return Response({'error': 'Incorrect current password.'}, status=400)

        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password successfully changed.'})
