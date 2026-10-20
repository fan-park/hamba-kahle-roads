/* Hamba Kahle Roads — built-in route guides.
   General road knowledge for popular long-distance trips and daily commutes, written once and shown for free.
   Live driver reports on each route's roads are added on top by app.js.
   Last checked: October 2026. Review these every few months: plazas, closures and road layouts change.

   Each guide is written in one direction (from a → b). The site reverses it automatically
   when someone drives the other way. Leg names must use the form "X to Y". */

window.HKR_PLACES = {
  joburg:      ["johannesburg", "joburg", "jozi", "jhb", "egoli", "randburg", "midrand", "or tambo", "or tambo airport", "northcliff", "melville", "parktown"],
  jhbcbd:      ["johannesburg cbd", "joburg cbd", "jhb cbd", "johannesburg city", "braamfontein", "marshalltown", "newtown", "maboneng"],
  sandton:     ["sandton", "rosebank", "sandton city", "bryanston", "morningside", "sunninghill", "woodmead", "illovo"],
  soweto:      ["soweto", "orlando", "diepkloof", "meadowlands", "dobsonville", "protea glen", "jabulani", "pimville", "naledi", "zola"],
  eastrand:    ["east rand", "ekurhuleni", "boksburg", "benoni", "kempton park", "germiston", "edenvale", "alberton", "brakpan", "springs", "bedfordview", "tembisa"],
  westrand:    ["west rand", "roodepoort", "krugersdorp", "mogale city", "florida", "randfontein", "honeydew", "constantia kloof", "weltevreden park"],
  pretoria:    ["pretoria", "tshwane", "pta", "menlyn", "hatfield", "brooklyn", "lynnwood", "pretoria east"],
  centurion:   ["centurion", "irene", "midstream", "lyttelton", "highveld", "eldoraigne", "olievenhoutbosch"],
  ptacbd:      ["pretoria cbd", "pretoria central", "pretoria city", "arcadia", "sunnyside", "union buildings", "salvokop"],
  durban:      ["durban", "dbn", "ethekwini"],
  dbncbd:      ["durban cbd", "durban central", "durban city", "durban city centre", "berea", "morningside durban", "glenwood", "point waterfront"],
  umhlanga:    ["umhlanga", "umhlanga rocks", "umhlanga ridge", "la lucia", "gateway", "mount edgecombe", "durban north", "sibaya"],
  pinetown:    ["pinetown", "westville", "new germany", "kloof", "hillcrest", "gillitts", "queensburgh", "cowies hill"],
  umlazi:      ["umlazi", "isipingo", "lamontville", "prospecton", "chatsworth"],
  pmb:         ["pietermaritzburg", "pmb", "maritzburg", "msunduzi", "hilton", "howick", "camperdown", "cato ridge"],
  capetown:    ["cape town", "ct", "kaapstad", "cape town cbd", "cape town city centre", "city bowl", "sea point", "green point", "camps bay", "tamboerskloof", "gardens", "cape town city", "foreshore", "woodstock", "v&a waterfront", "waterfront"],
  ctairport:   ["cape town airport", "cape town international", "cape town international airport", "cpt", "ct airport"],
  bellville:   ["bellville", "durbanville", "brackenfell", "kuils river", "parow", "goodwood", "tyger valley", "northern suburbs", "kraaifontein", "edgemead", "plattekloof"],
  southern:    ["southern suburbs", "claremont", "rondebosch", "newlands", "wynberg", "constantia", "tokai", "kenilworth", "bergvliet", "plumstead", "observatory", "muizenberg", "retreat"],
  khayelitsha: ["khayelitsha", "mitchells plain", "mitchell's plain", "philippi", "gugulethu", "nyanga", "blue downs", "delft"],
  tableview:   ["table view", "blouberg", "bloubergstrand", "milnerton", "parklands", "sunningdale", "big bay", "melkbosstrand", "west beach"],
  bloem:       ["bloemfontein", "bloem", "mangaung"],
  polokwane:   ["polokwane", "pietersburg", "mokopane"],
  kruger:      ["kruger", "kruger park", "kruger national park", "malelane", "malalane", "mbombela", "nelspruit", "komatipoort", "hazyview", "white river", "skukuza", "marloth park", "crocodile bridge"],
  panorama:    ["dullstroom", "graskop", "sabie", "panorama route", "lydenburg", "mashishing", "pilgrim's rest", "pilgrims rest", "blyde river canyon", "god's window"],
  suncity:     ["sun city", "pilanesberg", "rustenburg", "hartbeespoort", "harties"],
  gqeberha:    ["gqeberha", "port elizabeth", "pe", "nelson mandela bay", "kariega", "uitenhage"],
  drakensberg: ["drakensberg", "berg", "champagne valley", "winterton", "bergville", "central berg", "cathedral peak", "royal natal", "underberg"],
  ballito:     ["ballito", "salt rock", "umhlali", "north coast", "kwadukuza", "stanger", "zimbali", "king shaka airport", "king shaka"],
  southcoast:  ["margate", "south coast", "port edward", "port shepstone", "shelly beach", "scottburgh", "uvongo", "ramsgate", "southbroom", "hibberdene", "umkomaas", "amanzimtoti"],
  eastlondon:  ["east london", "el", "buffalo city", "gonubie"],
  gardenroute: ["garden route", "knysna", "george", "wilderness", "plettenberg bay", "plett", "mossel bay", "sedgefield"],
  hermanus:    ["hermanus", "overberg", "kleinmond", "stanford", "gansbaai"],
  stellenbosch:["stellenbosch", "stellies", "winelands", "somerset west"],
  langebaan:   ["langebaan", "west coast", "west coast national park", "saldanha", "paternoster", "velddrif", "yzerfontein", "jacobsbaai"],
  dundee:      ["dundee", "glencoe", "dannhauser", "wasbank"],
  nqutu:       ["nqutu", "isandlwana", "nondweni"],
  stlucia:     ["st lucia", "saint lucia", "st. lucia", "mtubatuba", "isimangaliso", "cape vidal", "hluhluwe", "elephant coast"]
};

/* Suburbs and areas inside a bigger city. A trip from a suburb uses the city's guide
   when there's no guide for the suburb itself (e.g. Soweto to Durban uses Johannesburg to Durban). */
window.HKR_PLACE_PARENT = {
  jhbcbd: "joburg", sandton: "joburg", soweto: "joburg", eastrand: "joburg", westrand: "joburg",
  centurion: "pretoria", ptacbd: "pretoria",
  dbncbd: "durban", umhlanga: "durban", pinetown: "durban", umlazi: "durban",
  bellville: "capetown", southern: "capetown", khayelitsha: "capetown", tableview: "capetown"
};

/* How each place is shown in the typing suggestions. */
window.HKR_PLACE_LABELS = {
  joburg: "Johannesburg", jhbcbd: "Johannesburg CBD", sandton: "Sandton", soweto: "Soweto", eastrand: "East Rand", westrand: "West Rand",
  pretoria: "Pretoria", centurion: "Centurion", ptacbd: "Pretoria CBD",
  durban: "Durban", dbncbd: "Durban CBD", umhlanga: "Umhlanga", pinetown: "Pinetown", umlazi: "Umlazi", pmb: "Pietermaritzburg",
  capetown: "Cape Town", ctairport: "Cape Town Airport", bellville: "Bellville", southern: "Southern Suburbs",
  khayelitsha: "Khayelitsha & Mitchells Plain", tableview: "Table View",
  bloem: "Bloemfontein", polokwane: "Polokwane", kruger: "Kruger Park (Malelane)", panorama: "Dullstroom & Graskop", suncity: "Sun City",
  gqeberha: "Gqeberha (Port Elizabeth)", drakensberg: "Drakensberg", ballito: "Ballito", southcoast: "South Coast (Margate)",
  eastlondon: "East London", gardenroute: "Garden Route (Knysna)", hermanus: "Hermanus", stellenbosch: "Stellenbosch", langebaan: "Langebaan (West Coast)",
  dundee: "Dundee", nqutu: "Nqutu", stlucia: "St Lucia"
};

