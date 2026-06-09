import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from pages.models import Page, SiteSettings, NavMenuItem, HeroItem, Belief, BibleResource, StoryCategory, Activity
from songs.models import SongCategory, Song

def seed():
    # SiteSettings
    settings = SiteSettings.load()
    settings.phone1 = "+91 99999 99999"
    settings.phone2 = "+91 88888 88888"
    settings.email = "info@newjerusalemhyd.org"
    settings.address = "New Jerusalem Church, Secunderabad, Hyderabad, Telangana, India"
    settings.footer_tagline = "Spreading the love, faith, and hope of Jesus Christ to Hyderabad and beyond."
    settings.save()
    print("SiteSettings seeded.")

    # NavMenuItem
    NavMenuItem.objects.all().delete()
    
    home = NavMenuItem.objects.create(label="Home", url="/", order=1)
    songs = NavMenuItem.objects.create(label="Telugu Songs", url="/songs", order=3)
    resources = NavMenuItem.objects.create(label="Bible Resources", url="/bible-resources", order=4)
    sunday_school = NavMenuItem.objects.create(label="Sunday School", url="/sunday-school", order=5)
    prayer = NavMenuItem.objects.create(label="Prayer Request", url="/prayer-request", order=7)
    about = NavMenuItem.objects.create(label="About Us", url="/about", order=8)

    # Sub-menu items for About Us
    NavMenuItem.objects.create(label="Mission & Vision", url="/about", parent=about, order=1)
    NavMenuItem.objects.create(label="What We Believe", url="/about/what-we-believes", parent=about, order=2)

    print("NavMenuItems seeded.")

    # HeroItem
    HeroItem.objects.all().delete()
    hero_items = [
        ("⛪", "Worship Timings (ఆరాధన సమయాలు)", 1),
        ("📖", "Sermons (దైవ సందేశాలు)", 2),
        ("🎵", "Telugu Songs (తెలుగు కీర్తనలు)", 3),
        ("🙏", "Prayer Requests (ప్రార్థన విన్నపాలు)", 4),
    ]
    for icon, text, order in hero_items:
        HeroItem.objects.create(icon=icon, text=text, order=order)
    print("HeroItems seeded.")

    # Pages
    Page.objects.all().delete()
    Page.objects.create(
        title="Home Page",
        slug="home",
        content="<p>New Jerusalem Ministries is dedicated to spreading the gospel of Jesus Christ, building faith communities, and serving the spiritual and physical needs of people in Hyderabad and beyond.</p><p>We welcome you to join our weekly worship services and be part of a loving, growing Christian community.</p>",
        is_published=True
    )
    Page.objects.create(
        title="About Us",
        slug="about",
        content='''<div class="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b1e15] flex flex-col gap-4">
  <h3 class="text-xl font-bold text-[#8b1e15] mb-4">Our Vision:</h3>
  <p class="text-gray-700 leading-relaxed font-medium">Empowered by the holy spirit, the vision of our new Jerusalem ministries is to passionately spread the love and good news of Jesus Christ to our own communities, our country and to the ends of the earth as ambassadors for Jesus Christ.</p>
</div>
<div class="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b1e15] flex flex-col gap-4">
  <h3 class="text-xl font-bold text-[#8b1e15] mb-4">మా దృష్టి :</h3>
  <p class="text-gray-700 leading-relaxed font-medium">తండ్రి, కుమార, పరిశుద్ధాత్మ ద్వారా అధికారం పొంది, నూతన యెరూషలేము పరిచర్యల ద్వారా అనేకులను మన స్వంత సమాజాలకు, మన దేశానికి మరియు ప్రభువైన యేసుక్రీస్తుకు రాయబారులుగా భూదిగంతముల వరకు యేసుక్రీస్తు ప్రేమను మరియు ఆయన శుభవార్తను ఉత్తేజపూరితంగా విస్తరించడం.</p>
</div>
<div class="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b1e15] flex flex-col gap-4">
  <h3 class="text-xl font-bold text-[#8b1e15] mb-4">Our Mission:</h3>
  <div class="text-gray-700 leading-relaxed font-medium space-y-4">
    <p>We gather to glorify and praise God gloriously, to hear and respond obediently to what He has commanded.</p>
    <p>We are apostles teaching one another in Jesus Christ. Come together in prayer, love, faith, obedience and compassion.</p>
    <p>We are committed to serving as ambassadors to tell others about Jesus Christ.</p>
    <p>We pursue God\'s righteousness, justice, and peace in every place and time.</p>
    <p>Our ministry has no FCRA and no foreign funds. This is totally 100% Indian and Indigenous ministry.</p>
  </div>
</div>
<div class="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b1e15] flex flex-col gap-4">
  <h3 class="text-xl font-bold text-[#8b1e15] mb-4">మా మిషన్ :</h3>
  <div class="text-gray-700 leading-relaxed font-medium space-y-4">
    <p>మేము దేవునిని మహిమకరముగా ఘనపరచి, స్తుతించడానికి, ఆయన ఆజ్ఞాపించినవన్నీ వినడానికి మరియు విధేయత కలిగి ప్రతిస్పందించడానికి సమావేశమవుతాము.</p>
    <p>మేము యేసుక్రీస్తు నందు ఒకరినొకరు అపొస్తలుల బోధ, ప్రార్థన, ప్రేమ, విశ్వాసం, విధేయత మరియు కరుణతో కలిసిమెలసియుందుము.</p>
    <p>యేసుక్రీస్తును గురించి ఇతరులకు చెప్పడానికి రాయబారులుగా పనిచేయడానికి మేము కట్టుబడి ఉంటాము.</p>
    <p>మేము ప్రతి స్థలమునందు, సమయములలో దేవుని నీతి, న్యాయం, శాంతిని అనుసరిస్తాము. ప్రార్థన ఉపవాస, మార్గదర్శక ద్వారా ఈ మిషన్ నెరవేరుతుంది.</p>
    <p>నూతన యెరూషలేము పరిచర్యలు FCRA లేదు మరియు విదేశీ నిధులు లేవు. ఇది పూర్తిగా 100% భారతీయ మరియు స్వదేశీ పరిచర్యలు.</p>
  </div>
</div>''',
        is_published=True
    )
    print("Pages seeded.")

    # Belief
    Belief.objects.all().delete()
    beliefs = [
        ("✝️", "The Trinity", "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit.", 1),
        ("📖", "The Holy Scriptures", "We believe the Bible is the inspired, infallible, and authoritative Word of God, serving as the ultimate guide for faith and life.", 2),
        ("🕊️", "Salvation", "We believe that salvation is a free gift of God's grace, received through faith in Jesus Christ and His atoning sacrifice on the cross.", 3),
    ]
    for icon, title, content, order in beliefs:
        Belief.objects.create(icon=icon, title=title, content=content, order=order)
    print("Beliefs seeded.")

    # BibleResource
    BibleResource.objects.all().delete()
    resources = [
        ("Daily Devotionals", "/wp-content/uploads/2026/03/book-image.png", "#", 1),
        ("Bible Study Guides", "/wp-content/uploads/2026/03/text-image.png", "#", 2),
    ]
    for title, image, link, order in resources:
        BibleResource.objects.create(title=title, image=image, link=link, order=order)
    print("BibleResources seeded.")

    # Activity
    Activity.objects.all().delete()
    activities = [
        ("Coloring Pages", "🎨", "/activities", 1),
        ("Bible Quizzes", "🧠", "/activities", 2),
    ]
    for title, icon, link, order in activities:
        Activity.objects.create(title=title, icon=icon, link=link, order=order)
    print("Activities seeded.")

    # StoryCategory
    StoryCategory.objects.all().delete()
    stories = [
        ("Old Testament Stories", "/stories", 1),
        ("New Testament Stories", "/stories", 2),
    ]
    for title, link, order in stories:
        StoryCategory.objects.create(title=title, link=link, order=order)
    print("StoryCategories seeded.")

    # Add a Song category and a Song for testing
    SongCategory.objects.all().delete()
    Song.objects.all().delete()
    cat = SongCategory.objects.create(name="Worship", slug="worship")
    song = Song.objects.create(
        title="Hosanna",
        slug="hosanna",
        language="telugu",
        first_letter="H",
        telugu_lyrics="""<p>నా చిన్ని హృదయముతో<br>నా గొప్ప దేవుని నే ఆరాధించెదన్<br>పగిలిన నా కుండను<br>నా కుమ్మరి యొద్దకు తెచ్చి<br>బాగుచేయమని కోరెదన్&nbsp;<strong>(2)</strong></p>
<p>హోసన్న హోసన్నా యూదుల రాజుకే<br>హోసన్న హోసన్నా రానున్న రారాజుకే</p>
<p>మట్టి నుండి తీయబడితిని<br>మరలా మట్టికే చేరుదును&nbsp;<strong>(2)</strong><br>మన్నైన నేను మహిమగ మారుటకు<br>నీ మహిమను విడచితివే&nbsp;<strong>(2)</strong></p>
<p>హోసన్న హోసన్నా యూదుల రాజుకే<br>హోసన్న హోసన్నా రానున్న రారాజుకే&nbsp;<strong>(2)</strong></p>
<p>అడుగులు తడబడిన వేళలో<br>నీ కృపతో సరి చేసితివే&nbsp;<strong>(2)</strong><br>నా అడుగులు స్థిరపరచి నీ సేవకై<br>నడిచే కృప నాకిచ్చితివే&nbsp;<strong>(2)</strong></p>
<p>హోసన్న హోసన్నా యూదుల రాజుకే<br>హోసన్న హోసన్నా రానున్న రారాజుకే&nbsp;<strong>(2)</strong></p>
<p>ఈ లోక యాత్రలో<br>నాకున్న ఆశంతయూ&nbsp;<strong>(2)</strong><br>నా తుది శ్వాస విడచే వరకు<br>నీ పేరే ప్రకటించాలని&nbsp;<strong>(2)</strong></p>
<p>హోసన్న హోసన్నా యూదుల రాజుకే<br>హోసన్న హోసన్నా రానున్న రారాజుకే&nbsp;<strong>(2)</strong></p>""",
        english_lyrics="""<p>Naa Chinni Hrudayamutho<br>Naa Goppa Devuni Ne Aaraadhinchedan<br>Pagilina Naa Kundanu<br>Naa Kummari Yoddaku Thechchi<br>Baagucheyamani Koredan&nbsp;<strong>(2)</strong></p>
<p>Hosanna Hosannaa Yoodula Raajuke<br>Hosanna Hosannaa Raanunna Raaraajuke</p>
<p>Matti Nundi Theeyabadithini<br>Maralaa Mattike Cherudunu&nbsp;<strong>(2)</strong><br>Mannaina Nenu Mahimaga Maarutaku<br>Nee Mahimanu Vidachithive&nbsp;<strong>(2)</strong></p>
<p>Hosanna Hosannaa Yoodula Raajuke<br>Hosanna Hosannaa Raanunna Raaraajuke&nbsp;<strong>(2)</strong></p>
<p>Adugulu Thadabadina Velalo<br>Nee Krupatho Sari Chesithive&nbsp;<strong>(2)</strong><br>Naa Adugulu Sthiraparachi Nee Sevakai<br>Nadiche Krupa Naakichchithive&nbsp;<strong>(2)</strong></p>
<p>Hosanna Hosannaa Yoodula Raajuke<br>Hosanna Hosannaa Raanunna Raaraajuke&nbsp;<strong>(2)</strong></p>
<p>Ee Loka Yaathralo<br>Naakunna Aashanthayu&nbsp;<strong>(2)</strong><br>Naa Thudi Shwaasa Vidache Varaku<br>Nee Pere Prakatinchaalani&nbsp;<strong>(2)</strong></p>
<p>Hosanna Hosannaa Yoodula Raajuke<br>Hosanna Hosannaa Raanunna Raaraajuke&nbsp;<strong>(2)</strong></p>""",
        is_published=True
    )
    song.categories.add(cat)
    print("Songs & categories seeded.")

if __name__ == "__main__":
    seed()
