/* What Should I - native category data (drink / travel / gift / go) */
var WSI_CATS = [
  {id:'wear',  name:'Wear',   sub:'Your closet, styled',      iframe:true,
   icon:'<path d="M9 3a3 3 0 0 0 6 0l4.6 2.6a1 1 0 0 1 .5 1.1l-1.3 3.1a1 1 0 0 1-1.3.6L16 9.7V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9.7l-1.5.7a1 1 0 0 1-1.3-.6L3.9 6.7a1 1 0 0 1 .5-1.1L9 3z"/>'},
  {id:'eat',   name:'Eat',    sub:'Meals and groceries',      iframe:true,
   icon:'<path d="M6 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/><path d="M8 3v18"/><path d="M17 3c-1.7 1.5-2.5 3.8-2.5 6.5 0 2 .8 3.5 2.5 3.5V21"/>'},
  {id:'watch', name:'Watch',  sub:'Tonight\u2019s pick',       iframe:true,
   icon:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/>'},
  {id:'drink', name:'Drink',  sub:'What\u2019s in your glass', q:'What should I drink?',
   icon:'<path d="M5 3h14l-1.5 8a5.5 5.5 0 0 1-11 0L5 3z"/><path d="M12 16v5"/><path d="M8.5 21h7"/>'},
  {id:'travel',name:'Travel', sub:'Where to next',            q:'Where should I travel?',
   icon:'<path d="M10.5 20.5L3 17l7.5-3.5V5a1.5 1.5 0 0 1 3 0v8.5L21 17l-7.5 3.5z"/><path d="M6 21h12"/>'},
  {id:'gift',  name:'Gift',   sub:'Presents that land',       q:'What should I gift?',
   icon:'<rect x="4" y="9" width="16" height="12" rx="2"/><path d="M12 9v12"/><path d="M4 13h16"/><path d="M12 9c-4 0-5.5-1.5-5.5-3.5S9 3 10.5 4 12 9 12 9zm0 0c4 0 5.5-1.5 5.5-3.5S15 3 13.5 4 12 9 12 9z"/>'},
  {id:'go',    name:'Go out', sub:'Tonight, sorted',          q:'Where should I go tonight?',
   icon:'<path d="M12 21s-6.5-5.3-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.7-6.5 10-6.5 10z"/><circle cx="12" cy="11" r="2.3"/>'}
];

var WSI_DATA = {
  drink: {
    prefs: [
      {key:'base', label:'Your usual base', opts:['Coffee','Tea','Fresh juice','Smoothie','Sparkling']},
      {key:'mood', label:'Right now you want', opts:['A boost','Something calm','Something cold','A treat']}
    ],
    items: [
      {n:'Flat white', t:['Coffee','A boost']},{n:'Iced Americano', t:['Coffee','A boost','Something cold']},
      {n:'Spanish latte', t:['Coffee','A treat']},{n:'Cold brew tonic', t:['Coffee','Something cold','A boost']},
      {n:'Karak chai', t:['Tea','A boost']},{n:'Masala chai', t:['Tea','Something calm']},
      {n:'Moroccan mint tea', t:['Tea','Something calm']},{n:'Iced hibiscus tea', t:['Tea','Something cold']},
      {n:'Matcha latte', t:['Tea','A boost','A treat']},{n:'Fresh orange juice', t:['Fresh juice','A boost']},
      {n:'Watermelon cooler', t:['Fresh juice','Something cold']},{n:'Mint lemonade', t:['Fresh juice','Something cold']},
      {n:'Pomegranate spritzer', t:['Fresh juice','A treat','Something cold']},
      {n:'Mango lassi', t:['Smoothie','A treat']},{n:'Banana date smoothie', t:['Smoothie','A boost']},
      {n:'Berry yogurt smoothie', t:['Smoothie','A treat']},{n:'Avocado shake', t:['Smoothie','A treat']},
      {n:'Coconut water, chilled', t:['Sparkling','Something cold','Something calm']},
      {n:'Sparkling water with lime', t:['Sparkling','Something calm']},
      {n:'Ginger fizz mocktail', t:['Sparkling','A treat','Something cold']},
      {n:'Cucumber mint sparkler', t:['Sparkling','Something cold','Something calm']},
      {n:'Turmeric golden milk', t:['Tea','Something calm','A treat']}
    ],
    days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  },
  travel: {
    prefs: [
      {key:'vibe', label:'Your kind of escape', opts:['Beach','Mountains','City break','Desert','Culture']},
      {key:'len', label:'Usual trip length', opts:['Weekend','Long weekend','A full week']}
    ],
    items: [
      {n:'Hatta - kayaking and mountain air', t:['Mountains','Weekend']},
      {n:'Fujairah - quiet beaches on the east coast', t:['Beach','Weekend']},
      {n:'Jebel Jais - zipline and the highest peak', t:['Mountains','Weekend']},
      {n:'Al Ain - oases, forts and the zoo', t:['Culture','Weekend']},
      {n:'Liwa - empty-quarter dunes at sunset', t:['Desert','Weekend']},
      {n:'Musandam - dhow day through the fjords', t:['Beach','Weekend','Mountains']},
      {n:'Sharjah - art district and heritage area', t:['Culture','Weekend','City break']},
      {n:'Umm Al Quwain - mangroves by kayak', t:['Beach','Weekend']},
      {n:'Georgia (Tbilisi) - old town and wine country', t:['City break','Culture','Long weekend','A full week']},
      {n:'Oman (Muscat) - wadis, forts, coastline', t:['Culture','Beach','Long weekend','A full week']},
      {n:'Maldives - overwater reset', t:['Beach','A full week']},
      {n:'Georgia (Kazbegi) - Caucasus views', t:['Mountains','Long weekend','A full week']},
      {n:'Istanbul - two continents, endless food', t:['City break','Culture','Long weekend','A full week']},
      {n:'Salalah - monsoon-green mountains', t:['Mountains','Beach','A full week']},
      {n:'Wadi Rum - desert night under stars', t:['Desert','Long weekend','A full week']},
      {n:'Cappadocia - balloons over fairy chimneys', t:['Desert','Culture','A full week']}
    ],
    days:['This weekend','Next weekend','+2 weeks','+3 weeks','+4 weeks','+5 weeks','+6 weeks']
  },
  gift: {
    prefs: [
      {key:'who', label:'Who is it for', opts:['Partner','Family','Close friend','Colleague']},
      {key:'occ', label:'The occasion', opts:['Birthday','Anniversary','Thank you','Just because']}
    ],
    items: [
      {n:'Handwritten letter plus their favorite chocolates', t:['Partner','Anniversary','Just because']},
      {n:'A framed photo of a shared memory', t:['Partner','Family','Close friend','Anniversary','Birthday']},
      {n:'Spa or massage voucher', t:['Partner','Family','Birthday','Thank you']},
      {n:'A plant in a nice pot', t:['Colleague','Family','Just because','Thank you']},
      {n:'Book you loved, with a note inside the cover', t:['Close friend','Partner','Just because','Birthday']},
      {n:'Cooking-class-for-two voucher', t:['Partner','Anniversary','Birthday']},
      {n:'Quality coffee or karak kit', t:['Colleague','Close friend','Thank you','Just because']},
      {n:'Personalized mug or desk item', t:['Colleague','Birthday','Thank you']},
      {n:'Dinner at the place they keep mentioning', t:['Partner','Family','Close friend','Anniversary','Birthday']},
      {n:'A curated snack box', t:['Colleague','Close friend','Thank you','Just because']},
      {n:'Polaroid-style mini photo album', t:['Partner','Close friend','Anniversary','Birthday']},
      {n:'Streaming or audiobook subscription', t:['Family','Close friend','Colleague','Birthday']},
      {n:'A board game for your group', t:['Close friend','Family','Just because']},
      {n:'Scented candle and bath set', t:['Family','Partner','Thank you','Birthday']},
      {n:'Their favorite dessert, delivered', t:['Partner','Family','Close friend','Colleague','Just because','Thank you']},
      {n:'A day trip you plan end to end', t:['Partner','Anniversary','Birthday']}
    ],
    days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  },
  go: {
    prefs: [
      {key:'vibe', label:'Tonight\u2019s vibe', opts:['Chill','Outdoors','Food crawl','Culture','Active']},
      {key:'crew', label:'Who\u2019s coming', opts:['Solo','Two of us','The crew']}
    ],
    items: [
      {n:'Sunset walk at Kite Beach, karak after', t:['Chill','Outdoors','Solo','Two of us','The crew']},
      {n:'Alserkal Avenue - galleries and a late coffee', t:['Culture','Chill','Solo','Two of us']},
      {n:'Old Dubai by abra - creek crossing and souks', t:['Culture','Food crawl','Two of us','The crew']},
      {n:'Global Village - graze the pavilions', t:['Food crawl','The crew','Two of us']},
      {n:'Mushrif Park night cycling', t:['Active','Outdoors','Solo','The crew']},
      {n:'Board games and mocktails at a cafe', t:['Chill','Two of us','The crew']},
      {n:'Drive to Hatta for the cooler evening air', t:['Outdoors','Chill','Two of us','The crew']},
      {n:'Ripe market wander, dessert to finish', t:['Chill','Food crawl','Two of us']},
      {n:'Sunset at The Pointe, palm view', t:['Chill','Outdoors','Two of us']},
      {n:'Late-night shawarma run through Satwa', t:['Food crawl','The crew','Solo']},
      {n:'Museum of the Future, evening slot', t:['Culture','Two of us','Solo']},
      {n:'Desert stargazing drive past Al Qudra', t:['Outdoors','Chill','Two of us','The crew']},
      {n:'Padel or bowling with the crew', t:['Active','The crew']},
      {n:'Rooftop cinema if one\u2019s screening', t:['Chill','Culture','Two of us']},
      {n:'Dhow cruise dinner along the marina', t:['Chill','Two of us','The crew']},
      {n:'Night swim and beach barbecue', t:['Active','Outdoors','The crew']}
    ],
    days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  }
};