window.HKR_ROUTES = [
/* 1 */ {
  id: "durban-joburg", a: ["durban"], b: ["joburg", "pretoria"],
  title: "Durban to Johannesburg", route: "N3 via Pietermaritzburg, Harrismith and Heidelberg", distanceKm: 570, driveTime: "6–7 hours",
  roads: ["N3"], places: ["Pinetown", "Pietermaritzburg", "Howick", "Mooi River", "Estcourt", "Ladysmith", "Van Reenen", "Harrismith", "Villiers", "Heidelberg"],
  summary: "The N3 toll route: steep climbs out of Durban, Van Reenen's Pass into the Free State, then a long, fast run to Gauteng.",
  before: [
    "Have a card or cash ready for five mainline toll plazas.",
    "Save the N3 Helpline: 0800 63 43 57 (24 hours).",
    "Try to cross Van Reenen's Pass in daylight; mist is common.",
    "Check @N3Route on X for closures before you leave, especially on holiday weekends.",
    "Plan a break at Harrismith, roughly halfway."
  ],
  legs: [
    { name: "Durban to Pietermaritzburg", items: [
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "First mainline plaza, near Pinetown. Queues build on Friday afternoons and before long weekends." },
      { kind: "hazard", title: "Steep hills around Pinetown", detail: "Loaded trucks crawl uphill and brake hard going down. Keep a big gap and don't sit beside them." },
      { kind: "lane", title: "Pietermaritzburg bypass", detail: "The N3 skirts the city with several exits close together. Stay in the through lanes unless you're stopping." }
    ]},
    { name: "Pietermaritzburg to Ladysmith", items: [
      { kind: "hazard", title: "Town Hill", detail: "Long, steep hill between Pietermaritzburg and Hilton/Howick. Slow trucks, and often misty early in the morning." },
      { kind: "toll", title: "Mooi Toll Plaza", detail: "Mainline plaza near Mooi River. The Mooi River off-ramps are tolled too." },
      { kind: "fuel", title: "Stops at Mooi River and Estcourt", detail: "Large 24-hour fuel and food stops. A good break before the pass." },
      { kind: "toll", title: "Tugela Toll Plaza", detail: "Mainline plaza near Ladysmith." }
    ]},
    { name: "Ladysmith to Harrismith", items: [
      { kind: "hazard", title: "Van Reenen's Pass", detail: "Steep, winding pass between KwaZulu-Natal and the Free State, and a major truck route. Expect slow trucks and breakdowns; stay patient and don't tailgate." },
      { kind: "weather", title: "Mist, and snow in winter", detail: "Thick mist is common on the pass. Snow can close it on cold winter days. Check @N3Route before you set off." },
      { kind: "safety", title: "Stuck on the pass?", detail: "Call the N3 Helpline rather than walking along the road. Switch on hazards and stay behind the barrier if you can." },
      { kind: "fuel", title: "Harrismith", detail: "Big 24-hour fuel and food stops just off the N3. Roughly halfway." }
    ]},
    { name: "Harrismith to Johannesburg", items: [
      { kind: "toll", title: "Wilge Toll Plaza", detail: "Mainline plaza on the Free State stretch between Harrismith and Villiers." },
      { kind: "hazard", title: "Long, straight Free State roads", detail: "Fatigue is the main risk here. Swap drivers or stop if you feel drowsy." },
      { kind: "toll", title: "De Hoek Toll Plaza", detail: "The last plaza, just before Heidelberg. After Heidelberg the N3 is toll-free." },
      { kind: "lane", title: "Joburg end", detail: "Traffic builds around Alberton and Germiston. Know whether you need the N12, N17, R24 to OR Tambo, or Buccleuch before you get there." }
    ]}
  ]
},
/* 2 */ {
  id: "joburg-capetown", a: ["joburg", "pretoria"], b: ["capetown"],
  title: "Johannesburg to Cape Town", route: "N1 via Bloemfontein, Colesberg and Beaufort West", distanceKm: 1400, driveTime: "14–16 hours",
  roads: ["N1"], places: ["Grasmere", "Parys", "Kroonstad", "Winburg", "Bloemfontein", "Colesberg", "Hanover", "Richmond", "Three Sisters", "Beaufort West", "Laingsburg", "Touws River", "De Doorns", "Worcester", "Paarl"],
  summary: "About 1,400 km on the N1 through the Free State and Karoo. Most people split it over two days or start very early with two drivers.",
  before: [
    "Have a card or cash ready for four toll plazas: Grasmere, Vaal, Verkeerdevlei and the Huguenot Tunnel.",
    "Plan fuel stops; towns in the Karoo are far apart.",
    "Consider an overnight stop in Colesberg or Beaufort West.",
    "Check all tyres, including the spare.",
    "Pack water and snacks for the long empty stretches."
  ],
  legs: [
    { name: "Johannesburg to Bloemfontein", items: [
      { kind: "toll", title: "Grasmere Toll Plaza", detail: "South of Joburg, near Ennerdale." },
      { kind: "toll", title: "Vaal Toll Plaza", detail: "Near Parys, just before the Vaal River." },
      { kind: "fuel", title: "Kroonstad and Ventersburg", detail: "Fuel stops just off the N1, which bypasses most towns." },
      { kind: "toll", title: "Verkeerdevlei Toll Plaza", detail: "Between Winburg and Bloemfontein, near Brandfort." }
    ]},
    { name: "Bloemfontein to Colesberg", items: [
      { kind: "lane", title: "Bloemfontein western bypass", detail: "The N1 skirts the city to the west. Stay on the N1 unless you're stopping in town." },
      { kind: "fuel", title: "Small Free State towns", detail: "Springfontein, Trompsburg and Edenburg have fuel, but fill up before your tank runs low." },
      { kind: "fuel", title: "Colesberg", detail: "Popular overnight and fuel stop just before the Orange River and the Northern Cape." }
    ]},
    { name: "Colesberg to Beaufort West", items: [
      { kind: "hazard", title: "Empty Karoo stretches", detail: "Long gaps between Hanover, Richmond and Three Sisters. Refuel when you're at half a tank." },
      { kind: "weather", title: "Karoo extremes", detail: "Very hot summer afternoons and freezing winter nights. Carry water and a warm layer." },
      { kind: "tip", title: "Three Sisters junction", detail: "The N12 to Kimberley joins here. Beaufort West is about 75 km further." }
    ]},
    { name: "Beaufort West to Cape Town", items: [
      { kind: "hazard", title: "Beaufort West to Laingsburg", detail: "About 200 km with few stops, known for fatigue-related crashes. Rest before you start it." },
      { kind: "hazard", title: "Hex River Pass", detail: "Long, steep pass between the Karoo and the Hex River Valley near De Doorns. Use a lower gear downhill and watch for slow trucks uphill." },
      { kind: "toll", title: "Huguenot Tunnel", detail: "Tolled tunnel near Paarl. The free Du Toitskloof Pass (R101) goes over the mountain instead but is slower and steep." },
      { kind: "lane", title: "Cape Town end", detail: "Traffic is heavy between Paarl and Cape Town through Bellville. Avoid the morning and late-afternoon peaks if you can." }
    ]}
  ]
},
/* 3 */ {
  id: "joburg-bloem", a: ["joburg", "pretoria"], b: ["bloem"],
  title: "Johannesburg to Bloemfontein", route: "N1 via Parys and Kroonstad", distanceKm: 400, driveTime: "About 4 hours",
  roads: ["N1"], places: ["Grasmere", "Parys", "Kroonstad", "Ventersburg", "Winburg", "Brandfort"],
  summary: "A straightforward N1 run with three toll plazas and long, straight Free State stretches.",
  before: [
    "Have a card or cash ready for Grasmere, Vaal and Verkeerdevlei toll plazas.",
    "Fill up before you leave or at Kroonstad.",
    "Leave early on Friday to beat Joburg traffic on the Western Bypass."
  ],
  legs: [
    { name: "Johannesburg to Kroonstad", items: [
      { kind: "lane", title: "Joburg Western Bypass", detail: "Heavy traffic past Randburg and Roodepoort at peak times. Follow the N1 signs for your direction." },
      { kind: "toll", title: "Grasmere Toll Plaza", detail: "South of Joburg, near Ennerdale." },
      { kind: "toll", title: "Vaal Toll Plaza", detail: "Near Parys, just before the Vaal River." },
      { kind: "fuel", title: "Kroonstad", detail: "Main fuel and food stop, about halfway." }
    ]},
    { name: "Kroonstad to Bloemfontein", items: [
      { kind: "hazard", title: "Straight, quiet roads", detail: "Fatigue and speeding are the main risks. Watch for slow farm vehicles joining." },
      { kind: "toll", title: "Verkeerdevlei Toll Plaza", detail: "Between Winburg and Bloemfontein, near Brandfort." },
      { kind: "lane", title: "Bloemfontein bypass", detail: "The N1 skirts the city to the west. Take the right exit for your suburb." }
    ]}
  ]
},
/* 4 */ {
  id: "pretoria-joburg", a: ["pretoria"], b: ["joburg"],
  title: "Pretoria to Johannesburg", route: "N1 (Ben Schoeman) via Centurion and Midrand", distanceKm: 55, driveTime: "45 minutes to 1½ hours",
  roads: ["N1", "N14", "M1", "R21", "R55"], places: ["Centurion", "Brakfontein", "Midrand", "Buccleuch", "Sandton", "Allandale"],
  summary: "One of the busiest roads in the country. When you leave matters more than which way you go.",
  before: [
    "Leave before 6:00 or after 9:00 in the morning if you can.",
    "Check for crashes before you leave; one incident can add an hour.",
    "E-tolls ended in April 2024, so you don't need an e-tag on this route.",
    "On very bad days, the Gautrain is often quicker."
  ],
  legs: [
    { name: "Pretoria to Midrand", items: [
      { kind: "lane", title: "Brakfontein interchange (Centurion)", detail: "The N1 bypass and the N14 Ben Schoeman split here. Get into the right lane early; late lane changes cause crashes." },
      { kind: "hazard", title: "Peak-hour crawl", detail: "Southbound jams in the morning and northbound in the afternoon. Keep a safe gap; rear-end crashes are common." },
      { kind: "tip", title: "Alternatives", detail: "The R21 is better for OR Tambo and the East Rand. The R55 can help for Kyalami and Sunninghill." }
    ]},
    { name: "Midrand to Johannesburg", items: [
      { kind: "lane", title: "Buccleuch interchange", detail: "The N1, N3 and M1 meet here and the signs come quickly. Choose your lane well before the interchange." },
      { kind: "tip", title: "M1 for Sandton and the CBD", detail: "The M1 South takes you past Sandton into the city. Expect queues at the Grayston and Corlett off-ramps at peak times." },
      { kind: "safety", title: "Robots out on off-ramps", detail: "During power cuts, treat dead traffic lights as a four-way stop and watch for cars that don't." }
    ]}
  ]
},
/* 5 */ {
  id: "pretoria-polokwane", a: ["pretoria", "joburg"], b: ["polokwane"],
  title: "Pretoria to Polokwane", route: "N1 via Bela-Bela, Modimolle and Mokopane", distanceKm: 270, driveTime: "About 3 hours",
  roads: ["N1"], places: ["Pumulani", "Hammanskraal", "Bela-Bela", "Modimolle", "Mookgophong", "Mokopane"],
  summary: "Freeway most of the way to Modimolle, then single carriageway with four toll plazas in total.",
  before: [
    "Have a card or cash ready for Pumulani, Carousel, Kranskop and Nyl toll plazas.",
    "Expect very heavy traffic before long weekends and school holidays.",
    "Fill up at Bela-Bela or Modimolle if you're low."
  ],
  legs: [
    { name: "Pretoria to Bela-Bela", items: [
      { kind: "toll", title: "Pumulani Toll Plaza", detail: "Just north of Pretoria, past the N4 split." },
      { kind: "hazard", title: "Hammanskraal stretch", detail: "Busy taxi traffic and pedestrians near the exits. Watch for vehicles stopping on the shoulder." },
      { kind: "toll", title: "Carousel Toll Plaza", detail: "Between Hammanskraal and Bela-Bela." }
    ]},
    { name: "Bela-Bela to Mokopane", items: [
      { kind: "toll", title: "Kranskop Toll Plaza", detail: "Between Bela-Bela and Modimolle." },
      { kind: "hazard", title: "Freeway ends at Modimolle", detail: "The road narrows to single carriageway. Overtake only where you can see well ahead, and watch for slow trucks." },
      { kind: "toll", title: "Nyl Toll Plaza", detail: "Between Modimolle and Mokopane." }
    ]},
    { name: "Mokopane to Polokwane", items: [
      { kind: "safety", title: "Animals and pedestrians at night", detail: "Livestock and people walking near settlements are hard to see after dark. Slow down." },
      { kind: "lane", title: "Polokwane eastern bypass", detail: "The N1 now bypasses the city centre. Take the right exit for town or keep going for Makhado and the border." }
    ]}
  ]
},
/* 6 */ {
  id: "pretoria-kruger", a: ["pretoria", "joburg"], b: ["kruger"],
  title: "Pretoria to Kruger (Malelane)", route: "N4 via eMalahleni, Middelburg and Mbombela", distanceKm: 430, driveTime: "4½–5 hours",
  roads: ["N4", "N12", "R539"], places: ["Bronkhorstspruit", "eMalahleni", "Witbank", "Middelburg", "Belfast", "eMakhazeni", "Machadodorp", "eNtokozweni", "Waterval Boven", "Ngodwana", "Mbombela", "Nelspruit", "Kaapmuiden", "Malelane"],
  summary: "The N4 Maputo Corridor: fast highveld freeway, then a winding descent through the Elands River valley into the Lowveld.",
  before: [
    "Have a card or cash ready for toll plazas: Diamond Hill, Middelburg, Machado and Nkomazi.",
    "Check Kruger gate closing times for your month and arrive well before; gates don't wait.",
    "Coming from Joburg, the N12 links to the N4 at eMalahleni.",
    "Expect heavy truck traffic all the way to the border."
  ],
  legs: [
    { name: "Pretoria to eMalahleni", items: [
      { kind: "toll", title: "Diamond Hill Toll Plaza", detail: "On the stretch between Pretoria and Bronkhorstspruit." },
      { kind: "hazard", title: "Coal trucks", detail: "Heavy truck traffic around eMalahleni and Middelburg. Watch for trucks pulling out slowly." },
      { kind: "tip", title: "Coming from Joburg", detail: "The N12 joins the N4 at eMalahleni." }
    ]},
    { name: "eMalahleni to eNtokozweni", items: [
      { kind: "toll", title: "Middelburg Toll Plaza", detail: "Just before the first Middelburg off-ramp." },
      { kind: "weather", title: "Highveld mist around Belfast", detail: "Thick mist is common between Middelburg and eNtokozweni, especially early morning. Lights on, speed down." },
      { kind: "toll", title: "Machado Toll Plaza", detail: "Near eNtokozweni (Machadodorp)." }
    ]},
    { name: "eNtokozweni to Mbombela", items: [
      { kind: "hazard", title: "Elands River valley", detail: "Winding road through Waterval Boven, including a short tunnel. Trucks are slow uphill and brake hard downhill." },
      { kind: "tip", title: "Schoemanskloof shortcut", detail: "The R539 is shorter but steep and slower behind trucks. The N4 is usually the easier drive." },
      { kind: "lane", title: "Mbombela northern bypass", detail: "Keep to the N4 bypass unless you're stopping in town. For Hazyview and the Numbi or Phabeni gates, take the R40." }
    ]},
    { name: "Mbombela to Malelane", items: [
      { kind: "toll", title: "Nkomazi Toll Plaza", detail: "Just east of Kaapmuiden." },
      { kind: "safety", title: "Single-lane sections with trucks", detail: "Overtake only with a clear view. Border-bound trucks are heavy and slow on climbs." },
      { kind: "tip", title: "Kruger gates off the N4", detail: "Malelane Gate is near Malelane. Crocodile Bridge Gate is near Komatipoort, further east." }
    ]}
  ]
},
/* 7 */ {
  id: "joburg-panorama", a: ["joburg", "pretoria"], b: ["panorama"],
  title: "Johannesburg to Dullstroom and Graskop", route: "N12/N4 to Belfast, then R540 and Long Tom Pass", distanceKm: 390, driveTime: "4½–5 hours to Graskop",
  roads: ["N12", "N4", "R540", "R37", "R532"], places: ["eMalahleni", "Middelburg", "Belfast", "eMakhazeni", "Dullstroom", "Lydenburg", "Mashishing", "Long Tom", "Sabie", "Graskop"],
  summary: "Highveld freeway to Belfast, then cooler, misty mountain roads through Dullstroom and over Long Tom Pass.",
  before: [
    "Have a card or cash ready for the Middelburg toll plaza (and Diamond Hill if you start in Pretoria).",
    "Fill up in Dullstroom or Mashishing; mountain stretches have few stops.",
    "Pack a warm layer; Dullstroom is cold even in summer evenings.",
    "Plan viewpoints for the morning; afternoon mist often hides the views."
  ],
  legs: [
    { name: "Johannesburg to Belfast", items: [
      { kind: "lane", title: "N12 between Joburg and eMalahleni", detail: "The N12 links Joburg to the N4 at eMalahleni." },
      { kind: "toll", title: "Middelburg Toll Plaza", detail: "On the N4 just before Middelburg." },
      { kind: "weather", title: "Mist around Belfast", detail: "Common, especially early morning. Lights on, speed down." }
    ]},
    { name: "Belfast to Dullstroom", items: [
      { kind: "hazard", title: "R540 rural road", detail: "Single carriageway with potholes in places. Slow down and keep a gap so you can see them." },
      { kind: "tip", title: "Weekend traffic in Dullstroom", detail: "The main road through town gets busy on weekends. Park off the main street." }
    ]},
    { name: "Dullstroom to Graskop", items: [
      { kind: "hazard", title: "Long Tom Pass (R37)", detail: "Steep, winding pass from Mashishing to Sabie with trucks and frequent mist. Use a low gear on the way down." },
      { kind: "safety", title: "Viewpoint parking", detail: "Don't leave valuables visible at viewpoints and lock up, even for a quick photo." },
      { kind: "fuel", title: "Sabie and Graskop", detail: "Fuel and food in both towns." }
    ]}
  ]
},
/* 8 */ {
  id: "joburg-suncity", a: ["joburg", "pretoria"], b: ["suncity"],
  title: "Johannesburg to Sun City", route: "Via Hartbeespoort or the N4 Platinum Highway, then the R556", distanceKm: 170, driveTime: "2–2½ hours",
  roads: ["N4", "R512", "R556", "N14"], places: ["Lanseria", "Hartbeespoort", "Brits", "Rustenburg", "Pilanesberg", "Sun City"],
  summary: "A short weekend drive. Traffic around Hartbeespoort and the toll plazas on the N4 are the main things to plan for.",
  before: [
    "Have a card or cash for the Bakwena toll plazas on the N4.",
    "Leave before 9:00 on Saturday to beat weekend traffic.",
    "Check Pilanesberg gate times if you're doing a game drive."
  ],
  legs: [
    { name: "Johannesburg to Hartbeespoort", items: [
      { kind: "hazard", title: "Weekend jams near the dam", detail: "Traffic around Hartbeespoort backs up on weekends and holidays." },
      { kind: "tip", title: "Two main ways", detail: "Via Lanseria and Hartbeespoort, or the N4 Platinum Highway via Brits. The N4 has tolls but is usually quicker." }
    ]},
    { name: "Hartbeespoort to Sun City", items: [
      { kind: "toll", title: "N4 Platinum Highway tolls", detail: "Several Bakwena plazas on the N4 west of Pretoria." },
      { kind: "hazard", title: "Mining trucks near Rustenburg", detail: "Slow, heavy trucks in the platinum belt. Overtake with care on the R556." },
      { kind: "safety", title: "Animals near Pilanesberg", detail: "Drive slowly near the park after dark." }
    ]}
  ]
},
/* 9 */ {
  id: "joburg-gqeberha", a: ["joburg", "pretoria"], b: ["gqeberha"],
  title: "Johannesburg to Gqeberha", route: "N1 to Colesberg, N9 to Middelburg, N10 via Nxuba (Cradock)", distanceKm: 1050, driveTime: "11–12 hours",
  roads: ["N1", "N9", "N10", "N2"], places: ["Kroonstad", "Bloemfontein", "Colesberg", "Noupoort", "Middelburg", "Cradock", "Nxuba", "Cookhouse", "Paterson"],
  summary: "A long day: N1 through the Free State, then quieter single-lane roads through the Karoo and down to the coast.",
  before: [
    "Have a card or cash ready for Grasmere, Vaal and Verkeerdevlei toll plazas. There are no tolls after Bloemfontein.",
    "Start early so you finish the mountain passes before dark.",
    "Refuel at Colesberg and again at Middelburg or Cradock.",
    "Carry water and snacks; services are far apart."
  ],
  legs: [
    { name: "Johannesburg to Bloemfontein", items: [
      { kind: "toll", title: "Three N1 toll plazas", detail: "Grasmere (south of Joburg), Vaal (near Parys) and Verkeerdevlei (near Brandfort)." },
      { kind: "fuel", title: "Kroonstad", detail: "Main fuel stop on the way to Bloemfontein." }
    ]},
    { name: "Bloemfontein to Middelburg", items: [
      { kind: "fuel", title: "Colesberg", detail: "Fill up here before turning onto the N9." },
      { kind: "lane", title: "N9 turn-off", detail: "The N9 leaves the N1 just southwest of Colesberg. Follow the signs for Middelburg." },
      { kind: "hazard", title: "Single-lane Karoo roads", detail: "The N9 and N10 carry trucks on single carriageway. Overtake only with a long, clear view." }
    ]},
    { name: "Middelburg to Gqeberha", items: [
      { kind: "fuel", title: "Nxuba (Cradock)", detail: "Last big town for fuel and food before the coast." },
      { kind: "hazard", title: "Daggaboers Nek and Olifantskop Pass", detail: "Two passes south of Cradock. Winding with slow trucks; take them in daylight." },
      { kind: "lane", title: "Where the N10 meets the N2", detail: "The junction is about 45 km from Gqeberha, which lies to the west of it." }
    ]}
  ]
},
/* 10 */ {
  id: "durban-drakensberg", a: ["durban"], b: ["drakensberg"],
  title: "Durban to the Drakensberg", route: "N3 to Estcourt, then Winterton and the R600 (Central Berg)", distanceKm: 230, driveTime: "2½–3 hours",
  roads: ["N3", "R600", "R74"], places: ["Pietermaritzburg", "Howick", "Mooi River", "Estcourt", "Winterton", "Bergville", "Champagne Valley"],
  summary: "N3 toll road up through the Midlands, then rural roads into the mountains.",
  before: [
    "Have a card or cash for Mariannhill and Mooi toll plazas.",
    "Fill up at Estcourt or Winterton; there's little fuel in the valleys.",
    "Summer afternoons bring heavy thunderstorms; winter can bring snow higher up.",
    "Arrive in daylight; resort roads are dark and have animals."
  ],
  legs: [
    { name: "Durban to Mooi River", items: [
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "First plaza, near Pinetown." },
      { kind: "hazard", title: "Town Hill climb", detail: "Steep, busy climb north of Pietermaritzburg. Slow trucks and morning mist." },
      { kind: "toll", title: "Mooi Toll Plaza", detail: "Near Mooi River." }
    ]},
    { name: "Mooi River to Champagne Valley", items: [
      { kind: "lane", title: "Turning off the N3", detail: "For Central Berg resorts, head for Winterton then the R600 into Champagne Valley. For the Northern Berg, go via Bergville (the Bergville N3 exit is tolled)." },
      { kind: "hazard", title: "Rural roads", detail: "Potholes, cattle and goats on the road. Slow down, especially near villages." },
      { kind: "weather", title: "Afternoon storms", detail: "Summer thunderstorms bring heavy rain and hail. Pull over safely if visibility drops." }
    ]}
  ]
},
/* 11 */ {
  id: "durban-ballito", a: ["durban"], b: ["ballito"],
  title: "Durban to Ballito", route: "N2 via Umhlanga and King Shaka Airport", distanceKm: 45, driveTime: "35–50 minutes",
  roads: ["N2", "M4"], places: ["Umhlanga", "Gateway", "Mount Edgecombe", "King Shaka", "oThongathi", "Tongaat", "Ballito"],
  summary: "A short run up the N2, with weekend and holiday traffic as the main headache.",
  before: [
    "Have a card or cash for the oThongathi Toll Plaza.",
    "Avoid Friday afternoons and the start of school holidays if you can.",
    "The M4 coastal road is a scenic, slower alternative."
  ],
  legs: [
    { name: "Durban to King Shaka Airport", items: [
      { kind: "hazard", title: "Umhlanga and Gateway traffic", detail: "The N2 near Umhlanga and Mount Edgecombe is busy at peak times. Expect slowdowns." },
      { kind: "toll", title: "King Shaka ramp toll", detail: "The airport ramps start the North Coast toll road." }
    ]},
    { name: "King Shaka Airport to Ballito", items: [
      { kind: "toll", title: "oThongathi Toll Plaza", detail: "Mainline plaza between the airport and Ballito." },
      { kind: "lane", title: "Ballito exits", detail: "Several exits serve Ballito, Salt Rock and Umhlali. Check which one your stay uses before you set off." }
    ]}
  ]
},
/* 12 */ {
  id: "durban-southcoast", a: ["durban"], b: ["southcoast"],
  title: "Durban to Margate (South Coast)", route: "N2 via Amanzimtoti and Scottburgh, then the R61", distanceKm: 125, driveTime: "About 1½ hours",
  roads: ["N2", "R61", "R102"], places: ["Amanzimtoti", "Kingsburgh", "Umkomaas", "Scottburgh", "Hibberdene", "Port Shepstone", "Shelly Beach", "Uvongo", "Margate"],
  summary: "A coastal drive that switches between dual and single carriageway, with heavy holiday traffic.",
  before: [
    "Some exits around Port Shepstone and Shelly Beach are tolled ramps. Have a card or cash.",
    "December and Easter traffic can double the drive time.",
    "Check for N2 closures near Amanzimtoti before you leave."
  ],
  legs: [
    { name: "Durban to Scottburgh", items: [
      { kind: "hazard", title: "Amanzimtoti and Kingsburgh", detail: "Busy with local traffic and exits close together. Keep a gap and signal early." },
      { kind: "tip", title: "R102 alternative", detail: "The R102 runs parallel to the N2 and is the usual detour when the N2 is closed." }
    ]},
    { name: "Scottburgh to Margate", items: [
      { kind: "hazard", title: "Single-carriageway sections", detail: "The N2 narrows south of Scottburgh in places. Don't overtake on blind rises." },
      { kind: "toll", title: "Ramp tolls near Port Shepstone", detail: "The Umtentweni and Izotsha (Shelly Beach) ramps are tolled." },
      { kind: "lane", title: "Onto the R61", detail: "At Port Shepstone, keep on the coast road for Shelly Beach, Uvongo and Margate. The N2 turns inland toward Kokstad." }
    ]}
  ]
},
/* 13 */ {
  id: "durban-eastlondon", a: ["durban"], b: ["eastlondon"],
  title: "Durban to East London", route: "N2 via Port Shepstone, Kokstad, Mthatha and Butterworth", distanceKm: 670, driveTime: "8–9 hours",
  roads: ["N2"], places: ["Port Shepstone", "Oribi", "Harding", "Kokstad", "Mount Ayliff", "Mount Frere", "KwaBhaca", "Qumbu", "Mthatha", "Dutywa", "Idutywa", "Butterworth", "Kei"],
  summary: "A long, mostly single-lane road through the former Transkei. Stray livestock and potholes make daylight driving essential.",
  before: [
    "Plan to drive in daylight only; livestock on the road is the biggest danger.",
    "Have a card or cash for the Oribi Toll Plaza.",
    "Fill up at Kokstad and Mthatha.",
    "Allow extra time for traffic through Mthatha and Butterworth."
  ],
  legs: [
    { name: "Durban to Kokstad", items: [
      { kind: "toll", title: "Oribi Toll Plaza", detail: "Near Port Shepstone, where the N2 turns inland." },
      { kind: "hazard", title: "Harding and Brook's Nek", detail: "Hilly stretch near Kokstad, including the steep Brook's Nek. Mist and slow trucks are common." },
      { kind: "fuel", title: "Kokstad", detail: "Good fuel and food stop before the Eastern Cape." }
    ]},
    { name: "Kokstad to Mthatha", items: [
      { kind: "safety", title: "Stray cattle, goats and sheep", detail: "Animals wander onto the road day and night. Slow down near villages and never drive this stretch after dark if you can avoid it." },
      { kind: "hazard", title: "Potholes and narrow shoulders", detail: "Keep your speed down and leave room to react." },
      { kind: "hazard", title: "Mthatha town traffic", detail: "The N2 runs through Mthatha with traffic lights, taxis and pedestrians. Expect delays." }
    ]},
    { name: "Mthatha to East London", items: [
      { kind: "safety", title: "Livestock around Dutywa and Butterworth", detail: "Same risk as further north. Keep a lookout on bends." },
      { kind: "hazard", title: "Kei River valley", detail: "Steep, winding descent and climb at the Great Kei River crossing. Use low gears and expect slow trucks." },
      { kind: "lane", title: "East London end", detail: "The road is dual carriageway near Gonubie and single lane beyond it. Overtaking gets harder once you leave the city." }
    ]}
  ]
},
/* 14 */ {
  id: "gqeberha-eastlondon", a: ["gqeberha"], b: ["eastlondon"],
  title: "Gqeberha to East London", route: "N2 via Makhanda and Qonce", distanceKm: 300, driveTime: "3½–4 hours",
  roads: ["N2"], places: ["Coega", "Colchester", "Addo", "Makhanda", "Grahamstown", "Peddie", "Qonce", "King William's Town", "Berlin"],
  summary: "Mostly single carriageway through farmland and former Ciskei towns, with a fast finish into East London.",
  before: [
    "No toll plazas on this route.",
    "Fill up in Makhanda, about halfway.",
    "Avoid driving the Peddie stretch after dark."
  ],
  legs: [
    { name: "Gqeberha to Makhanda", items: [
      { kind: "lane", title: "Gqeberha end", detail: "Dual carriageway past Bluewater Bay and Coega; single lane beyond the Addo turn-off." },
      { kind: "hazard", title: "Single carriageway with trucks", detail: "Overtake only with a clear view; the N10 junction brings extra trucks." },
      { kind: "fuel", title: "Makhanda (Grahamstown)", detail: "The N2 bypasses town; fuel and food just off the road." }
    ]},
    { name: "Makhanda to East London", items: [
      { kind: "safety", title: "Livestock near Peddie", detail: "Animals on the road, especially at dusk. Slow down near villages." },
      { kind: "hazard", title: "Traffic lights in Qonce", detail: "Several sets of robots through King William's Town. Expect delays at peak times." },
      { kind: "tip", title: "Qonce to East London", detail: "Dual carriageway from Qonce and freeway from Berlin, the fastest part of the trip." }
    ]}
  ]
},
/* 15 */ {
  id: "capetown-gqeberha", a: ["capetown"], b: ["gqeberha"],
  title: "Cape Town to Gqeberha", route: "N2 Garden Route via Swellendam, George, Knysna and Tsitsikamma", distanceKm: 770, driveTime: "8–9 hours",
  roads: ["N2"], places: ["Somerset West", "Sir Lowry's Pass", "Caledon", "Riviersonderend", "Swellendam", "Riversdale", "Mossel Bay", "George", "Wilderness", "Knysna", "Plettenberg Bay", "Tsitsikamma", "Bloukrans", "Storms River", "Humansdorp", "Jeffreys Bay"],
  summary: "The full Garden Route on the N2: mountain pass out of Cape Town, open Overberg farmland, then forests, lagoons and the Tsitsikamma toll road.",
  before: [
    "Have a card or cash for the Tsitsikamma Toll Plaza near Nature's Valley.",
    "Leave Cape Town early to miss N2 traffic through Somerset West.",
    "Fill up in Swellendam, George or Knysna.",
    "Check wind warnings for Sir Lowry's Pass, especially for trailers and caravans."
  ],
  legs: [
    { name: "Cape Town to Swellendam", items: [
      { kind: "safety", title: "N2 past the airport", detail: "Stay on the N2, keep doors locked and don't stop on the shoulder. Use only the exits you know." },
      { kind: "hazard", title: "Somerset West traffic lights", detail: "The N2 stops being a freeway past Somerset West and has robots. Queues build at peak times." },
      { kind: "weather", title: "Sir Lowry's Pass wind and fog", detail: "Strong southeasterly gusts in summer and mist in winter. Slow down, especially towing." },
      { kind: "fuel", title: "Caledon and Swellendam", detail: "Fuel and food stops on the Overberg stretch." }
    ]},
    { name: "Swellendam to George", items: [
      { kind: "hazard", title: "Long overtaking stretches", detail: "Mostly single carriageway with trucks. Use the passing lanes rather than risking it." },
      { kind: "fuel", title: "Riversdale and Mossel Bay", detail: "Good stops before George." }
    ]},
    { name: "George to Plettenberg Bay", items: [
      { kind: "hazard", title: "Kaaimans Pass", detail: "Winding section between George and Wilderness. Slow down on the bends." },
      { kind: "hazard", title: "Knysna holiday traffic", detail: "The N2 runs through Knysna and backs up in December and Easter holidays." }
    ]},
    { name: "Plettenberg Bay to Gqeberha", items: [
      { kind: "toll", title: "Tsitsikamma Toll Plaza", detail: "Near Nature's Valley, on the toll road over the Bloukrans Bridge." },
      { kind: "tip", title: "Storms River", detail: "Good rest stop just off the N2 in the Tsitsikamma." },
      { kind: "lane", title: "Gqeberha end", detail: "Dual carriageway between the Van Stadens Bridge and the city; single carriageway west of it." }
    ]}
  ]
},
/* 16 */ {
  id: "capetown-gardenroute", a: ["capetown"], b: ["gardenroute"],
  title: "Cape Town to Knysna (Garden Route)", route: "N2 via Swellendam, Mossel Bay and George", distanceKm: 490, driveTime: "5½–6 hours",
  roads: ["N2"], places: ["Somerset West", "Sir Lowry's Pass", "Caledon", "Swellendam", "Riversdale", "Mossel Bay", "George", "Wilderness", "Sedgefield", "Knysna"],
  summary: "No tolls, one big mountain pass, and holiday traffic in the Garden Route towns.",
  before: [
    "No toll plazas between Cape Town and Knysna.",
    "Leave early to miss N2 traffic through Somerset West.",
    "Check wind warnings for Sir Lowry's Pass if you're towing.",
    "Book ahead in December; Knysna and Plett fill up."
  ],
  legs: [
    { name: "Cape Town to Swellendam", items: [
      { kind: "safety", title: "N2 past the airport", detail: "Stay on the N2, keep doors locked and don't stop on the shoulder." },
      { kind: "weather", title: "Sir Lowry's Pass", detail: "Strong summer winds and winter mist. Slow down, especially towing." },
      { kind: "fuel", title: "Caledon and Swellendam", detail: "Fuel and food on the Overberg stretch." }
    ]},
    { name: "Swellendam to George", items: [
      { kind: "hazard", title: "Trucks on single carriageway", detail: "Use the passing lanes; don't risk overtaking on rises." },
      { kind: "fuel", title: "Mossel Bay", detail: "Last big stop before George." }
    ]},
    { name: "George to Knysna", items: [
      { kind: "hazard", title: "Kaaimans Pass", detail: "Winding section into Wilderness. Watch the bends." },
      { kind: "hazard", title: "Knysna bottleneck", detail: "Holiday traffic through town can back up for kilometres. Arrive before midday if you can." }
    ]}
  ]
},
/* 17 */ {
  id: "capetown-hermanus", a: ["capetown"], b: ["hermanus"],
  title: "Cape Town to Hermanus", route: "N2 over Sir Lowry's Pass, then the R43 from Botrivier", distanceKm: 120, driveTime: "About 1½ hours",
  roads: ["N2", "R43", "R44"], places: ["Somerset West", "Sir Lowry's Pass", "Grabouw", "Houw Hoek", "Botrivier", "Kleinmond", "Gordon's Bay", "Hermanus"],
  summary: "A short trip with a choice: the faster N2 over the mountains, or the coastal R44 (Clarence Drive) via Gordon's Bay and Kleinmond.",
  before: [
    "No toll plazas on either route.",
    "Whale season (roughly June to November) brings busy weekends in Hermanus.",
    "Check the wind forecast if you're towing over Sir Lowry's Pass."
  ],
  legs: [
    { name: "Cape Town to Botrivier", items: [
      { kind: "safety", title: "N2 past the airport", detail: "Stay on the N2, keep doors locked and don't stop on the shoulder." },
      { kind: "weather", title: "Sir Lowry's Pass", detail: "Strong summer winds and winter mist." },
      { kind: "tip", title: "Coastal alternative (R44)", detail: "Clarence Drive from Gordon's Bay is beautiful but slow and winding, with cyclists. Check it's open after storms." }
    ]},
    { name: "Botrivier to Hermanus", items: [
      { kind: "lane", title: "R43 turn-off at Botrivier", detail: "Leave the N2 at Botrivier for the R43 to Hermanus." },
      { kind: "hazard", title: "Weekend traffic into town", detail: "Busy on whale-season weekends. Park outside the centre and walk." }
    ]}
  ]
},
/* 18 */ {
  id: "capetown-stellenbosch", a: ["capetown", "ctairport"], b: ["stellenbosch"],
  title: "Cape Town to Stellenbosch", route: "N1 and R304, or N2 and R310/R44", distanceKm: 50, driveTime: "45 minutes to 1 hour",
  roads: ["N1", "N2", "R304", "R310", "R44", "M12"], places: ["Bellville", "Kuils River", "Polkadraai", "Somerset West", "Stellenbosch"],
  summary: "A short commute where timing and choosing the right approach make the difference.",
  before: [
    "No toll plazas.",
    "Avoid 7:00–9:00 inbound to Stellenbosch and 16:00–18:00 outbound.",
    "Check which approach your destination is on: north side (R304) or south side (R310/R44)."
  ],
  legs: [
    { name: "Cape Town to Stellenbosch", items: [
      { kind: "tip", title: "Two main approaches", detail: "N1 to the R304 for the north side of town, or the N2 to the R310 for the south and the wine farms near Spier." },
      { kind: "hazard", title: "Peak-hour queues", detail: "Long queues on all approaches into Stellenbosch on weekday mornings." },
      { kind: "safety", title: "Students and cyclists", detail: "Lots of pedestrians and cyclists in town. Slow down on campus roads." }
    ]}
  ]
},
/* 19 */ {
  id: "ctairport-capetown", a: ["ctairport"], b: ["capetown"],
  title: "Cape Town Airport to the City", route: "N2 into the city centre", distanceKm: 20, driveTime: "20–40 minutes",
  roads: ["N2"], places: ["Airport", "Borcherds Quarry", "Hospital Bend", "Woodstock", "Eastern Boulevard", "City Centre"],
  summary: "A short drive, but this stretch of N2 has a safety reputation. Plan the route before you leave the car park.",
  before: [
    "Set your navigation before you leave the airport so you don't stop or hesitate on the N2.",
    "Avoid the inbound morning peak (about 6:30–9:00).",
    "Keep doors locked and bags out of sight."
  ],
  legs: [
    { name: "Cape Town Airport to the City", items: [
      { kind: "safety", title: "Stay on the N2", detail: "Don't take unfamiliar off-ramps or follow detours into nearby areas. If your maps app suggests a back route, stay on the N2." },
      { kind: "safety", title: "Never stop on the shoulder", detail: "If you have a problem, keep driving slowly to a busy, well-lit place like a fuel station." },
      { kind: "lane", title: "Hospital Bend", detail: "Where the N2 meets the M3 near Groote Schuur. For the city centre, follow Eastern Boulevard / City Centre signs." },
      { kind: "tip", title: "City Bowl streets", detail: "Many one-way streets and bus-only lanes. Watch for MyCiTi lanes marked in red." }
    ]}
  ]
},
/* 20 */ {
  id: "capetown-langebaan", a: ["capetown"], b: ["langebaan"],
  title: "Cape Town to Langebaan (West Coast)", route: "R27 West Coast Road via Table View and Yzerfontein", distanceKm: 125, driveTime: "About 1½ hours",
  roads: ["R27", "R45", "R315"], places: ["Milnerton", "Table View", "Blouberg", "Melkbosstrand", "Yzerfontein", "West Coast National Park", "Langebaan", "Vredenburg", "Velddrif"],
  summary: "A quick, scenic run up the R27 with long straights, strong wind and the West Coast National Park on the way.",
  before: [
    "No toll plazas.",
    "Fill up in Table View or Melkbosstrand; there's little until Langebaan.",
    "Flower season (around August and September) brings heavy weekend traffic into the park.",
    "Check West Coast National Park gate times if you're driving through it."
  ],
  legs: [
    { name: "Cape Town to Melkbosstrand", items: [
      { kind: "hazard", title: "Table View traffic", detail: "The R27 through Milnerton and Table View has robots and heavy commuter traffic." },
      { kind: "fuel", title: "Melkbosstrand", detail: "Last convenient fuel before the open road." }
    ]},
    { name: "Melkbosstrand to Langebaan", items: [
      { kind: "weather", title: "Strong crosswinds", detail: "The southeaster blows hard across the R27 in summer, with blowing sand. Hold the wheel firmly, especially towing." },
      { kind: "hazard", title: "Long straights", detail: "Easy to speed and to doze. Keep an eye on your speed and take a break if needed." },
      { kind: "safety", title: "Tortoises and buck", detail: "Wildlife crosses the road, especially in the national park. Stick to the park's speed limits." }
    ]}
  ]
},
/* ---------- Commuter guides: Gauteng ---------- */
/* 21 */ {
  id: "soweto-joburg", a: ["soweto"], b: ["jhbcbd", "sandton", "joburg"], commute: true,
  title: "Soweto to Joburg CBD and Sandton", route: "Soweto Highway (M70) to the CBD, or the N1 Western Bypass to Sandton", distanceKm: 25, driveTime: "30–60 minutes at peak",
  roads: ["M70", "N1", "N12", "M1", "M7"], places: ["Soweto", "Orlando", "Diepkloof", "Nasrec", "Booysens", "Braamfontein", "Western Bypass", "Malibongwe", "William Nicol", "Rivonia"],
  summary: "Two different commutes: the Soweto Highway straight into town for the CBD, or the N1 Western Bypass north for Sandton and the northern suburbs.",
  before: [
    "Leave before 6:00 to beat the worst of the morning queues.",
    "Check for crashes on the N1 Western Bypass before you choose your route.",
    "No tolls on this route since e-tolls ended in April 2024.",
    "Rea Vaya buses run along the Soweto Highway if you'd rather not drive."
  ],
  legs: [
    { name: "Soweto to Joburg CBD", items: [
      { kind: "lane", title: "Rea Vaya bus lanes", detail: "The Soweto Highway has bus-only lanes in both directions. Stay out of them; they're enforced." },
      { kind: "hazard", title: "Taxis stopping suddenly", detail: "Minibus taxis pull in and out without warning near stops and intersections. Keep a gap and watch the car two ahead." },
      { kind: "tip", title: "FNB Stadium events", detail: "Big matches and concerts at Nasrec back up the Soweto Highway for hours. Check the events calendar." },
      { kind: "lane", title: "Into the city", detail: "The Soweto Highway leads to Booysens, just south of the CBD. Plan which street you'll take into town before you get there." }
    ]},
    { name: "Soweto to Sandton", items: [
      { kind: "lane", title: "N1 Western Bypass northbound", detail: "Join the N1 north and stay in the middle lanes; the left lane slows at every on-ramp." },
      { kind: "hazard", title: "Heavy morning queues", detail: "The bypass is often stop-start from Roodepoort past Randburg on weekday mornings. Allow extra time." },
      { kind: "lane", title: "Sandton exits", detail: "William Nicol and Rivonia exits serve Sandton. Move left early; late lane changes cause many crashes here." },
      { kind: "safety", title: "Robots out on off-ramps", detail: "During power cuts, treat dead traffic lights as a four-way stop and watch for cars that don't." }
    ]}
  ]
},
/* 22 */ {
  id: "eastrand-joburg", a: ["eastrand"], b: ["jhbcbd", "sandton", "joburg"], commute: true,
  title: "East Rand to Johannesburg", route: "N12 and R24 to the George Bizos (Gillooly's) interchange, then the N3 or M2", distanceKm: 25, driveTime: "35–75 minutes at peak",
  roads: ["N12", "R24", "N3", "R21", "M2"], places: ["Boksburg", "Benoni", "Kempton Park", "Edenvale", "Bedfordview", "Germiston", "Gillooly's", "George Bizos", "Geldenhuys", "Elands", "Eastgate"],
  summary: "Most East Rand commuters funnel through the George Bizos (Gillooly's) interchange in Bedfordview, one of the busiest interchanges in the country.",
  before: [
    "No tolls on these roads since e-tolls ended in April 2024.",
    "Check for crashes at Gillooly's before you leave; one incident backs up every approach.",
    "For Sandton, consider the N3 north; for the CBD, the R24 into town or the M2.",
    "The Gautrain from Rhodesfield or Marlboro can beat peak traffic to Sandton."
  ],
  legs: [
    { name: "East Rand to Bedfordview", items: [
      { kind: "hazard", title: "N12 through Boksburg and Germiston", detail: "Heavy traffic and many trucks. Keep a safe gap; rear-end crashes are common at peak." },
      { kind: "lane", title: "R24 airport freeway", detail: "From Kempton Park and OR Tambo, the R24 runs west through Edenvale. Watch for airport traffic merging and drivers looking for exits." },
      { kind: "safety", title: "Smash-and-grab at robots", detail: "Keep bags and phones out of sight at intersections and off-ramps." }
    ]},
    { name: "Bedfordview to Johannesburg", items: [
      { kind: "hazard", title: "George Bizos (Gillooly's) interchange", detail: "Where the N12, R24 and N3 meet. Lanes split and merge quickly. Know your lane before you reach it." },
      { kind: "lane", title: "Into the CBD on the R24", detail: "Past Eastgate the R24 stops being a freeway and becomes city streets with robots through Bruma and Kensington." },
      { kind: "lane", title: "N3 north for Sandton", detail: "Take the N3 Eastern Bypass north towards Buccleuch for Sandton and Woodmead. Expect queues near Linksfield." },
      { kind: "tip", title: "M2 via Geldenhuys", detail: "The Geldenhuys interchange connects to the M2 for Germiston and the south of the CBD." }
    ]}
  ]
},
/* 23 */ {
  id: "westrand-sandton", a: ["westrand"], b: ["sandton", "joburg"], commute: true,
  title: "West Rand to Sandton", route: "N1 Western Bypass, or Beyers Naude Drive and Malibongwe", distanceKm: 30, driveTime: "40–75 minutes at peak",
  roads: ["N1", "N14", "M5", "R512", "M47"], places: ["Roodepoort", "Krugersdorp", "Florida", "Constantia Kloof", "Beyers Naude", "Malibongwe", "William Nicol", "Rivonia", "Muldersdrift", "Western Bypass"],
  summary: "The N1 Western Bypass is the main route, but it's one of Joburg's slowest stretches at peak. Beyers Naude Drive is the usual alternative.",
  before: [
    "No tolls on this route since e-tolls ended in April 2024.",
    "Check the N1 Western Bypass for crashes before you choose a route.",
    "Leave before 6:15 or after 8:45 to miss the worst queues."
  ],
  legs: [
    { name: "West Rand to the N1", items: [
      { kind: "lane", title: "Joining from Roodepoort", detail: "Most Roodepoort commuters join the N1 at Christiaan de Wet or 14th Avenue. Expect on-ramp queues from about 6:30." },
      { kind: "tip", title: "From Krugersdorp", detail: "The N14 towards Muldersdrift links to Beyers Naude Drive (M5) towards Randburg, avoiding part of the bypass." },
      { kind: "safety", title: "Robots out", detail: "During power cuts, treat dead traffic lights as a four-way stop, especially on Hendrik Potgieter and Christiaan de Wet." }
    ]},
    { name: "The N1 to Sandton", items: [
      { kind: "hazard", title: "Western Bypass crawl", detail: "Often stop-start from Beyers Naude to William Nicol at peak. Keep a safe gap; rear-end crashes are common." },
      { kind: "lane", title: "Malibongwe and William Nicol exits", detail: "William Nicol leads to Sandton via Bryanston. Get into the left lanes early." },
      { kind: "tip", title: "Rivonia exit", detail: "Rivonia Road takes you to Sandton CBD and Sunninghill. Queues on the off-ramp can reach the highway." }
    ]}
  ]
},
/* 24 */ {
  id: "centurion-ptacbd", a: ["centurion"], b: ["ptacbd", "pretoria"], commute: true,
  title: "Centurion to Pretoria CBD", route: "N14 Ben Schoeman into Salvokop, or the R21 to the Fountains circle", distanceKm: 15, driveTime: "20–45 minutes at peak",
  roads: ["N14", "R21", "N1", "M18", "R101"], places: ["Centurion", "Brakfontein", "Lyttelton", "Fountains", "Salvokop", "Irene", "Groenkloof", "Monument Park"],
  summary: "A short commute where both main routes narrow into city streets near Fountains, so that's where queues build.",
  before: [
    "No tolls on these roads since e-tolls ended in April 2024.",
    "The Gautrain from Centurion to Pretoria station takes about 10 minutes and avoids the queue.",
    "Avoid 6:45–8:15 inbound if you can."
  ],
  legs: [
    { name: "Centurion to Pretoria CBD", items: [
      { kind: "lane", title: "N14 Ben Schoeman northbound", detail: "From Brakfontein the N14 runs past Lyttelton and Groenkloof and ends in Salvokop, just south of the CBD." },
      { kind: "tip", title: "R21 alternative", detail: "From Irene and the east, the R21 runs past Monument Park to the Fountains circle, where it becomes Nelson Mandela Drive." },
      { kind: "hazard", title: "Fountains bottleneck", detail: "Both routes meet city traffic near Fountains. Expect queues at peak and taxis changing lanes." },
      { kind: "safety", title: "Robots out in town", detail: "CBD intersections jam badly during power cuts. Treat dead traffic lights as a four-way stop." }
    ]}
  ]
},
/* ---------- Commuter guides: Durban ---------- */
/* 25 */ {
  id: "umlazi-dbncbd", a: ["umlazi"], b: ["dbncbd", "durban"], commute: true,
  title: "Umlazi to Durban CBD", route: "N2 to the Reunion interchange, then the M4 (Inkosi Albert Luthuli Highway)", distanceKm: 20, driveTime: "25–50 minutes at peak",
  roads: ["M4", "N2", "R102", "M35"], places: ["Umlazi", "Isipingo", "Reunion", "Prospecton", "Mobeni", "Southern Freeway", "Albert Luthuli Highway"],
  summary: "The M4 is the direct route into the CBD from the south; the N2 bypasses the city as the Outer Ring Road.",
  before: [
    "No tolls on this route.",
    "Leave before 6:15 to beat the main inbound rush.",
    "Check for N2 closures near Isipingo and Prospecton after heavy rain."
  ],
  legs: [
    { name: "Umlazi to Durban CBD", items: [
      { kind: "lane", title: "Reunion interchange", detail: "Where the N2 meets the M4 next to the old airport. Follow M4 signs for the city; the N2 swings inland as the Outer Ring Road." },
      { kind: "hazard", title: "Port trucks", detail: "The M4 runs alongside the port and industrial areas. Expect heavy trucks merging and slow lanes." },
      { kind: "hazard", title: "Taxis on the R102", detail: "The R102 through Isipingo is busy with taxis and pedestrians. Slow down near ranks." },
      { kind: "weather", title: "Flooding after heavy rain", detail: "Low-lying roads near Isipingo and Prospecton flood quickly in storms. Don't drive through water you can't see the bottom of." }
    ]}
  ]
},
/* 26 */ {
  id: "pinetown-dbncbd", a: ["pinetown"], b: ["dbncbd", "durban"], commute: true,
  title: "Pinetown to Durban CBD", route: "N3 via the EB Cloete interchange, or the M13 through Westville", distanceKm: 17, driveTime: "25–50 minutes at peak",
  roads: ["N3", "M13", "N2", "M10"], places: ["Pinetown", "Westville", "Cowies Hill", "Paradise Valley", "EB Cloete", "Spaghetti Junction", "Fields Hill", "Mayville", "Sherwood", "45th Cutting"],
  summary: "Two parallel routes: the N3 through the EB Cloete interchange, or the M13 through Westville, which many commuters use to avoid the N3 queues.",
  before: [
    "No tolls between Pinetown and the CBD; the Mariannhill Toll Plaza is west of Pinetown.",
    "Check for crashes at the EB Cloete interchange before choosing the N3 or M13.",
    "Expect roadworks around EB Cloete during its upgrade."
  ],
  legs: [
    { name: "Pinetown to Westville", items: [
      { kind: "hazard", title: "Fields Hill (M13)", detail: "Steep hill between Kloof and Pinetown, known for serious truck crashes. Slow down and keep well back from heavy vehicles." },
      { kind: "lane", title: "M13 or N3?", detail: "The M13 (King Cetshwayo Highway) runs parallel to the N3 through Westville and is often quicker when the N3 is jammed." }
    ]},
    { name: "Westville to Durban CBD", items: [
      { kind: "hazard", title: "EB Cloete interchange", detail: "The four-level 'Spaghetti Junction' where the N2 and N3 meet. Very heavy traffic and quick lane splits; know your lane early." },
      { kind: "roadworks", title: "Interchange upgrade", detail: "SANRAL is upgrading EB Cloete. Lane layouts and speed limits change; follow the temporary signs." },
      { kind: "lane", title: "Into town", detail: "The M13 becomes King Dinuzulu Road near the city; the N3 ends in the CBD. Expect robots and taxis once you're off the freeway." }
    ]}
  ]
},
/* 27 */ {
  id: "umhlanga-dbncbd", a: ["umhlanga"], b: ["dbncbd", "durban"], commute: true,
  title: "Umhlanga to Durban CBD", route: "M4 (Ruth First Highway) along the coast, or the N2", distanceKm: 18, driveTime: "20–45 minutes at peak",
  roads: ["M4", "N2", "M41", "M12", "M17"], places: ["Umhlanga", "La Lucia", "Gateway", "Umhlanga Ridge", "Durban North", "Virginia", "Moses Mabhida", "Ruth First Highway", "Leo Boyd Highway"],
  summary: "The M4 coastal road is the most direct; the N2 can be quicker from Umhlanga Ridge and Gateway, but both queue at peak.",
  before: [
    "No tolls on this route.",
    "Umhlanga Rocks Drive and Gateway traffic build early; leave before 6:30 if you can.",
    "Big events at Moses Mabhida Stadium slow the M4 near the stadium."
  ],
  legs: [
    { name: "Umhlanga to Durban CBD", items: [
      { kind: "hazard", title: "Umhlanga Ridge and Gateway", detail: "Very busy around the M41 and Umhlanga Rocks Drive at peak. Allow extra time just to reach the highway." },
      { kind: "tip", title: "M4 coastal route", detail: "The M4 runs past La Lucia and Virginia Airport, then becomes the Ruth First Highway past Moses Mabhida Stadium into town." },
      { kind: "lane", title: "N2 alternative", detail: "From Umhlanga Ridge, the N2 south can be quicker, but it joins heavy traffic heading for the EB Cloete interchange." },
      { kind: "safety", title: "Robots in the CBD", detail: "Once off the M4 you're on one-way city streets. Watch for taxis and pedestrians, and keep valuables out of sight." }
    ]}
  ]
},
/* 28 */ {
  id: "pmb-durban", a: ["pmb"], b: ["durban", "dbncbd", "pinetown"], commute: true,
  title: "Pietermaritzburg to Durban", route: "N3 via Cato Ridge, Hammarsdale and Pinetown", distanceKm: 80, driveTime: "1–1½ hours",
  roads: ["N3", "M13"], places: ["Pietermaritzburg", "Camperdown", "Cato Ridge", "Hammarsdale", "Key Ridge", "Harrison Flats", "Mariannhill", "Pinetown", "EB Cloete"],
  summary: "A fast but heavy commute on the busiest truck route in the country, with one toll plaza and a bottleneck at the Durban end.",
  before: [
    "Have a card or cash for the Mariannhill Toll Plaza, or ask the N3 Toll Concession about frequent-user discounts.",
    "Save the N3 Helpline: 0800 63 43 57.",
    "Leave before 5:45 to beat the Pinetown and EB Cloete queues.",
    "Check @N3Route on X for crashes before you set off."
  ],
  legs: [
    { name: "Pietermaritzburg to Cato Ridge", items: [
      { kind: "hazard", title: "Heavy trucks", detail: "The N3 is the main freight route to the port. Expect slow trucks on every climb; overtake only in the right lane." },
      { kind: "weather", title: "Early-morning mist", detail: "Mist settles in the valleys around Camperdown and Cato Ridge. Lights on, speed down, bigger gap." }
    ]},
    { name: "Cato Ridge to Pinetown", items: [
      { kind: "hazard", title: "Long descents", detail: "Steep downhill sections towards Hammarsdale and Harrison Flats. Trucks brake hard; leave plenty of room." },
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "Mainline plaza near Pinetown. Many commuters use the M13 from Key Ridge to avoid it, but Fields Hill is steep." },
      { kind: "tip", title: "M13 split at Key Ridge", detail: "The M13 leaves the N3 near Assagay and runs through Hillcrest and Kloof. It avoids the toll but goes down Fields Hill." }
    ]},
    { name: "Pinetown to Durban", items: [
      { kind: "hazard", title: "EB Cloete interchange", detail: "Where the N2 and N3 meet in Westville. Heavy, slow traffic at peak and roadworks during the upgrade." },
      { kind: "lane", title: "Durban end", detail: "Know whether you need the N2 north, the N2 south or the N3 into town before you reach EB Cloete." }
    ]}
  ]
},
/* ---------- Commuter guides: Cape Town ---------- */
/* 29 */ {
  id: "bellville-capetown", a: ["bellville"], b: ["capetown"], commute: true,
  title: "Bellville to Cape Town City Centre", route: "N1 inbound via Plattekloof and Koeberg", distanceKm: 20, driveTime: "25–60 minutes at peak",
  roads: ["N1", "M5", "R27", "R102", "N7"], places: ["Bellville", "Tyger Valley", "Durban Road", "Plattekloof", "Monte Vista", "Goodwood", "Koeberg", "Paarden Eiland", "Foreshore", "Voortrekker Road"],
  summary: "The N1 is the main route in from the northern suburbs, and inbound jams of up to 12 km are common on weekday mornings.",
  before: [
    "No tolls on this route.",
    "Leave before 6:15 or after 8:45 to miss the worst inbound queue.",
    "Voortrekker Road (R102) runs parallel but has many robots."
  ],
  legs: [
    { name: "Bellville to Koeberg", items: [
      { kind: "hazard", title: "Morning queue from Durban Road", detail: "Inbound traffic is often stop-start from Durban Road past Plattekloof. Keep a safe gap; rear-end crashes are common." },
      { kind: "lane", title: "N7 and Plattekloof merges", detail: "Traffic joins from the N7 and Plattekloof Road. Stay out of the far-left lane through these merges." },
      { kind: "tip", title: "Koeberg interchange", detail: "The M5 and R27 connect here. Stay on the N1 for the city centre." }
    ]},
    { name: "Koeberg to Cape Town City Centre", items: [
      { kind: "lane", title: "City exits", detail: "Lower Church Street and Christiaan Barnard Street serve the Foreshore and CTICC; the N1 ends at Buitengracht near the Waterfront." },
      { kind: "tip", title: "Afternoon reverse", detail: "Outbound traffic jams in the afternoon from about 15:30. Leaving town after 18:00 is usually much quicker." }
    ]}
  ]
},
/* 30 */ {
  id: "southern-capetown", a: ["southern"], b: ["capetown"], commute: true,
  title: "Southern Suburbs to Cape Town City Centre", route: "M3 (Blue Route, Edinburgh Drive and Philip Kgosana Drive)", distanceKm: 18, driveTime: "20–50 minutes at peak",
  roads: ["M3", "N2", "M4", "M5"], places: ["Tokai", "Bergvliet", "Constantia", "Wynberg", "Bishopscourt", "Newlands", "Edinburgh Drive", "Paradise Road", "Rondebosch", "Hospital Bend", "Philip Kgosana Drive", "De Waal Drive"],
  summary: "The M3 is the main route from Tokai and Constantia into town, but the traffic lights through Bishopscourt and Newlands slow everything at peak.",
  before: [
    "No tolls on this route.",
    "Leave before 6:30 to beat the queue at the Newlands robots.",
    "Expect roadworks between Newlands and Wynberg during the City's M3 congestion project."
  ],
  legs: [
    { name: "Tokai to Newlands", items: [
      { kind: "hazard", title: "Blue Route peak traffic", detail: "Heavy inbound traffic from Tokai and Bergvliet from about 6:30. Keep a safe gap." },
      { kind: "hazard", title: "Robots through Bishopscourt and Newlands", detail: "The M3 stops being a freeway here, with several traffic lights on Edinburgh Drive and Union Avenue. Queues build at each one." },
      { kind: "roadworks", title: "M3 congestion project", detail: "The City plans changes to the intersections between Newlands and Wynberg from late 2026. Follow temporary signs." }
    ]},
    { name: "Newlands to Cape Town City Centre", items: [
      { kind: "lane", title: "Hospital Bend", detail: "The M3 and N2 share the road past Groote Schuur. Know whether you need the N2 or the M3 into town before you get there." },
      { kind: "tip", title: "Philip Kgosana Drive", detail: "The old De Waal Drive takes you along the mountain into the Gardens and the city centre." },
      { kind: "tip", title: "Alternatives", detail: "Main Road (M4) and the M5 run parallel through the suburbs. Slower, but useful if the M3 is blocked." }
    ]}
  ]
},
/* 31 */ {
  id: "khayelitsha-capetown", a: ["khayelitsha"], b: ["capetown"], commute: true,
  title: "Khayelitsha and Mitchells Plain to Cape Town", route: "N2 inbound past the airport, or the M5 from the south", distanceKm: 30, driveTime: "35–75 minutes at peak",
  roads: ["N2", "M5", "R300", "R310", "M7"], places: ["Khayelitsha", "Mitchells Plain", "Mew Way", "Spine Road", "Borcherds Quarry", "Airport", "Bonteheuwel", "Langa", "Jan Smuts", "Hospital Bend", "Baden Powell"],
  summary: "The N2 is the main route into town but has a serious safety reputation near the airport; plan your route and stay on the highway.",
  before: [
    "No tolls on this route.",
    "Leave before 6:00 to beat the heaviest inbound traffic.",
    "Keep doors locked and bags out of sight the whole way.",
    "Check whether MyCiTi's N2 Express bus is running if you'd rather not drive."
  ],
  legs: [
    { name: "Khayelitsha to the airport", items: [
      { kind: "lane", title: "Joining the N2", detail: "Mew Way and Spine Road connect Khayelitsha to the N2. From Mitchells Plain, the R300 links to the N2." },
      { kind: "lane", title: "Bus and taxi lanes", detail: "Obey any lanes marked for buses and minibus taxis; traffic officers enforce them at peak." },
      { kind: "hazard", title: "Taxis and pedestrians", detail: "People cross the N2 near Nyanga and Borcherds Quarry. Watch the shoulders, especially early morning when it's dark." }
    ]},
    { name: "The airport to Cape Town", items: [
      { kind: "safety", title: "Stay on the N2 past the airport", detail: "This stretch is known for objects thrown at cars and robberies. Don't stop on the shoulder; drive to a busy fuel station if you have a problem." },
      { kind: "safety", title: "Fake obstacles", detail: "Criminals sometimes put rocks or spikes on the road. If you hit something, keep driving slowly to a safe, busy place." },
      { kind: "lane", title: "Hospital Bend", detail: "The N2 meets the M3 near Groote Schuur. Follow City Centre signs onto Nelson Mandela Boulevard or the M3." },
      { kind: "tip", title: "M5 alternative", detail: "From Mitchells Plain, Baden Powell Drive to the M5 runs north through the southern suburbs. Longer, but avoids the airport stretch." }
    ]}
  ]
},
/* 32 */ {
  id: "tableview-capetown", a: ["tableview"], b: ["capetown"], commute: true,
  title: "Table View to Cape Town City Centre", route: "R27 (Marine Drive) through Milnerton, or the M5 to the N1", distanceKm: 15, driveTime: "25–55 minutes at peak",
  roads: ["R27", "N1", "M5", "M14"], places: ["Table View", "Parklands", "Blouberg", "Milnerton", "Marine Drive", "Koeberg", "Paarden Eiland", "Foreshore"],
  summary: "A short distance that takes long at peak: the R27 has robots all through Table View and Milnerton.",
  before: [
    "No tolls on this route.",
    "Leave before 6:15 to beat the Marine Drive queue.",
    "MyCiTi buses run from Table View to the city in their own lanes and are often quicker at peak."
  ],
  legs: [
    { name: "Table View to Milnerton", items: [
      { kind: "hazard", title: "Robots on the R27", detail: "Traffic lights all the way through Table View and Milnerton. Queues build from about 6:30." },
      { kind: "lane", title: "MyCiTi lanes", detail: "Bus lanes run along parts of the R27. Stay out of them; they're enforced." },
      { kind: "weather", title: "Southeaster and sand", detail: "Strong summer wind blows sand across the road near the beachfront. Slow down when visibility drops." }
    ]},
    { name: "Milnerton to Cape Town City Centre", items: [
      { kind: "tip", title: "M5 and N1 alternative", detail: "From Milnerton, the M5 to the Koeberg interchange and the N1 can be quicker when Marine Drive is jammed." },
      { kind: "lane", title: "Into town", detail: "The R27 runs past Paarden Eiland towards the Foreshore. Take the N1 for the CBD and Waterfront exits." }
    ]}
  ]
},
/* 33 */ {
  id: "dundee-durban", a: ["dundee"], b: ["durban"],
  title: "Dundee to Durban", route: "R602 through Glencoe, N11 to Ladysmith, then the N3", distanceKm: 320, driveTime: "3½–4 hours",
  roads: ["N3", "N11", "R602"], places: ["Dundee", "Glencoe", "Wasbank", "Ladysmith", "Colenso", "Estcourt", "Mooi River", "Howick", "Pietermaritzburg", "Pinetown"],
  summary: "Country roads across to Ladysmith, then the N3 toll road down through the Midlands to Durban.",
  before: [
    "Have a card or cash for the N3 tolls: a ramp toll where you join at the Ladysmith (N11) interchange, then the Mooi and Mariannhill plazas.",
    "Save the N3 Helpline: 0800 63 43 57 (24 hours).",
    "Do the stretch to Ladysmith in daylight if you can: animals on the road and few streetlights.",
    "Check @N3Route on X for closures before you leave, especially on holiday weekends."
  ],
  legs: [
    { name: "Dundee to Ladysmith", items: [
      { kind: "hazard", title: "Rural roads to the N11", detail: "Two-lane road through Glencoe and past Wasbank. Watch for livestock, pedestrians and slow trucks, especially at dusk." },
      { kind: "hazard", title: "Potholes and broken edges", detail: "Provincial roads in northern KZN are often patched or potholed. Slow down where the surface breaks up and don't swerve suddenly." },
      { kind: "fuel", title: "Ladysmith", detail: "The last big town before the N3, with fuel and food." }
    ]},
    { name: "Ladysmith to Pietermaritzburg", items: [
      { kind: "toll", title: "Ladysmith (N11) ramp toll", detail: "Joining the N3 southbound at the N11 interchange is tolled." },
      { kind: "fuel", title: "Stops at Estcourt and Mooi River", detail: "Large fuel and food stops just off the N3, a good break halfway." },
      { kind: "toll", title: "Mooi Toll Plaza", detail: "Mainline plaza near Mooi River. The Mooi River off-ramps are tolled too." },
      { kind: "hazard", title: "Town Hill", detail: "Long, steep hill between Hilton and Pietermaritzburg. Slow trucks, and often misty early in the morning." }
    ]},
    { name: "Pietermaritzburg to Durban", items: [
      { kind: "lane", title: "Pietermaritzburg bypass", detail: "The N3 skirts the city with exits close together. Stay in the through lanes unless you're stopping." },
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "The last plaza, near Pinetown. Queues build on Friday afternoons and before long weekends." },
      { kind: "hazard", title: "Steep hills around Pinetown", detail: "Loaded trucks crawl uphill and brake hard going down. Keep a big gap." },
      { kind: "tip", title: "R33 via Greytown", detail: "Looks shorter on the map, through Pomeroy, Tugela Ferry and Greytown, but it's slower: rural single-lane road with speed humps, potholes and livestock. Only in daylight, and best if you know it." }
    ]}
  ]
},
/* 34 */ {
  id: "dundee-nqutu", a: ["dundee"], b: ["nqutu"],
  title: "Dundee to Nqutu", route: "R68 east", distanceKm: 50, driveTime: "45 minutes to 1 hour",
  roads: ["R68"], places: ["Dundee", "Nqutu", "Isandlwana"],
  summary: "A short rural run on the R68 through battlefields country.",
  before: [
    "Fill up in Dundee; there's little in between.",
    "Drive in daylight if you can: livestock and pedestrians are common and there are few streetlights.",
    "Minibus taxis stop often, so keep a safe following distance."
  ],
  legs: [
    { name: "Dundee to Nqutu", items: [
      { kind: "lane", title: "Leaving Dundee", detail: "The R68 and R33 share the road for the first few kilometres east of Dundee. Stay on the R68 where the R33 splits off towards Vryheid." },
      { kind: "hazard", title: "Livestock and pedestrians", detail: "Cattle, goats and people on or beside the road, especially near villages and at dusk." },
      { kind: "hazard", title: "Rough sections", detail: "Potholes and broken edges in places. Slow down and don't swerve suddenly." },
      { kind: "safety", title: "Taxis stopping", detail: "Minibus taxis pull over to drop off and pick up, sometimes without warning. Keep a gap and don't overtake on blind rises." },
      { kind: "tip", title: "Battlefields", detail: "Isandlwana and Rorke's Drift are signposted in this area if you're visiting the battlefields." }
    ]}
  ]
},
/* 35 */ {
  id: "joburg-southcoast", a: ["joburg", "pretoria"], b: ["southcoast"],
  title: "Johannesburg to Margate (South Coast)", route: "N3 to Durban, then the N2 south and the R61", distanceKm: 690, driveTime: "7½–8½ hours",
  roads: ["N3", "N2", "R61"], places: ["Heidelberg", "Villiers", "Harrismith", "Van Reenen", "Ladysmith", "Estcourt", "Mooi River", "Pietermaritzburg", "Pinetown", "Amanzimtoti", "Scottburgh", "Hibberdene", "Port Shepstone", "Shelly Beach", "Uvongo", "Margate"],
  summary: "The N3 down to Durban, then south along the coast. One of the busiest holiday drives in December.",
  before: [
    "Have a card or cash for five N3 mainline plazas (De Hoek, Wilge, Tugela, Mooi and Mariannhill), plus ramp tolls near Port Shepstone if you exit there.",
    "Save the N3 Helpline: 0800 63 43 57 (24 hours).",
    "On peak December days, leave very early; the N3 can crawl from Harrismith onwards.",
    "Plan a break at Harrismith or Mooi River.",
    "Check @N3Route on X for closures before you leave."
  ],
  legs: [
    { name: "Johannesburg to Harrismith", items: [
      { kind: "toll", title: "De Hoek Toll Plaza", detail: "The first plaza, just past Heidelberg." },
      { kind: "toll", title: "Wilge Toll Plaza", detail: "Mainline plaza on the Free State stretch between Villiers and Harrismith." },
      { kind: "hazard", title: "Long, straight Free State roads", detail: "Fatigue is the main risk here. Swap drivers or stop if you feel drowsy." },
      { kind: "fuel", title: "Harrismith", detail: "Big 24-hour fuel and food stops just off the N3. Roughly halfway to Durban." }
    ]},
    { name: "Harrismith to Pietermaritzburg", items: [
      { kind: "hazard", title: "Van Reenen's Pass", detail: "Steep, winding pass into KwaZulu-Natal and a major truck route. Expect slow trucks and breakdowns; don't tailgate." },
      { kind: "weather", title: "Mist, and snow in winter", detail: "Thick mist is common on the pass. Snow can close it on cold winter days." },
      { kind: "toll", title: "Tugela Toll Plaza", detail: "Mainline plaza near Ladysmith." },
      { kind: "toll", title: "Mooi Toll Plaza", detail: "Mainline plaza near Mooi River." },
      { kind: "hazard", title: "Town Hill", detail: "Long, steep descent into Pietermaritzburg. Slow trucks, and often misty in the morning." }
    ]},
    { name: "Pietermaritzburg to Durban", items: [
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "The last N3 plaza, near Pinetown. Queues build before long weekends." },
      { kind: "lane", title: "EB Cloete interchange", detail: "Near Westville, follow signs for the N2 south (Port Shepstone) instead of carrying on into Durban. Get into the right lanes early; it's a busy interchange." }
    ]},
    { name: "Durban to Margate", items: [
      { kind: "hazard", title: "Amanzimtoti and Kingsburgh", detail: "Busy with local traffic and exits close together. Keep a gap and signal early." },
      { kind: "hazard", title: "Single-carriageway sections", detail: "The N2 narrows south of Scottburgh in places. Don't overtake on blind rises." },
      { kind: "toll", title: "Ramp tolls near Port Shepstone", detail: "The Umtentweni and Izotsha (Shelly Beach) ramps are tolled." },
      { kind: "lane", title: "Onto the R61", detail: "At Port Shepstone, keep on the coast road for Shelly Beach, Uvongo and Margate. The N2 turns inland toward Kokstad." }
    ]}
  ]
},
/* 36 */ {
  id: "durban-stlucia", a: ["durban"], b: ["stlucia"],
  title: "Durban to St Lucia", route: "N2 north via Ballito and Empangeni, then the R618 from Mtubatuba", distanceKm: 250, driveTime: "2½–3 hours",
  roads: ["N2", "R618"], places: ["Umhlanga", "King Shaka", "Tongaat", "oThongathi", "Ballito", "KwaDukuza", "Stanger", "Gingindlovu", "Mtunzini", "Empangeni", "Richards Bay", "Mtubatuba", "St Lucia"],
  summary: "The N2 North Coast toll road, then sugar-cane country and a short run to the estuary.",
  before: [
    "Have a card or cash for the North Coast toll plazas, including oThongathi, Mvoti and Mtunzini.",
    "On holiday weekends, leave Durban early; traffic towards Ballito backs up.",
    "Arrive in daylight. Hippos walk the streets of St Lucia at night, so drive slowly after dark.",
    "Fill up in Empangeni or Mtubatuba."
  ],
  legs: [
    { name: "Durban to KwaDukuza", items: [
      { kind: "hazard", title: "Umhlanga and Gateway traffic", detail: "The N2 near Umhlanga and Mount Edgecombe is busy at peak times." },
      { kind: "toll", title: "oThongathi Toll Plaza", detail: "Mainline plaza between King Shaka Airport and Ballito." },
      { kind: "toll", title: "Mvoti Toll Plaza", detail: "Mainline plaza near KwaDukuza (Stanger)." }
    ]},
    { name: "KwaDukuza to Empangeni", items: [
      { kind: "toll", title: "Mtunzini Toll Plaza", detail: "Mainline plaza near Mtunzini." },
      { kind: "hazard", title: "Cane and timber trucks", detail: "Heavy trucks join from farm roads and slow down on hills. Watch for mud on the road in the harvest season." }
    ]},
    { name: "Empangeni to St Lucia", items: [
      { kind: "hazard", title: "Pedestrians and livestock", detail: "Further north, people and animals use the road verges. Take extra care at dusk." },
      { kind: "lane", title: "Turn off at Mtubatuba", detail: "Leave the N2 at Mtubatuba and take the R618 east to St Lucia, about 25 km." },
      { kind: "safety", title: "Hippos after dark", detail: "Hippos graze in St Lucia town at night. Drive slowly, and don't get out to look." }
    ]}
  ]
},
/* 37 */ {
  id: "joburg-eastlondon", a: ["joburg", "pretoria"], b: ["eastlondon"],
  title: "Johannesburg to East London", route: "N1 to Bloemfontein, then the N6 via Aliwal North and Komani", distanceKm: 990, driveTime: "10–11 hours",
  roads: ["N1", "N6"], places: ["Grasmere", "Parys", "Kroonstad", "Winburg", "Brandfort", "Bloemfontein", "Reddersburg", "Smithfield", "Rouxville", "Aliwal North", "Jamestown", "Penhoek", "Komani", "Queenstown", "Cathcart", "Stutterheim"],
  summary: "A long day: fast N1 freeway to Bloemfontein, then the toll-free N6 across the Orange River and through the Eastern Cape highlands.",
  before: [
    "Have a card or cash for the N1 tolls (Grasmere, Vaal and Verkeerdevlei). The N6 has no tolls.",
    "It's a 10-hour-plus drive. Consider an overnight stop in Bloemfontein or Aliwal North.",
    "Penhoek Pass gets mist, and snow in winter. Check conditions before you go.",
    "Fill up in Bloemfontein and Aliwal North; towns are far apart on the N6."
  ],
  legs: [
    { name: "Johannesburg to Bloemfontein", items: [
      { kind: "toll", title: "Three N1 toll plazas", detail: "Grasmere (south of Joburg), Vaal (near Parys) and Verkeerdevlei (near Brandfort)." },
      { kind: "hazard", title: "Long, straight Free State roads", detail: "Fatigue is the main risk. Swap drivers or stop if you feel drowsy." },
      { kind: "lane", title: "Onto the N6", detail: "The N6 starts at an interchange on the N1 western bypass around Bloemfontein. Follow the N6 signs for Aliwal North." }
    ]},
    { name: "Bloemfontein to Aliwal North", items: [
      { kind: "hazard", title: "Single carriageway with trucks", detail: "Mostly two-lane road with heavy trucks. Only overtake where you can see well ahead." },
      { kind: "safety", title: "Small towns", detail: "The N6 runs through or past Reddersburg, Smithfield and Rouxville. Slow down for the town speed limits." },
      { kind: "fuel", title: "Aliwal North", detail: "Fuel and food just after crossing the Orange River into the Eastern Cape." }
    ]},
    { name: "Aliwal North to East London", items: [
      { kind: "weather", title: "Penhoek Pass", detail: "Mountain pass north of Komani. Mist is common, and snow can close it in winter." },
      { kind: "hazard", title: "Livestock and potholes", detail: "Animals on the road and patched surfaces are common in the Eastern Cape. Avoid driving this stretch at night." },
      { kind: "lane", title: "Through Komani", detail: "The N6 runs through Komani (Queenstown) with robots and traffic circles. Follow the N6 signs for East London." },
      { kind: "lane", title: "East London end", detail: "The N6 ends at the N2 interchange on the edge of the city." }
    ]}
  ]
},
/* 38 */ {
  id: "bloem-durban", a: ["bloem"], b: ["durban"],
  title: "Bloemfontein to Durban", route: "N1 to Winburg, the N5 via Bethlehem to Harrismith, then the N3", distanceKm: 650, driveTime: "7–8 hours",
  roads: ["N1", "N5", "N3"], places: ["Brandfort", "Winburg", "Senekal", "Paul Roux", "Bethlehem", "Kestell", "Harrismith", "Van Reenen", "Ladysmith", "Estcourt", "Mooi River", "Pietermaritzburg", "Pinetown"],
  summary: "Free State farm roads through Bethlehem, then the N3 over Van Reenen's Pass and down to the coast.",
  before: [
    "Have a card or cash for the tolls: Verkeerdevlei on the N1, then Tugela, Mooi and Mariannhill on the N3.",
    "Save the N3 Helpline: 0800 63 43 57 (24 hours).",
    "Try to cross Van Reenen's Pass in daylight; mist is common.",
    "Fill up in Bethlehem or Harrismith."
  ],
  legs: [
    { name: "Bloemfontein to Bethlehem", items: [
      { kind: "toll", title: "Verkeerdevlei Toll Plaza", detail: "On the N1 near Brandfort, before you turn off at Winburg." },
      { kind: "lane", title: "Onto the N5 at Winburg", detail: "Leave the N1 at the Winburg interchange and follow the N5 east towards Senekal and Bethlehem." },
      { kind: "hazard", title: "Two-lane farm road", detail: "The N5 is mostly single carriageway with trucks and farm vehicles. Watch for crossroads without robots." },
      { kind: "safety", title: "Through Senekal", detail: "The N5 runs through the town centre. Slow down for pedestrians and intersections." }
    ]},
    { name: "Bethlehem to Harrismith", items: [
      { kind: "lane", title: "Through Bethlehem", detail: "The N5 runs through the city centre on one-way streets. Follow the N5 signs carefully." },
      { kind: "fuel", title: "Bethlehem", detail: "Plenty of fuel and food; a good break before the N3." },
      { kind: "lane", title: "Onto the N3 at Harrismith", detail: "The N5 ends at an interchange with the N3. Join the N3 towards Durban." }
    ]},
    { name: "Harrismith to Pietermaritzburg", items: [
      { kind: "hazard", title: "Van Reenen's Pass", detail: "Steep, winding pass into KwaZulu-Natal and a major truck route. Expect slow trucks and breakdowns." },
      { kind: "weather", title: "Mist, and snow in winter", detail: "Thick mist is common on the pass. Snow can close it on cold winter days." },
      { kind: "toll", title: "Tugela Toll Plaza", detail: "Mainline plaza near Ladysmith." },
      { kind: "toll", title: "Mooi Toll Plaza", detail: "Mainline plaza near Mooi River." },
      { kind: "hazard", title: "Town Hill", detail: "Long, steep descent into Pietermaritzburg. Slow trucks, and often misty in the morning." }
    ]},
    { name: "Pietermaritzburg to Durban", items: [
      { kind: "lane", title: "Pietermaritzburg bypass", detail: "The N3 skirts the city with exits close together. Stay in the through lanes." },
      { kind: "toll", title: "Mariannhill Toll Plaza", detail: "The last plaza, near Pinetown. Queues build before long weekends." },
      { kind: "hazard", title: "Steep hills around Pinetown", detail: "Loaded trucks crawl uphill and brake hard going down. Keep a big gap." }
    ]}
  ]
}
];


