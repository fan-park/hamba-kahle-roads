/* Hamba Kahle Roads — built-in route guides.
   General road knowledge for the 20 most-driven trips, written once and shown for free.
   Live driver reports on each route's roads are added on top by app.js.
   Last checked: October 2026. Review these every few months: plazas, closures and road layouts change.

   Each guide is written in one direction (from a → b). The site reverses it automatically
   when someone drives the other way. Leg names must use the form "X to Y". */

window.HKR_PLACES = {
  joburg:      ["johannesburg", "joburg", "jozi", "jhb", "johannesburg cbd", "joburg cbd", "sandton", "randburg", "rosebank", "midrand", "or tambo", "or tambo airport", "roodepoort", "soweto", "germiston", "alberton"],
  pretoria:    ["pretoria", "tshwane", "pta", "centurion", "pretoria cbd", "menlyn", "hatfield"],
  durban:      ["durban", "dbn", "ethekwini", "umhlanga", "pinetown", "westville", "durban cbd"],
  capetown:    ["cape town", "ct", "kaapstad", "cape town cbd", "city bowl", "sea point", "green point", "camps bay", "tamboerskloof", "gardens", "cape town city"],
  ctairport:   ["cape town airport", "cape town international", "cape town international airport", "cpt", "ct airport"],
  bloem:       ["bloemfontein", "bloem", "mangaung"],
  polokwane:   ["polokwane", "pietersburg", "mokopane"],
  kruger:      ["kruger", "kruger park", "kruger national park", "malelane", "malalane", "mbombela", "nelspruit", "komatipoort", "hazyview", "white river", "skukuza", "marloth park", "crocodile bridge"],
  panorama:    ["dullstroom", "graskop", "sabie", "panorama route", "lydenburg", "mashishing", "pilgrim's rest", "pilgrims rest", "blyde river canyon", "god's window"],
  suncity:     ["sun city", "pilanesberg", "rustenburg", "hartbeespoort", "harties"],
  gqeberha:    ["gqeberha", "port elizabeth", "pe", "nelson mandela bay", "kariega", "uitenhage"],
  drakensberg: ["drakensberg", "berg", "champagne valley", "winterton", "bergville", "central berg", "cathedral peak", "royal natal", "underberg"],
  ballito:     ["ballito", "salt rock", "umhlali", "north coast", "kwadukuza", "stanger", "zimbali", "king shaka airport", "king shaka"],
  southcoast:  ["margate", "south coast", "port shepstone", "shelly beach", "scottburgh", "uvongo", "ramsgate", "southbroom", "hibberdene", "umkomaas"],
  eastlondon:  ["east london", "el", "buffalo city", "gonubie"],
  gardenroute: ["garden route", "knysna", "george", "wilderness", "plettenberg bay", "plett", "mossel bay", "sedgefield"],
  hermanus:    ["hermanus", "overberg", "kleinmond", "stanford", "gansbaai"],
  stellenbosch:["stellenbosch", "stellies", "winelands", "somerset west"],
  langebaan:   ["langebaan", "west coast", "west coast national park", "saldanha", "paternoster", "velddrif", "yzerfontein", "jacobsbaai"]
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
  title: "Pretoria to Polokwane", route: "N1 North via Bela-Bela, Modimolle and Mokopane", distanceKm: 270, driveTime: "About 3 hours",
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
    "From Joburg, take the N12 east to join the N4 at eMalahleni.",
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
      { kind: "lane", title: "N12 east to eMalahleni", detail: "From Joburg, take the N12 to join the N4 at eMalahleni." },
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
      { kind: "lane", title: "Joining the N2", detail: "The N10 meets the N2 about 45 km from Gqeberha. Turn west for the city." }
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
  title: "Durban to Ballito", route: "N2 North via Umhlanga and King Shaka Airport", distanceKm: 45, driveTime: "35–50 minutes",
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
  title: "Durban to Margate (South Coast)", route: "N2 South via Amanzimtoti and Scottburgh, then the R61", distanceKm: 125, driveTime: "About 1½ hours",
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
      { kind: "safety", title: "Stay on the N2", detail: "Don't take unfamiliar off-ramps or follow detours into nearby areas. If your satnav suggests a back route, stay on the N2." },
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
}
];
