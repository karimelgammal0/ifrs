/* DipIFRS — بيانات الريلز. كل ريل = مشهد تمثيلي. لإضافة ريل جديد: انسخ الكائن ده وعدّل عليه.
   لو عندك فيديو جاهز (من أي أداة ذكاء اصطناعي) حط الرابط في video:'reels/xxx.mp4' وهيتعرض بدل المشهد المتحرك.
   الـ beats بتتنفذ بالترتيب. المفاتيح المتاحة في كل beat:
     cam:'chief'|'two'|'wide'|'new'  camMs:مللي-ثانية      حركة الكاميرا (اسم من cams)
     mood:{chief:'read'}                                     تعبير الوجه
     say:'chief' + t:'النص المعروض' + v:'النص المنطوق'      حوار (الصوت بيشتغل لو الجهاز فيه صوت عربي)
     walk:[id, من, إلى, مللي-ثانية, 'exit'?]                  مشي الشخصية
     hand:true                                               المحاسب يسلّم التقرير
     slug:[سطور]  ms     عنوان المشهد   |  caption:'نص' ms   تعليق سردي
     fade:0..1  fadeMs   تعتيم/إظهار      |  wait:مللي-ثانية  انتظار
   التعبيرات: neutral read worried shock scheme stern smirk angry startled nervous sheepish */
