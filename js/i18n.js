// Bilingual strings for Garden Planner BD. EN + বাংলা, persisted language choice.
(function (root) {
  'use strict';
  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  function toBnDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }
  function localizeNum(s, lang) {
    return lang === 'bn' ? toBnDigits(s) : String(s);
  }
  var STR = {
    en: {
      title: 'Garden Planner BD', tagline: 'Plan your home vegetable garden — beds, seasons and care in one place.',
      tabGarden: 'My Garden', tabCrops: 'Crops', tabCalendar: 'Calendar', tabCare: 'Care Log', tabData: 'Data',
      gardenH: 'My garden beds', gardenP: 'Tap a plot to plant or manage it. Each bed holds 24 plots.',
      statsPlanted: 'Planted', statsReady: 'Ready to harvest', statsGrowing: 'Growing', statsFree: 'Free plots',
      plantPicker: 'Plant in the selected plot', plantDate: 'Planting date', plantBtn: 'Plant here',
      noPlot: 'Tap an empty plot first, then pick a crop below.',
      occupied: 'This plot grows', plantedOn: 'Planted', harvestOn: 'Expected harvest', daysLeft: 'days left', readyNow: 'Ready to harvest!',
      harvestBtn: 'Mark harvested', clearBtn: 'Clear plot', cleared: 'Plot cleared.',
      plantedMsg: 'Planted!', harvestedMsg: 'Harvest recorded.',
      cropsH: 'Vegetable library', cropsP: '18 common Bangladeshi home-garden vegetables with sowing months and harvest time.',
      daysToHarvest: 'days to harvest', seasonRabi: 'Rabi (winter)', seasonKharif: 'Kharif (summer)', seasonYear: 'Year-round',
      sunFull: 'Full sun', sunPartial: 'Partial sun', waterLow: 'Low water', waterMedium: 'Medium water', waterHigh: 'High water',
      calH: 'What to sow', calP: 'Pick a month to see which vegetables can be sown in Bangladesh that month.',
      sowThisMonth: 'Sow this month', noneMonth: 'No crop from the library is normally sown this month.',
      monthNow: 'Current month', months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      careH: 'Care log', careP: 'Record watering, fertilizing, weeding and pest checks.',
      careType: 'Care type', careNote: 'Note (optional)', careAdd: 'Add entry', careEmpty: 'No care entries yet.',
      careWater: 'Watering', careFertilize: 'Fertilizing', careWeed: 'Weeding', carePest: 'Pest check',
      dataH: 'Your data', dataP: 'Everything is stored only in this browser. Export a backup file before clearing.',
      exportBtn: 'Export JSON', importBtn: 'Import JSON', eraseBtn: 'Erase all data', erasePrompt: 'Type DELETE to erase everything:',
      eraseDone: 'All data erased.', importOk: 'Import successful.', importBad: 'Import failed: file is not a valid Garden Planner backup.',
      errFuture: 'Date cannot be in the future.', errNoCrop: 'Pick a crop first.', errNoType: 'Pick a care type first.',
      harvestedH: 'Harvest history', harvestedEmpty: 'Nothing harvested yet.',
      disclaimer: 'A home-garden planning aid, not agricultural advice. Sowing months are typical for Bangladesh and vary with local weather.',
      langBtn: 'বাংলা'
    },
    bn: {
      title: 'গার্ডেন প্ল্যানার বিডি', tagline: 'আপনার বাড়ির সবজি বাগান পরিকল্পনা করুন — বেড, মৌসুম ও যত্ন এক জায়গায়।',
      tabGarden: 'আমার বাগান', tabCrops: 'ফসল', tabCalendar: 'ক্যালেন্ডার', tabCare: 'যত্ন লগ', tabData: 'ডেটা',
      gardenH: 'আমার বাগানের বেড', gardenP: 'রোপণ বা ব্যবস্থাপনার জন্য একটি প্লটে ট্যাপ করুন। প্রতিটি বেডে ২৪টি প্লট আছে।',
      statsPlanted: 'রোপিত', statsReady: 'কাটার সময়', statsGrowing: 'বাড়ছে', statsFree: 'খালি প্লট',
      plantPicker: 'নির্বাচিত প্লটে রোপণ করুন', plantDate: 'রোপণের তারিখ', plantBtn: 'এখানে রোপণ করুন',
      noPlot: 'প্রথমে একটি খালি প্লটে ট্যাপ করুন, তারপর নিচ থেকে ফসল বাছুন।',
      occupied: 'এই প্লটে বাড়ছে', plantedOn: 'রোপণ', harvestOn: 'আশা করা কাটা', daysLeft: 'দিন বাকি', readyNow: 'কাটার সময় হয়েছে!',
      harvestBtn: 'কাটা হয়েছে চিহ্নিত করুন', clearBtn: 'প্লট খালি করুন', cleared: 'প্লট খালি করা হয়েছে।',
      plantedMsg: 'রোপণ করা হয়েছে!', harvestedMsg: 'কাটা রেকর্ড করা হয়েছে।',
      cropsH: 'সবজি লাইব্রেরি', cropsP: 'বাংলাদেশের বাড়ির বাগানের ১৮টি সাধারণ সবজি, বপনের মাস ও কাটার সময়সহ।',
      daysToHarvest: 'দিনে কাটা যায়', seasonRabi: 'রবি (শীত)', seasonKharif: 'খরিফ (গ্রীষ্ম)', seasonYear: 'সারা বছর',
      sunFull: 'পূর্ণ রোদ', sunPartial: 'আংশিক রোদ', waterLow: 'কম পানি', waterMedium: 'মাঝারি পানি', waterHigh: 'বেশি পানি',
      calH: 'কী বুনবেন', calP: 'বাংলাদেশে ওই মাসে কোন সবজি বোনা যায় দেখতে একটি মাস বাছুন।',
      sowThisMonth: 'এই মাসে বুনুন', noneMonth: 'এই মাসে লাইব্রেরির কোনো ফসল সাধারণত বোনা হয় না।',
      monthNow: 'চলতি মাস', months: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
      careH: 'যত্ন লগ', careP: 'পানি দেওয়া, সার দেওয়া, আগাছা পরিষ্কার ও পোকা পরীক্ষা রেকর্ড করুন।',
      careType: 'যত্নের ধরন', careNote: 'নোট (ঐচ্ছিক)', careAdd: 'এন্ট্রি যোগ করুন', careEmpty: 'এখনো কোনো যত্ন এন্ট্রি নেই।',
      careWater: 'পানি দেওয়া', careFertilize: 'সার দেওয়া', careWeed: 'আগাছা পরিষ্কার', carePest: 'পোকা পরীক্ষা',
      dataH: 'আপনার ডেটা', dataP: 'সবকিছু শুধু এই ব্রাউজারে সংরক্ষিত হয়। মুছে ফেলার আগে ব্যাকআপ ফাইল এক্সপোর্ট করুন।',
      exportBtn: 'JSON এক্সপোর্ট', importBtn: 'JSON ইমপোর্ট', eraseBtn: 'সব ডেটা মুছুন', erasePrompt: 'সব মুছতে DELETE লিখুন:',
      eraseDone: 'সব ডেটা মুছে ফেলা হয়েছে।', importOk: 'ইমপোর্ট সফল হয়েছে।', importBad: 'ইমপোর্ট ব্যর্থ: ফাইলটি বৈধ গার্ডেন প্ল্যানার ব্যাকআপ নয়।',
      errFuture: 'তারিখ ভবিষ্যতের হতে পারবে না।', errNoCrop: 'প্রথমে একটি ফসল বাছুন।', errNoType: 'প্রথমে যত্নের ধরন বাছুন।',
      harvestedH: 'কাটার ইতিহাস', harvestedEmpty: 'এখনো কিছু কাটা হয়নি।',
      disclaimer: 'বাড়ির বাগান পরিকল্পনার সহায়ক, কৃষি পরামর্শ নয়। বপনের মাস বাংলাদেশের জন্য সাধারণ ধারণা, স্থানীয় আবহাওয়ায় ভিন্ন হতে পারে।',
      langBtn: 'English'
    }
  };
  var api = { STR: STR, toBnDigits: toBnDigits, localizeNum: localizeNum };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GardenI18n = api;
})(typeof window !== 'undefined' ? window : globalThis);
