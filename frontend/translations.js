const translations = {
    en: {
        // Home / Hero
        title: "National Missing Persons Identification System",
        subtitle: "Ethiopian Federal Police Commission",
        tagline: "A unified AI-powered platform for reporting, searching, and finding missing individuals across Ethiopia.",
        btn_report: "Report Missing Person",
        btn_search: "Search Database",
        search_title: "Search National Registry",
        search_name: "Name / ID",
        search_name_ph: "Search by full name or ID...",
        search_region: "Region",
        search_city: "City / Zone",
        search_age: "Age",
        stat_active_label: "Active Cases",
        stat_found_label: "Persons Found",
        stat_ai_label: "AI-Powered Matching",

        // How it works
        step1_title: "1. File Police Report",
        step1_desc: "Mandatory reporting to EFP or Local Police. Obtain official case number.",
        step2_title: "2. Official Submission",
        step2_desc: "Digitize case details for 'Declaration of Absence' legal processes.",
        step3_title: "3. AI Matching",
        step3_desc: "Automated face recognition cross-referenced against the national sightings database.",

        // Dashboard
        section_active: "Active Cases",
        search_placeholder: "Search name...",
        status_all: "All Statuses",
        status_missing: "Missing",
        status_found: "Found",
        loading: "Loading cases...",
        no_records: "No records found.",
        nav_report: "Report / Upload",

        // Person Card
        age_label: "Age",
        gender_label: "Gender",
        last_seen_label: "Last Seen",
        date_label: "Date",
        btn_view_case: "View Profile",
        btn_found: "Found!",
        btn_back_home: "Back to Home",
        btn_emergency: "Emergency: 991",

        // Case Profile
        classification_label: "Classification",
        height_label: "Height",
        weight_label: "Weight",
        eye_color_label: "Eye Color",
        hair_color_label: "Hair Color",
        race_label: "Race / Ethnicity",
        case_number_label: "Police Case #",
        police_district_label: "Police District",
        vehicle_label: "Vehicle Info",
        social_label: "Social Media",
        physical_desc_title: "Physical Description",
        marks_label: "Distinguishing Marks",
        additional_info_title: "Additional Information",
        tip_title: "Send a Tip or Provide Update",
        tip_desc: "Do you have information about this person? Your tip is sent directly to the investigating agency.",
        tip_placeholder: "Describe what you saw, when, and where...",
        tip_submit: "Submit Tip to Police",
        tip_emergency: "* In emergencies, always dial 991 or your local emergency number immediately.",

        // Auth
        login_title: "Login",
        email: "Email",
        password: "Password",
        register: "Register",
        no_account: "Don't have an account?",
        forgot_password: "Forgot Password?",
        already_account: "Already have an account?",
        full_name: "Full Name",
        phone: "Phone Number",
        confirm_password: "Confirm Password",
        dashboard: "Dashboard",
        logout: "Logout",
        reset_password: "Reset Password",
        send_link: "Send Reset Link",
        notifications: "Notifications",

        // Genders
        male: "Male",
        female: "Female",

        // Report form
        report_page_title: "Official Missing Person Report",
        report_step1: "Step 1: Legal Requirement",
        report_step2: "Step 2: Police Record Data",
        report_step3: "Step 3: Last Known Location",
        report_step4: "Step 4: Subject Identification",
        report_step5: "Step 5: Vehicle & Digital Data",
        report_step6: "Step 6: Biometric Data",
        report_step7: "Step 7: Reporter Info",
        report_submit: "Submit to National Registry",

        // Footer
        footer_efp: "Ethiopian Federal Police",
        footer_desc: "Ensuring peace and security through professional service and community partnership.",
        footer_emergency: "Emergency",
        footer_links: "Quick Links",
    },

    am: {
        // Home / Hero
        title: "ብሔራዊ የጠፉ ሰዎች መለያ ስርዓት",
        subtitle: "የኢትዮጵያ ፌዴራል ፖሊስ ኮሚሽን",
        tagline: "ምርመራዎችን በሰው ሰራሽ አስተውሎት (AI) ያዘምናል — ጠፊ ሰዎችን ለሪፖርት ማቅረብ፣ ለመፈለግ እና ለማግኘት የተዋሃደ መድረክ።",
        btn_report: "የጠፋ ሰው ሪፖርት ያድርጉ",
        btn_search: "መረጃ ቋት ይፈልጉ",
        search_title: "ብሔራዊ መዝገብ ይፈልጉ",
        search_name: "ስም / መታወቂያ",
        search_name_ph: "በሙሉ ስም ወይም መታወቂያ ይፈልጉ...",
        search_region: "ክልል",
        search_city: "ከተማ / ዞን",
        search_age: "እድሜ",
        stat_active_label: "ንቁ ጉዳዮች",
        stat_found_label: "የተገኙ ሰዎች",
        stat_ai_label: "AI-ድጋፍ ማዛዘን",

        // How it works
        step1_title: "1. የፖሊስ ሪፖርት ያቅርቡ",
        step1_desc: "ለፌዴራል ወይም ለአካባቢ ፖሊስ ሪፖርት ማድረግ ግዴታ ነው። ይፋዊ የክስ ቁጥር ይያዙ።",
        step2_title: "2. ይፋዊ ምዝገባ",
        step2_desc: "ለህጋዊ 'የመጥፋት ማረጋገጫ' ሂደቶች ዝርዝሮችን ዲጂታል ያድርጉ።",
        step3_title: "3. በ AI ማመሳከር",
        step3_desc: "ከብሔራዊ የመረጃ ቋት ጋር ያለ ቆሙ የፊት ለይቶ ማወቂያ ማመሳከር።",

        // Dashboard
        section_active: "ንቁ ጉዳዮች",
        search_placeholder: "ስም ይፈልጉ...",
        status_all: "ሁሉም ሁኔታዎች",
        status_missing: "ጠፍቷል",
        status_found: "ተገኝቷል",
        loading: "ጉዳዮችን በመጫን ላይ...",
        no_records: "ምንም መዝገብ አልተገኘም።",
        nav_report: "ሪፖርት / ስቀል",

        // Person Card
        age_label: "እድሜ",
        gender_label: "ጾታ",
        last_seen_label: "መጨረሻ የታዩበት",
        date_label: "ቀን",
        btn_view_case: "ፕሮፋይል ይመልከቱ",
        btn_found: "አገኘሁ!",
        btn_back_home: "ወደ ዋናው ይመለሱ",
        btn_emergency: "አስቸኳይ ጥሪ: 991",

        // Case Profile
        classification_label: "ምደባ",
        height_label: "ቁመት",
        weight_label: "ክብደት",
        eye_color_label: "የዓይን ቀለም",
        hair_color_label: "የፀጉር ቀለም",
        race_label: "ዘር / ብሔር",
        case_number_label: "የፖሊስ ጉዳይ #",
        police_district_label: "የፖሊስ ዞን",
        vehicle_label: "ተሽከርካሪ መረጃ",
        social_label: "ማህበራዊ ሚዲያ",
        physical_desc_title: "አካላዊ ገለጻ",
        marks_label: "የሚለዩ ምልክቶች",
        additional_info_title: "ተጨማሪ መረጃ",
        tip_title: "ፍንጭ ይላኩ ወይም መረጃ ያቅርቡ",
        tip_desc: "ስለዚህ ሰው መረጃ አለዎት? ፍንጭዎ ቀጥታ ለምርመራ አካሉ ይላካል።",
        tip_placeholder: "ያዩትን፣ መቼ እና የት እንደሆነ ይግለጹ...",
        tip_submit: "ፍንጭ ለፖሊስ ያስገቡ",
        tip_emergency: "* በአስቸኳይ ሁኔታ ሁልጊዜ 991 ወይም የአካባቢዎን አስቸኳይ ቁጥር ይደውሉ።",

        // Auth
        login_title: "ግባ",
        email: "ኢሜይል",
        password: "የይለፍ ቃል",
        register: "ይመዝገቡ",
        no_account: "መለያ የለዎትም?",
        forgot_password: "የይለፍ ቃል ረሱ?",
        already_account: "መለያ አለዎት?",
        full_name: "ሙሉ ስም",
        phone: "ስልክ ቁጥር",
        confirm_password: "የይለፍ ቃል ያረጋግጡ",
        dashboard: "ዳሽቦርድ",
        logout: "ውጣ",
        reset_password: "የይለፍ ቃል ከባተ",
        send_link: "የመቀየሪያ ሊንክ ላክ",
        notifications: "ማስታወቂያዎች",

        // Genders
        male: "ወንድ",
        female: "ሴት",

        // Report form
        report_page_title: "ይፋዊ የጠፋ ሰው ሪፖርት ማቅረቢያ",
        report_step1: "ደረጃ 1: ህጋዊ ግዴታ",
        report_step2: "ደረጃ 2: የፖሊስ መዝገብ ዝርዝር",
        report_step3: "ደረጃ 3: የመጨረሻ ቦታ",
        report_step4: "ደረጃ 4: የግለሰቡ መለያ",
        report_step5: "ደረጃ 5: ተሽከርካሪ እና ዲጂታል",
        report_step6: "ደረጃ 6: ፎቶ እና ባዮሜትሪክ",
        report_step7: "ደረጃ 7: ሪፖርት አቅራቢ መረጃ",
        report_submit: "ወደ ብሔራዊ መዝገብ አስገባ",

        // Footer
        footer_efp: "የኢትዮጵያ ፌዴራል ፖሊስ",
        footer_desc: "በሙያዊ አገልግሎት እና በህብረተሰብ ተሳትፎ ሰላም እና ደህንነትን ማረጋገጥ።",
        footer_emergency: "አስቸኳይ ጥሪ",
        footer_links: "ፈጣን አገናኞች",
    }
};

function changeLanguage(lang) {
    // Only allow en and am
    if (lang !== 'en' && lang !== 'am') lang = 'en';

    document.documentElement.lang = lang;
    const t = translations[lang] || translations['en'];

    // Update all data-key elements
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key] !== undefined) {
            const icon = el.querySelector('i');
            if (icon) {
                const text = document.createTextNode(' ' + t[key]);
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(text);
            } else if (el.tagName === 'INPUT') {
                el.placeholder = t[key];
            } else {
                el.innerText = t[key];
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-placeholder-key]').forEach(el => {
        const key = el.getAttribute('data-placeholder-key');
        if (t[key]) el.placeholder = t[key];
    });

    localStorage.setItem('preferredLanguage', lang);
}

// Auto-apply on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = savedLang;
        selector.onchange = (e) => changeLanguage(e.target.value);
        changeLanguage(savedLang);
    }
});