(window.REELS=window.REELS||[]).push({
  id:'r01-integrity', ch:1, std:'IESBA Code of Ethics', tag:'الأخلاقيات',
  title:'ميزانية على المقاس', sub:'مبدأ النزاهة · Integrity', secs:60,
  cast:{
    chief:{name:'رئيس الحسابات',color:'#e0674f',skin:'#d6a07a',hair:'#17171c',suit:'#1d2740',pants:'#141b2e',shirt:'#eef1f5',tie:'#8d1f2e',glasses:true,age:'old',pocket:true,pitch:.78,rate:.95,look:-1},
    newbie:{name:'المحاسب الجديد',color:'#3fb6a0',skin:'#c48a63',hair:'#2b1b12',suit:'#566574',pants:'#3a4350',shirt:'#dbe7f3',tie:'#2f7f6e',held:true,hairStyle:'young',stubble:true,pitch:1.18,rate:1.02,look:1},
    ceo:{name:'رئيس مجلس الإدارة',color:'#e3b64b',darkChip:true,skin:'#deb08d',hair:'#b9bcc4',suit:'#0e0f13',pants:'#0e0f13',shirt:'#ffffff',tie:'#c19a2e',mustache:true,age:'old',pocket:true,pitch:.68,rate:.9,look:1}
  },
  stage:{chief:{x:530,y:520,s:1},newbie:{x:110,y:565,s:1.1},ceo:{x:110,y:565,s:1.1}},
  cams:{chief:[530,300,2.4],two:[432,330,1.1],wide:[432,320,1],new:[338,345,2.4]},
  beats:[
    {fade:1,fadeMs:0,cam:'chief',camMs:0,slug:['ليل — داخلي','مكتب رئيس الحسابات','برج في المنطقة الاقتصادية'],ms:2200},
    {fade:0,fadeMs:1100,mood:{chief:'read'},wait:1500},

    {walk:['newbie',110,338,2200],cam:'two',camMs:2200,mood:{newbie:'worried'}},
    {say:'newbie',t:'يا ريس، بيكلموني في البنك وبيقولوا لي الأصول مش كفاية إننا نقدر ناخد القرض.',v:'يا ريس، بيكلموني في البنك وبيقولوا لي الأصول مش كفاية إننا نقدر ناخد القرض',mood:{chief:'neutral'}},
    {say:'chief',t:'وريني كده.',v:'وريني كده'},
    {hand:true},

    {cam:'chief',camMs:1200,mood:{chief:'read'},wait:1500},
    {say:'chief',t:'عدّل لي المخزون… زوّده 10 مليون، وزوّد العملاء كمان 15، وقلّل لي الموردين شوية.',v:'عدّل لي المخزون، زوّده عشرة مليون، وزوّد العملاء كمان خمسة عشر، وقلّل لي الموردين شوية',mood:{chief:'scheme'}},

    {cam:'new',camMs:900,mood:{newbie:'shock'},wait:1100},
    {say:'newbie',t:'بس إحنا كده يا ريس بنقدّم بيانات غلط!',v:'بس إحنا كده يا ريس بنقدّم بيانات غلط',mood:{newbie:'worried'}},
    {cam:'chief',camMs:700},
    {say:'chief',t:'اعمل بس اللي بقولك عليه.',v:'اعمل بس اللي بقولك عليه',mood:{chief:'stern'}},
    {say:'chief',t:'عدّل الميزانية ووريها لي.',v:'عدّل الميزانية ووريها لي'},

    {cam:'two',camMs:900,mood:{newbie:'shock',chief:'read'},walk:['newbie',null,110,2000,'exit']},
    {cam:'chief',camMs:1000,mood:{chief:'smirk'},wait:1500},
    {mood:{chief:'read'},wait:700},

    {caption:'في نفس اللحظة… رئيس مجلس الإدارة كان يمر بالصدفة، وسمع الحوار.',ms:2300},
    {cam:'wide',camMs:1100,mood:{ceo:'angry'},walk:['ceo',110,338,1400]},
    {mood:{chief:'startled'},wait:700},
    {say:'ceo',t:'إيه اللي إنت قلته للمحاسب ده يا أستاذ؟!',v:'إيه اللي إنت قلته للمحاسب ده يا أستاذ',cam:'new',camMs:700},
    {cam:'chief',camMs:600,mood:{chief:'nervous'}},
    {say:'chief',t:'يا فندم، لو معملناش كده مش هنعرف ناخد القرض.',v:'يا فندم، لو معملناش كده مش هنعرف ناخد القرض'},
    {cam:'new',camMs:700,mood:{ceo:'stern'}},
    {say:'ceo',t:'بس دي مش طريقة نزيهة ناخد بيها قرض.',v:'بس دي مش طريقة نزيهة ناخد بيها قرض'},
    {say:'ceo',t:'في طرق تانية نقدر نعملها عشان نكبّر شغلنا.',v:'في طرق تانية نقدر نعملها عشان نكبّر شغلنا'},
    {cam:'chief',camMs:700,mood:{chief:'sheepish'}},
    {say:'chief',t:'تحت أمرك يا فندم… فعلاً أنا تجاوزت مبدأ النزاهة،',v:'تحت أمرك يا فندم، فعلاً أنا تجاوزت مبدأ النزاهة'},
    {say:'chief',t:'وهبقى أراعي ده بعد كده.',v:'وهبقى أراعي ده بعد كده'},
    {wait:1000}
  ],
  /* لو الفيديوهات الحقيقية موجودة في reels/r01/ بيتشغّل التبويب بيها (بصوتها)، ولو مش موجودة بيرجع للمشهد المتحرك.
     trim = ثانية القطع (اختياري) عشان تقصّ الكليب لو أطول من اللازم. */
  shots:[
    {video:'reels/r01/s01.mp4',trim:4},
    {video:'reels/r01/s02.mp4',who:'newbie',t:'يا ريس، بيكلموني في البنك وبيقولوا لي الأصول مش كفاية إننا نقدر ناخد القرض.',trim:7},
    {video:'reels/r01/s03.mp4',who:'chief',t:'وريني كده.',trim:4},
    {video:'reels/r01/s04.mp4',who:'chief',t:'عدّل لي المخزون… زوّده 10 مليون، وزوّد العملاء كمان 15، وقلّل لي الموردين شوية.',trim:7},
    {video:'reels/r01/s05.mp4',who:'newbie',t:'بس إحنا كده يا ريس بنقدّم بيانات غلط!',trim:5},
    {video:'reels/r01/s06.mp4',who:'chief',t:'اعمل بس اللي بقولك عليه… عدّل الميزانية ووريها لي.',trim:5},
    {video:'reels/r01/s07.mp4',trim:4},
    {video:'reels/r01/s08.mp4',who:'ceo',t:'إيه اللي إنت قلته للمحاسب ده يا أستاذ؟!',trim:6},
    {video:'reels/r01/s09.mp4',who:'chief',t:'يا فندم، لو معملناش كده مش هنعرف ناخد القرض.',trim:4},
    {video:'reels/r01/s10.mp4',who:'ceo',t:'بس دي مش طريقة نزيهة ناخد بيها قرض. في طرق تانية نقدر نعملها عشان نكبّر شغلنا.',trim:7},
    {video:'reels/r01/s11.mp4',who:'chief',t:'تحت أمرك يا فندم… فعلاً أنا تجاوزت مبدأ النزاهة، وهبقى أراعي ده بعد كده.',trim:6}
  ],
  lesson:{
    k:'المبدأ اللي اتكسر في المشهد',
    big:'النزاهة',en:'Integrity',
    def:'تتعامل بصراحة وأمانة في كل علاقاتك المهنية والتجارية.',defEn:'Be straightforward and honest in all professional and business relationships.',
    hit:0,
    five:['Integrity','Objectivity','Professional competence & due care','Confidentiality','Professional behaviour'],
    pts:[
      'زوّد المخزون والعملاء وقلّل الموردين عشان البنك يوافق = قوائم مالية مضللة.',
      'الارتباط بمعلومات مضللة يُعد إخلالاً بالنزاهة — وأمر المدير مش عذر.'
    ]
  }
});