/* Approximate corridors for each guide, used to check that a pinned driver report is actually on this trip.
   Each path is an ordered list of [lat, lng] waypoints; tol is how far from the line (in km) still counts. */
window.HKR_ROUTE_PATHS = (() => {
  const P = {
    joburg: [-26.204, 28.047], pretoria: [-25.746, 28.188], durban: [-29.858, 31.021], capetown: [-33.925, 18.424],
    pinetown: [-29.817, 30.857], pmb: [-29.601, 30.379], howick: [-29.477, 30.231], mooi: [-29.211, 29.994],
    estcourt: [-29.008, 29.871], ladysmith: [-28.560, 29.781], vanreenen: [-28.371, 29.384], harrismith: [-28.273, 29.127],
    villiers: [-27.031, 28.600], heidelberg: [-26.504, 28.358], grasmere: [-26.43, 27.88], parys: [-26.90, 27.45],
    kroonstad: [-27.65, 27.23], ventersburg: [-28.08, 27.14], winburg: [-28.52, 27.01], brandfort: [-28.70, 26.46],
    bloem: [-29.118, 26.214], colesberg: [-30.72, 25.10], hanover: [-31.07, 24.44], richmond: [-31.42, 23.94],
    threesisters: [-31.85, 23.10], beaufortwest: [-32.357, 22.583], laingsburg: [-33.20, 20.86], touwsriver: [-33.34, 20.03],
    dedoorns: [-33.48, 19.67], worcester: [-33.646, 19.448], paarl: [-33.734, 18.962],
    centurion: [-25.86, 28.19], midrand: [-25.99, 28.13], sandton: [-26.107, 28.057],
    hammanskraal: [-25.40, 28.28], belabela: [-24.88, 28.29], modimolle: [-24.70, 28.41], mookgophong: [-24.52, 28.71],
    mokopane: [-24.19, 29.01], polokwane: [-23.904, 29.469],
    bronkhorstspruit: [-25.81, 28.74], emalahleni: [-25.871, 29.233], middelburg: [-25.775, 29.464], belfast: [-25.69, 30.03],
    machadodorp: [-25.67, 30.25], watervalboven: [-25.65, 30.33], ngodwana: [-25.58, 30.67], mbombela: [-25.475, 30.97],
    kaapmuiden: [-25.53, 31.31], malelane: [-25.48, 31.51],
    dullstroom: [-25.42, 30.11], lydenburg: [-25.10, 30.45], sabie: [-25.10, 30.78], graskop: [-24.93, 30.84],
    lanseria: [-25.94, 27.93], hartbeespoort: [-25.74, 27.85], brits: [-25.63, 27.78], rustenburg: [-25.667, 27.242], suncity: [-25.335, 27.093],
    noupoort: [-31.19, 24.95], middelburgec: [-31.49, 25.01], cradock: [-32.17, 25.62], cookhouse: [-32.74, 25.81],
    paterson: [-33.43, 25.97], gqeberha: [-33.96, 25.60],
    winterton: [-28.81, 29.53], bergville: [-28.73, 29.35], champagne: [-28.99, 29.37],
    umhlanga: [-29.726, 31.085], kingshaka: [-29.61, 31.12], tongaat: [-29.57, 31.12], ballito: [-29.539, 31.214],
    amanzimtoti: [-30.05, 30.88], umkomaas: [-30.20, 30.80], scottburgh: [-30.29, 30.75], hibberdene: [-30.58, 30.57],
    portshepstone: [-30.74, 30.45], margate: [-30.86, 30.37],
    harding: [-30.58, 29.88], kokstad: [-30.55, 29.42], mountayliff: [-30.81, 29.37], mountfrere: [-30.91, 28.98],
    qumbu: [-31.16, 28.87], mthatha: [-31.589, 28.784], dutywa: [-32.10, 28.31], butterworth: [-32.33, 28.15], eastlondon: [-33.015, 27.912],
    colchester: [-33.69, 25.82], makhanda: [-33.31, 26.53], peddie: [-33.20, 27.12], qonce: [-32.88, 27.40], berlin: [-32.89, 27.58],
    somersetwest: [-34.08, 18.85], sirlowrys: [-34.15, 18.93], caledon: [-34.23, 19.43], riviersonderend: [-34.15, 19.91],
    swellendam: [-34.02, 20.44], riversdale: [-34.09, 21.26], mosselbay: [-34.18, 22.13], george: [-33.963, 22.462],
    wilderness: [-33.99, 22.58], sedgefield: [-34.02, 22.80], knysna: [-34.036, 23.048], plett: [-34.05, 23.37],
    stormsriver: [-33.97, 23.88], humansdorp: [-34.03, 24.77], jbay: [-34.05, 24.92],
    gordonsbay: [-34.16, 18.87], kleinmond: [-34.34, 19.03], grabouw: [-34.15, 19.02], houwhoek: [-34.21, 19.15],
    botrivier: [-34.23, 19.21], hermanus: [-34.418, 19.235],
    bellville: [-33.90, 18.63], kuilsriver: [-33.92, 18.68], stellenbosch: [-33.934, 18.861], ctairport: [-33.97, 18.60],
    polkadraai: [-33.96, 18.75], hospitalbend: [-33.95, 18.47], woodstock: [-33.93, 18.45],
    milnerton: [-33.87, 18.50], tableview: [-33.82, 18.49], melkbos: [-33.72, 18.44], yzerfontein: [-33.34, 18.16],
    langebaan: [-33.09, 18.03], vredenburg: [-32.91, 17.99],
    soweto: [-26.25, 27.86], nasrec: [-26.23, 27.98], booysens: [-26.23, 28.02], jhbcbd: [-26.204, 28.047],
    braamfontein: [-26.19, 28.03], westernbypass: [-26.13, 27.95], rivonia: [-26.06, 28.06],
    benoni: [-26.19, 28.32], boksburg: [-26.21, 28.26], germiston: [-26.22, 28.17], bedfordview: [-26.18, 28.13],
    kempton: [-26.10, 28.23], edenvale: [-26.14, 28.15], gillooly: [-26.16, 28.11],
    krugersdorp: [-26.10, 27.77], roodepoort: [-26.16, 27.87], florida: [-26.17, 27.91], constantiakloof: [-26.13, 27.91],
    randburg: [-26.09, 27.97], muldersdrift: [-26.04, 27.85],
    irene: [-25.88, 28.22], lyttelton: [-25.84, 28.20], fountains: [-25.77, 28.20], ptacbd: [-25.746, 28.188],
    umlazi: [-29.97, 30.88], isipingo: [-29.99, 30.93], prospecton: [-29.97, 30.94], mobeni: [-29.94, 30.96], dbncbd: [-29.858, 31.021],
    westville: [-29.83, 30.93], ebcloete: [-29.84, 30.96], mayville: [-29.84, 30.99],
    durbannorth: [-29.79, 31.04], virginia: [-29.77, 31.06], mabhida: [-29.83, 31.03],
    camperdown: [-29.73, 30.53], catoridge: [-29.74, 30.59], hammarsdale: [-29.79, 30.66], mariannhill: [-29.84, 30.83],
    tygervalley: [-33.875, 18.63], plattekloof: [-33.87, 18.57], goodwood: [-33.91, 18.55], paarden: [-33.91, 18.47],
    tokai: [-34.06, 18.45], constantia: [-34.02, 18.45], wynberg: [-34.00, 18.47], newlands: [-33.97, 18.46], rondebosch: [-33.96, 18.47],
    khayelitsha: [-34.04, 18.67], mitchellsplain: [-34.05, 18.62], langa: [-33.94, 18.53],
    dundee: [-28.168, 30.234], glencoe: [-28.18, 30.15], wasbank: [-28.32, 30.10], nqutu: [-28.22, 30.67],
    helpmekaar: [-28.37, 30.38], pomeroy: [-28.56, 30.43], tugelaferry: [-28.75, 30.45], greytown: [-29.06, 30.59],
    kwadukuza: [-29.34, 31.29], gingindlovu: [-29.02, 31.58], mtunzini: [-28.95, 31.75], empangeni: [-28.75, 31.89],
    mtubatuba: [-28.42, 32.18], stlucia: [-28.38, 32.41],
    reddersburg: [-29.65, 26.17], smithfield: [-30.21, 26.53], rouxville: [-30.42, 26.83], aliwal: [-30.69, 26.71],
    jamestown: [-31.12, 26.81], komani: [-31.90, 26.88], cathcart: [-32.30, 27.14], stutterheim: [-32.57, 27.42],
    senekal: [-28.32, 27.62], paulroux: [-28.30, 27.95], bethlehem: [-28.23, 28.31], kestell: [-28.31, 28.70]
  };
  const path = (...k) => k.map(x => { if (!P[x]) throw new Error("No coordinates for " + x); return P[x]; });
  const LONG = 25, SUBURB = 6;
  return {
    "durban-joburg": { tol: LONG, paths: [path("durban", "pinetown", "pmb", "howick", "mooi", "estcourt", "ladysmith", "vanreenen", "harrismith", "villiers", "heidelberg", "joburg", "pretoria")] },
    "joburg-capetown": { tol: LONG, paths: [path("pretoria", "joburg", "grasmere", "parys", "kroonstad", "winburg", "bloem", "colesberg", "hanover", "richmond", "threesisters", "beaufortwest", "laingsburg", "touwsriver", "dedoorns", "worcester", "paarl", "capetown")] },
    "joburg-bloem": { tol: LONG, paths: [path("pretoria", "joburg", "grasmere", "parys", "kroonstad", "ventersburg", "winburg", "brandfort", "bloem")] },
    "pretoria-joburg": { tol: 8, paths: [path("pretoria", "centurion", "midrand", "sandton", "joburg")] },
    "pretoria-polokwane": { tol: LONG, paths: [path("joburg", "pretoria", "hammanskraal", "belabela", "modimolle", "mookgophong", "mokopane", "polokwane")] },
    "pretoria-kruger": { tol: LONG, paths: [path("joburg", "pretoria", "bronkhorstspruit", "emalahleni", "middelburg", "belfast", "machadodorp", "watervalboven", "ngodwana", "mbombela", "kaapmuiden", "malelane")] },
    "joburg-panorama": { tol: LONG, paths: [path("joburg", "emalahleni", "middelburg", "belfast", "dullstroom", "lydenburg", "sabie", "graskop"), path("pretoria", "bronkhorstspruit", "emalahleni")] },
    "joburg-suncity": { tol: 15, paths: [path("joburg", "lanseria", "hartbeespoort", "brits", "rustenburg", "suncity"), path("pretoria", "hartbeespoort")] },
    "joburg-gqeberha": { tol: LONG, paths: [path("pretoria", "joburg", "grasmere", "parys", "kroonstad", "winburg", "bloem", "colesberg", "noupoort", "middelburgec", "cradock", "cookhouse", "paterson", "gqeberha")] },
    "durban-drakensberg": { tol: 15, paths: [path("durban", "pinetown", "pmb", "howick", "mooi", "estcourt", "winterton", "bergville"), path("winterton", "champagne")] },
    "durban-ballito": { tol: SUBURB, paths: [path("dbncbd", "durbannorth", "umhlanga", "kingshaka", "tongaat", "ballito")] },
    "durban-southcoast": { tol: 10, paths: [path("dbncbd", "amanzimtoti", "umkomaas", "scottburgh", "hibberdene", "portshepstone", "margate")] },
    "durban-eastlondon": { tol: LONG, paths: [path("durban", "amanzimtoti", "scottburgh", "portshepstone", "harding", "kokstad", "mountayliff", "mountfrere", "qumbu", "mthatha", "dutywa", "butterworth", "eastlondon")] },
    "gqeberha-eastlondon": { tol: LONG, paths: [path("gqeberha", "colchester", "makhanda", "peddie", "qonce", "berlin", "eastlondon")] },
    "capetown-gqeberha": { tol: LONG, paths: [path("capetown", "somersetwest", "sirlowrys", "caledon", "riviersonderend", "swellendam", "riversdale", "mosselbay", "george", "wilderness", "sedgefield", "knysna", "plett", "stormsriver", "humansdorp", "jbay", "gqeberha")] },
    "capetown-gardenroute": { tol: LONG, paths: [path("capetown", "somersetwest", "sirlowrys", "caledon", "riviersonderend", "swellendam", "riversdale", "mosselbay", "george", "wilderness", "sedgefield", "knysna")] },
    "capetown-hermanus": { tol: 10, paths: [path("capetown", "somersetwest", "sirlowrys", "grabouw", "houwhoek", "botrivier", "hermanus"), path("somersetwest", "gordonsbay", "kleinmond", "hermanus")] },
    "capetown-stellenbosch": { tol: SUBURB, paths: [path("capetown", "bellville", "kuilsriver", "stellenbosch"), path("ctairport", "polkadraai", "stellenbosch"), path("capetown", "ctairport", "somersetwest", "stellenbosch")] },
    "ctairport-capetown": { tol: 4, paths: [path("ctairport", "hospitalbend", "woodstock", "capetown")] },
    "capetown-langebaan": { tol: 10, paths: [path("capetown", "milnerton", "tableview", "melkbos", "yzerfontein", "langebaan", "vredenburg")] },
    "soweto-joburg": { tol: SUBURB, paths: [path("soweto", "nasrec", "booysens", "jhbcbd", "braamfontein", "sandton"), path("soweto", "westernbypass", "randburg", "rivonia", "sandton")] },
    "eastrand-joburg": { tol: SUBURB, paths: [path("benoni", "boksburg", "germiston", "bedfordview", "jhbcbd"), path("kempton", "edenvale", "gillooly", "sandton"), path("boksburg", "bedfordview", "gillooly")] },
    "westrand-sandton": { tol: SUBURB, paths: [path("krugersdorp", "roodepoort", "florida", "constantiakloof", "randburg", "sandton"), path("krugersdorp", "muldersdrift", "westernbypass", "rivonia", "sandton")] },
    "centurion-ptacbd": { tol: 4, paths: [path("centurion", "irene", "lyttelton", "fountains", "ptacbd"), path("centurion", "lyttelton", "ptacbd")] },
    "umlazi-dbncbd": { tol: 4, paths: [path("umlazi", "isipingo", "prospecton", "mobeni", "dbncbd")] },
    "pinetown-dbncbd": { tol: 4, paths: [path("pinetown", "westville", "ebcloete", "mayville", "dbncbd")] },
    "umhlanga-dbncbd": { tol: 4, paths: [path("umhlanga", "virginia", "durbannorth", "mabhida", "dbncbd")] },
    "pmb-durban": { tol: SUBURB, paths: [path("pmb", "camperdown", "catoridge", "hammarsdale", "mariannhill", "pinetown", "westville", "ebcloete", "dbncbd")] },
    "bellville-capetown": { tol: 4, paths: [path("bellville", "tygervalley", "plattekloof", "goodwood", "paarden", "capetown")] },
    "southern-capetown": { tol: 4, paths: [path("tokai", "constantia", "wynberg", "newlands", "rondebosch", "hospitalbend", "capetown")] },
    "khayelitsha-capetown": { tol: 5, paths: [path("khayelitsha", "mitchellsplain", "ctairport", "langa", "hospitalbend", "capetown")] },
    "tableview-capetown": { tol: 4, paths: [path("tableview", "milnerton", "paarden", "capetown")] },
    "dundee-durban": { tol: 20, paths: [path("dundee", "glencoe", "wasbank", "ladysmith", "estcourt", "mooi", "howick", "pmb", "pinetown", "durban"), path("dundee", "helpmekaar", "pomeroy", "tugelaferry", "greytown", "pmb")] },
    "dundee-nqutu": { tol: 8, paths: [path("dundee", "nqutu")] },
    "joburg-southcoast": { tol: LONG, paths: [path("pretoria", "joburg", "heidelberg", "villiers", "harrismith", "vanreenen", "ladysmith", "estcourt", "mooi", "howick", "pmb", "pinetown", "westville", "amanzimtoti", "umkomaas", "scottburgh", "hibberdene", "portshepstone", "margate")] },
    "durban-stlucia": { tol: 15, paths: [path("dbncbd", "umhlanga", "kingshaka", "tongaat", "ballito", "kwadukuza", "gingindlovu", "mtunzini", "empangeni", "mtubatuba", "stlucia")] },
    "joburg-eastlondon": { tol: LONG, paths: [path("pretoria", "joburg", "grasmere", "parys", "kroonstad", "winburg", "brandfort", "bloem", "reddersburg", "smithfield", "rouxville", "aliwal", "jamestown", "komani", "cathcart", "stutterheim", "eastlondon")] },
    "bloem-durban": { tol: LONG, paths: [path("bloem", "brandfort", "winburg", "senekal", "paulroux", "bethlehem", "kestell", "harrismith", "vanreenen", "ladysmith", "estcourt", "mooi", "howick", "pmb", "pinetown", "durban")] }
  };
})();
