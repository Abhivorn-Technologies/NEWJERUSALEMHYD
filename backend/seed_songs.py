import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from songs.models import SongCategory, Song

def seed_songs():
    # Make sure we have the Worship category
    category, _ = SongCategory.objects.get_or_create(name="Worship", slug="worship")

    songs_data = [
        # Telugu Songs (language="telugu")
        {
            "title": "మహిమకు యోగ్యుడా (Mahimaku Yogyuda)",
            "slug": "mahimaku-yogyuda",
            "language": "telugu",
            "first_letter": "మ",
            "telugu_lyrics": """<p>మహిమకు యోగ్యుడా నీకే స్తోత్రము<br>ఘనతకు అర్హుడా నీకే స్తోత్రము (2)</p>
<p>మహా దేవుడా నీకే స్తోత్రము<br>మహోన్నతుడా నీకే స్తోత్రము (2)</p>
<p>ఆరాధన నీకే ఆరాధన నీకే<br>ఆరాధన నీకే యేసయ్యా (2)</p>
<p>యేసు నీవే నా ఆరాధన<br>యేసు నీవే నా ఆలంబన (2)</p>""",
            "english_lyrics": """<p>Mahimaku Yogyuda Neeke Sthothramu<br>Ghanathaku Arhuda Neeke Sthothramu (2)</p>
<p>Maha Devuda Neeke Sthothramu<br>Mahonnathuda Neeke Sthothramu (2)</p>
<p>Aaraadhana Neeke Aaraadhana Neeke<br>Aaraadhana Neeke Yesayya (2)</p>
<p>Yesu Neeve Naa Aaraadhana<br>Yesu Neeve Naa Aalambana (2)</p>"""
        },
        {
            "title": "యేసుని నామము (Yesuni Namamu)",
            "slug": "yesuni-namamu",
            "language": "telugu",
            "first_letter": "యే",
            "telugu_lyrics": """<p>యేసుని నామము జయము జయము మనకు<br>యేసుని నామము జయము జయము మనకు (2)</p>
<p>సాతాను శక్తులన్ లయము చేయును<br>యేసుని నామమున విజయము మనకు (2)</p>
<p>హల్లెలూయ హల్లెలూయ జయమే మనకు<br>హల్లెలూయ హల్లెలూయ విజయమే మనకు (2)</p>
<p>పాపము నంతయు కడిగివేయును<br>యేసుని రక్తమున విజయము మనకు (2)</p>""",
            "english_lyrics": """<p>Yesuni Namamu Jayamu Jayamu Manaku<br>Yesuni Namamu Jayamu Jayamu Manaku (2)</p>
<p>Saathaanu Shakthulan Layamu Cheyunu<br>Yesuni Namamuna Vijayamu Manaku (2)</p>
<p>Hallelujah Hallelujah Jayame Manaku<br>Hallelujah Hallelujah Vijayame Manaku (2)</p>
<p>Paapamu Nanthayu Kadigiveyunu<br>Yesuni Rakthamuna Vijayamu Manaku (2)</p>"""
        },

        # Sunday School English Songs (language="sunday_english")
        {
            "title": "Jesus Loves Me",
            "slug": "jesus-loves-me",
            "language": "sunday_english",
            "first_letter": "J",
            "english_lyrics": """<p>Jesus loves me! This I know,<br>For the Bible tells me so;<br>Little ones to Him belong;<br>They are weak, but He is strong.</p>
<p>Yes, Jesus loves me!<br>Yes, Jesus loves me!<br>Yes, Jesus loves me!<br>The Bible tells me so.</p>
<p>Jesus loves me! He who died<br>Heaven's gate to open wide;<br>He will wash away my sin,<br>Let His little child come in.</p>""",
            "telugu_lyrics": """<p>యేసు నన్ను ప్రేమిస్తున్నాడు, నాకు తెలుసు,<br>ఎందుకంటే బైబిల్ నాకు అలా చెబుతోంది;<br>చిన్న పిల్లలు ఆయన వారే;<br>వారు బలహీనులు, కానీ ఆయన బలవంతుడు.</p>
<p>అవును, యేసు నన్ను ప్రేమిస్తున్నాడు!<br>అవును, యేసు నన్ను ప్రేమిస్తున్నాడు!<br>అవును, యేసు నన్ను ప్రేమిస్తున్నాడు!<br>బైబిల్ నాకు అలా చెబుతోంది.</p>"""
        },
        {
            "title": "Father Abraham",
            "slug": "father-abraham",
            "language": "sunday_english",
            "first_letter": "F",
            "english_lyrics": """<p>Father Abraham had many sons<br>Many sons had Father Abraham<br>I am one of them and so are you<br>So let's just praise the Lord.</p>
<p>Right arm, left arm, right foot, left foot<br>Chin up, turn around, sit down!</p>""",
            "telugu_lyrics": """<p>తండ్రి అబ్రాహాముకు చాలా మంది కుమారులు ఉన్నారు<br>చాలా మంది కుమారులు ఉన్నారు తండ్రి అబ్రాహాముకు<br>నేను వారిలో ఒకడిని మరియు నీవు కూడా<br>కాబట్టి మనం ప్రభువును స్తుతిద్దాం.</p>"""
        },
        {
            "title": "This Little Light of Mine",
            "slug": "this-little-light-of-mine",
            "language": "sunday_english",
            "first_letter": "T",
            "english_lyrics": """<p>This little light of mine, I'm gonna let it shine<br>This little light of mine, I'm gonna let it shine<br>This little light of mine, I'm gonna let it shine<br>Let it shine, let it shine, let it shine.</p>
<p>Hide it under a bushel? No! I'm gonna let it shine<br>Hide it under a bushel? No! I'm gonna let it shine<br>Let it shine, let it shine, let it shine.</p>
<p>Don't let Satan blow it out, I'm gonna let it shine<br>Don't let Satan blow it out, I'm gonna let it shine<br>Let it shine, let it shine, let it shine.</p>""",
            "telugu_lyrics": """<p>నా ఈ చిన్న వెలుగును నేను ప్రకాశింపజేస్తాను<br>నా ఈ చిన్న వెలుగును నేను ప్రకాశింపజేస్తాను<br>నా ఈ చిన్న వెలుగును నేను ప్రకాశింపజేస్తాను<br>ప్రకాశించనివ్వండి, ప్రకాశించనివ్వండి.</p>"""
        },

        # Sunday School Hindi Songs (language="sunday_hindi")
        {
            "title": "Yesu Pyara Hai (यीशु प्यारा है)",
            "slug": "yesu-pyara-hai",
            "language": "sunday_hindi",
            "first_letter": "य",
            "english_lyrics": """<p>Yesu pyara hai, mera pyara hai<br>Saare sansar me, wo sabse pyara hai (2)</p>
<p>Hum bacho ko wo pyar karta hai<br>Apne dil me wo humko rakhta hai (2)</p>
<p>Yesu pyara hai, mera pyara hai<br>Saare sansar me, wo sabse pyara hai (2)</p>""",
            "telugu_lyrics": """<p>యేసు ప్యారా హై, మేరా ప్యారా హై<br>సారే సంసార్ మే, వో సబ్సే ప్యారా హై (2)</p>"""
        },
        {
            "title": "Aao Chale Mandir (आओ चलें मंदिर)",
            "slug": "aao-chale-mandir",
            "language": "sunday_hindi",
            "first_letter": "आ",
            "english_lyrics": """<p>Aao chale mandir, aao chale mandir<br>Yesu ke charno me, shish jhukane (2)</p>
<p>Prem se hum gaege, geet sunaege<br>Yesu mashi ko hum, apna banaege (2)</p>""",
            "telugu_lyrics": """<p>ఆవో చలే మందిర్, ఆవో చలే మందిర్<br>యేసు కే చరణో మే, శీష్ ఝుకానే (2)</p>"""
        },
        {
            "title": "Khuda Ka Pyar (खुदा का प्यार)",
            "slug": "khuda-ka-pyar",
            "language": "sunday_hindi",
            "first_letter": "ख",
            "english_lyrics": """<p>Khuda ka pyar mahasagar se bhi gahra hai<br>Aasman se bhi uncha hai, bada hi nirala hai (2)</p>
<p>Khuda ka pyar kabhi badalta nahi<br>Wo to sachha aur sada rahta hai (2)</p>""",
            "telugu_lyrics": """<p>ఖుదా కా ప్యార్ మహాసాగర్ సే భీ గహరా హై<br>ఆస్మాన్ సే భీ ఉంఛా హై, బడా హీ నిరాలా హై (2)</p>"""
        }
    ]

    for item in songs_data:
        song, created = Song.objects.update_or_create(
            slug=item["slug"],
            defaults={
                "title": item["title"],
                "language": item["language"],
                "first_letter": item["first_letter"],
                "telugu_lyrics": item.get("telugu_lyrics", ""),
                "english_lyrics": item.get("english_lyrics", ""),
                "is_published": True
            }
        )
        song.categories.add(category)
        action = "Created" if created else "Updated"
        print(f"{action} song: {song.slug} ({song.language})")

if __name__ == "__main__":
    seed_songs()
