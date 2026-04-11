const translations = {
    en: {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.team": "Team",
        "nav.games": "Games",
        "nav.ratings": "Ratings",
        "nav.store": "Store",
        "nav.discord": "Discord",
        "hero.badge": "MINECRAFT NETWORK",
        "hero.subtitle": "The Best PvP Experience",
        "hero.cta": "START PLAYING",
        "about.title1": "Enjoy the PvP",
        "about.title2": "Experience.",
        "cinematic.tagline": "Explore the world of MafiaMC with full freedom of play.",
        "info.title": "Server Info",
        "info.desc": "Everything you need to know about the MafiaMC network.",
        "info.status": "Status",
        "info.maintenance": "Maintenance",
        "info.version": "Version",
        "info.maintenancenote": "Server is under maintenance — Next step is coming..",
        "games.title": "Server Games",
        "games.desc": "Choose your battlefield.",
        "game.live": "LIVE",
        "game.soon": "COMING SOON",
        "game.redpvp": "RedPvP",
        "game.redpvp.desc": "Collect some Redstone and buy axes to be the top #1",
        "game.skypvp": "SkyPvP",
        "game.skypvp.desc": "Battle in the skies on floating islands. Upgrade your gear, fight for dominance. Coming soon.",
        "game.play": "PLAY NOW",
        "game.staytuned": "STAY TUNED",
        "vote.title": "Vote for Server",
        "vote.desc": "Support MafiaMC by voting on these sites!",
        "discord.title": "Join Our Community",
        "discord.desc": "Connect with players, get updates, and have fun!",
        "store.title": "Visit Our Store",
        "store.desc": "Get exclusive ranks, kits, and items.",
        "ratings.title": "Player Ratings",
        "ratings.desc": "What our players say about MafiaMC.",
        "rating.cta": "Leave a Rating",
        "rating.formTitle": "Rate Our Server",
        "rating.formSubtitle": "Your feedback helps us improve",
        "rating.username": "Minecraft Username",
        "rating.review": "Your Review",
        "rating.cancel": "Cancel",
        "rating.submit": "Submit Rating",
        "rating.successTitle": "Thank you for your feedback!",
        "rating.successSub": "Your rating has been submitted successfully",
        "footer.links": "Links",
        "footer.follow": "Follow Us",
        "footer.rights": "&copy; 2021-2026 MafiaMC. All Rights Reserved.",
        "footer.dev": "Developed by Dghem",
        "footer.owner": "MafiaMC Owner"
    },
    ar: {
        "nav.home": "الرئيسية",
        "nav.about": "حول",
        "nav.team": "الفريق",
        "nav.games": "الألعاب",
        "nav.ratings": "التقييمات",
        "nav.store": "المتجر",
        "nav.discord": "ديسكورد",
        "hero.badge": "شبكة ماينكرافت",
        "hero.subtitle": "أفضل تجربة لاعب ضد لاعب",
        "hero.cta": "العب الآن",
        "about.title1": "استمتع بتجربة",
        "about.title2": "الـ PvP الأفضل.",
        "cinematic.tagline": "استكشف عالم MafiaMC بحرية لعب كاملة.",
        "info.title": "معلومات السيرفر",
        "info.desc": "كل ما تحتاج معرفته عن شبكة MafiaMC.",
        "info.status": "الحالة",
        "info.maintenance": "صيانة",
        "info.version": "الإصدار",
        "info.maintenancenote": "السيرفر تحت الصيانة — الخطوة القادمة قريباً..",
        "games.title": "ألعاب السيرفر",
        "games.desc": "اختر ساحة المعركة الخاصة بك.",
        "game.live": "مباشر",
        "game.soon": "قريباً",
        "game.redpvp": "RedPvP",
        "game.redpvp.desc": "اجمع بعض الريدستون واشتري الفؤوس لتصبح الأول #1",
        "game.skypvp": "SkyPvP",
        "game.skypvp.desc": "قاتل في السماء على جزر عائمة. طور عتادك وقاتل من أجل السيطرة. قريباً.",
        "game.play": "العب الآن",
        "game.staytuned": "ترقبوا",
        "vote.title": "صوت للسيرفر",
        "vote.desc": "ادعم MafiaMC واكسب جوائز عبر التصويت هنا!",
        "discord.title": "انضم لمجتمعنا",
        "discord.desc": "تواصل مع اللاعبين، احصل على التحديثات، واستمتع!",
        "store.title": "زور متجرنا",
        "store.desc": "احصل على رتب خاصة وعناصر مميزة.",
        "ratings.title": "تقييمات اللاعبين",
        "ratings.desc": "ما يقوله لاعبونا عن MafiaMC.",
        "rating.cta": "اترك تقييماً",
        "rating.formTitle": "قيم السيرفر",
        "rating.formSubtitle": "رأيك يهمنا ويساعدنا على التطور",
        "rating.username": "اسمك في ماينكرافت",
        "rating.review": "تقييمك",
        "rating.cancel": "إلغاء",
        "rating.submit": "إرسال التقييم",
        "rating.successTitle": "شكراً لتقييمك!",
        "rating.successSub": "تم إرسال تقييمك بنجاح",
        "footer.links": "الروابط",
        "footer.follow": "تابعنا",
        "footer.rights": "&copy; 2021-2026 MafiaMC. جميع الحقوق محفوظة.",
        "footer.dev": "تم التطوير بواسطة Dghem",
        "footer.owner": "مالك MafiaMC"
    }
};

let currentLang = 'en';

// Detect system language
const systemLang = navigator.language || navigator.userLanguage;
if (systemLang.toLowerCase().startsWith('ar')) {
    currentLang = 'ar';
}

function applyLanguage() {
    document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    // Translate inputs
    const usernameInput = document.getElementById('rating-username');
    if (usernameInput) usernameInput.placeholder = currentLang === 'ar' ? 'مثال: Notch' : 'e.g. Notch';

    const reviewInput = document.getElementById('rating-review');
    if (reviewInput) reviewInput.placeholder = currentLang === 'ar' ? 'ما رأيك في MafiaMC؟' : 'What do you love about MafiaMC?';
}

window.addEventListener('DOMContentLoaded', applyLanguage);
