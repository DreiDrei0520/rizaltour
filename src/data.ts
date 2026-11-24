export type Photo = {
  src: string
  caption: string
  credit: string
}

export type Pano = {
  faces: [string, string, string, string, string, string]
  sourceUrl: string
  credit: string
  resolution: string
  captured: string
}

export type Scene = {
  id: string
  title: string
  shortTitle: string
  coverUrl: string
  description: string
  significance: string
  hotspotLabel: string
  details: string[]
  photos: Photo[]
  pano?: Pano
}

export type Spot = {
  id: string
  x: number
  y: number
  label: string
  kind: 'move' | 'info'
  target?: string
  title?: string
  body?: string
  photo?: string
}

const credit = {
  ralff: 'Ralff Nestor Nacor · Wikimedia Commons · CC BY-SA 4.0',
  patrick: 'Patrick Roque · Wikimedia Commons · CC BY-SA 4.0',
  ramon: 'Ramon FVelasquez · Wikimedia Commons · CC BY-SA 3.0',
  xiquin: 'xiquinhosilva · Wikimedia Commons · CC BY 2.0',
  tagaaplaya: 'Tagaaplaya · Wikimedia Commons · CC BY-SA 4.0',
  tsamba: 'Tsambaproductions · Wikimedia Commons · CC BY-SA 3.0',
  chadel: 'Chadelvalle · Wikimedia Commons · CC BY-SA 3.0',
}

const panoCredit = {
  gardens: 'Brian Salter · 360Cities · 14,898 × 7,449 spherical',
  sala: 'Brian Salter · 360Cities · 14,978 × 7,489 spherical',
  dining: 'Brian Salter · 360Cities · 14,982 × 7,491 spherical',
}

export const scenes: Scene[] = [
  {
    id: 'facade',
    title: 'Facade • The Green Bahay na Bato',
    shortTitle: 'Facade',
    coverUrl: '/assets/tour/exterior-front-2023.jpg',
    description: 'The replica of the Mercado family home stands at the corner of Francisco Mercado and José P. Rizal Streets, a short walk from the St. John the Baptist Parish Church where Rizal was baptized.',
    significance: 'The present house was reconstructed in 1950 by National Artist Juan F. Nakpil using funds donated by Filipino schoolchildren. It was repainted green in 2009 to recall the meaning of “Mercado” (market) and Rizal’s family identity.',
    hotspotLabel: 'About the facade',
    details: [
      'Two storeys: adobe stone and brick below, hardwood above.',
      'Capiz shell sliding windows and a red ceramic tile roof.',
      'Narra floors and wide capiz-lit windows in the upper living areas.',
      'Declared a National Shrine (Level 1) under Presidential Decree No. 105 of 1973.',
    ],
    photos: [
      { src: '/assets/tour/exterior-front-2023.jpg', caption: 'Northern facade and main entrance (March 2023).', credit: credit.ralff },
      { src: '/assets/tour/facade-2023.jpg', caption: 'The shrine’s familiar green-and-white facade as of November 2023.', credit: credit.tagaaplaya },
      { src: '/assets/tour/main-door-marker.jpg', caption: 'Main door with the “Birthplace of José Rizal” historical marker.', credit: credit.ramon },
      { src: '/assets/tour/ph-flag.jpg', caption: 'Philippine flag flying outside the shrine in Calamba City.', credit: credit.patrick },
      { src: '/assets/tour/exterior-road-2021.jpg', caption: 'The shrine as seen from J.P. Rizal Street.', credit: credit.patrick },
    ],
  },
  {
    id: 'sides',
    title: 'Outside Walls • Street View',
    shortTitle: 'Exterior',
    coverUrl: '/assets/tour/exterior-left-2017.jpg',
    description: 'Walk around the house to see how the stone ground floor, wooden upper level, and red tiles work together as a tropical Spanish-era residence.',
    significance: 'The thick masonry base protected the living quarters from floods, heat, and humidity, while the lighter hardwood upper floor allowed air to move through the capiz windows.',
    hotspotLabel: 'Look at the architecture',
    details: [
      'Ground floor: servants’ quarters, workroom, and food storeroom.',
      'Upper floor: family living quarters reached by a wide stairway.',
      'Sliding capiz panels diffuse daylight while keeping privacy.',
      'The original house was demolished after the 1890 eviction of the Rizal family.',
    ],
    photos: [
      { src: '/assets/tour/exterior-left-2017.jpg', caption: 'Left side of the shrine from Rizal Street (2017).', credit: credit.patrick },
      { src: '/assets/tour/exterior-right-2017.jpg', caption: 'Right side of the house with the heritage sign.', credit: credit.patrick },
      { src: '/assets/tour/outdoor-overview.jpg', caption: 'Outdoor view of the house and grounds.', credit: credit.tsamba },
    ],
  },
  {
    id: 'grounds',
    title: 'Gardens • Outside the House',
    shortTitle: 'Gardens 360°',
    coverUrl: '/assets/tour/bahay-kubo-2023.jpg',
    description: 'Look around the wide lawn where young Pepe played, studied nature, and kept a small nipa hut hideaway beside the ancestral house.',
    significance: 'Rizal often recalled the fruits of his childhood garden—atis, santol, tampoy, makopa, plum, balimbing, and kasuy. The nipa hut was his childhood hideaway and workshop.',
    hotspotLabel: 'Look around the garden',
    details: [
      'The bronze statue of young Rizal and his dog was sculpted by Dudley Diaz in 1996.',
      'It was installed for the centennial commemoration of Rizal’s death.',
      'The remains of his parents, Francisco Mercado and Teodora Alonso, are interred on the grounds.',
      'The house showcases Spanish Colonial architecture in hardwood, nipa, and stone.',
    ],
    photos: [
      { src: '/assets/tour/bahay-kubo-2023.jpg', caption: 'Replica nipa hut in the shrine garden (March 2023).', credit: credit.ralff },
      { src: '/assets/tour/young-rizal-dog-2023.jpg', caption: 'Statue of young Rizal with his dog (March 2023).', credit: credit.ralff },
      { src: '/assets/tour/little-rizal-statue.jpg', caption: 'A closer look at the statue of the little José Rizal.', credit: credit.chadel },
      { src: '/assets/tour/outdoor-overview.jpg', caption: 'Outdoor view of the house and grounds.', credit: credit.tsamba },
    ],
    pano: {
      faces: ['/assets/tour/pano/gardens/front.jpg', '/assets/tour/pano/gardens/right.jpg', '/assets/tour/pano/gardens/back.jpg', '/assets/tour/pano/gardens/left.jpg', '/assets/tour/pano/gardens/up.jpg', '/assets/tour/pano/gardens/down.jpg'],
      sourceUrl: 'https://www.360cities.net/image/gardens-of-bahay-ni-dr-jose-rizal-birthplace-of-rizal-calamba-laguna-philippines',
      credit: panoCredit.gardens,
      resolution: '14,898 × 7,449',
      captured: '07 January 2025',
    },
  },
  {
    id: 'galleries',
    title: 'Ground Floor • Museum Galleries 1–3',
    shortTitle: 'Galleries 1–3',
    coverUrl: '/assets/tour/exhibit-01.jpg',
    description: 'The lower level now houses the first three of six galleries: Kaliwanagan (family and childhood), Kapaligiran (Calamba and its environs), and Karunungan (his schooling).',
    significance: 'These exhibits place Rizal inside the world that formed him—his family, the agricultural town of Calamba, and the schools that prepared him for Ateneo Municipal de Manila and the Universidad de Santo Tomás.',
    hotspotLabel: 'See the exhibits',
    details: [
      'Copies of Rizal’s writings and drawings are displayed here.',
      'An original baptismal certificate is part of the collection.',
      'Displays trace his genealogy, his parents’ values, and his ten siblings.',
      'The shrine also uses interactive terminals and an e-learning room.',
    ],
    photos: [
      { src: '/assets/tour/exhibit-01.jpg', caption: 'Exhibit material inside the Rizal Shrine museum.', credit: credit.xiquin },
      { src: '/assets/tour/exhibit-02.jpg', caption: 'Display panels and memorabilia on the lower floor.', credit: credit.xiquin },
      { src: '/assets/tour/interior-overview.jpg', caption: 'Interior view of the ancestral house and museum.', credit: credit.tsamba },
    ],
  },
  {
    id: 'sala',
    title: 'Sala • Formal Living Room',
    shortTitle: 'Sala 360°',
    coverUrl: '/assets/tour/interior-01.jpg',
    description: 'Turn around inside the formal receiving room where the Mercado family welcomed relatives, neighbors, and prominent guests.',
    significance: 'The sala shows the importance of hospitality and conversation in a 19th-century Filipino household—the same setting where young Pepe listened to stories, readings, and ideas.',
    hotspotLabel: 'Examine the sala',
    details: [
      'Period furnishings recreate the family’s daily life.',
      'Capiz shell windows were the “glass” of their time.',
      'A caida (anteroom) links the areas of the upper floor.',
      'The room leads to three bedrooms: boys’, girls’, and parents’.',
    ],
    photos: [
      { src: '/assets/tour/interior-01.jpg', caption: 'Period furniture and capiz-lit interior of the upper floor.', credit: credit.ramon },
      { src: '/assets/tour/interior-02.jpg', caption: 'Another view of the reconstructed living quarters.', credit: credit.ramon },
      { src: '/assets/tour/interior-03.jpg', caption: 'Household furnishings displayed inside the shrine.', credit: credit.ramon },
    ],
    pano: {
      faces: ['/assets/tour/pano/sala/front.jpg', '/assets/tour/pano/sala/right.jpg', '/assets/tour/pano/sala/back.jpg', '/assets/tour/pano/sala/left.jpg', '/assets/tour/pano/sala/up.jpg', '/assets/tour/pano/sala/down.jpg'],
      sourceUrl: 'https://www.360cities.net/image/sala-of-bahay-ni-dr-jose-rizal-birthplace-of-rizal-calamba-laguna-philippines',
      credit: panoCredit.sala,
      resolution: '14,978 × 7,489',
      captured: '07 January 2025',
    },
  },
  {
    id: 'comedor',
    title: 'Comedor • Family Dining',
    shortTitle: 'Dining 360°',
    coverUrl: '/assets/tour/interior-04.jpg',
    description: 'Stand in the informal dining area near the azotea and look around the room furnished as it would have been during family meals.',
    significance: 'Shared meals reinforced close family ties. Rizal’s letters from Europe fondly remember the food, the discussions, and the warmth of home in Calamba.',
    hotspotLabel: 'Learn about family meals',
    details: [
      'A prominent object here is the punkah, a large rectangular Indian fan.',
      'A formal dining room for guests sits near the library.',
      'Doña Teodora Alonso was known as an avid cook even with kitchen help.',
      'The kitchen and pantry open toward the balcony and azotea.',
    ],
    photos: [
      { src: '/assets/tour/interior-04.jpg', caption: 'Dining and household area inside the reconstructed home.', credit: credit.ramon },
      { src: '/assets/tour/interior-05.jpg', caption: 'Furnishings on the upper living level.', credit: credit.ramon },
    ],
    pano: {
      faces: ['/assets/tour/pano/comedor/front.jpg', '/assets/tour/pano/comedor/right.jpg', '/assets/tour/pano/comedor/back.jpg', '/assets/tour/pano/comedor/left.jpg', '/assets/tour/pano/comedor/up.jpg', '/assets/tour/pano/comedor/down.jpg'],
      sourceUrl: 'https://www.360cities.net/image/dining-room-of-bahay-ni-dr-jose-rizal-birthplace-of-rizal-calamba-laguna-philippines',
      credit: panoCredit.dining,
      resolution: '14,982 × 7,491',
      captured: '07 January 2025',
    },
  },
  {
    id: 'library',
    title: 'Caida • The Family Library',
    shortTitle: 'Library',
    coverUrl: '/assets/tour/interior-06.jpg',
    description: 'The caida served as Francisco Mercado’s library and a waiting or dining area for visitors. More than 1,000 books were kept here—the largest private library in Calamba at the time.',
    significance: 'Access to books and his mother’s patient teaching shaped Rizal’s curiosity, discipline, and love of learning across languages and subjects.',
    hotspotLabel: 'Discover Rizal the learner',
    details: [
      'Teodora Alonso was Rizal’s first teacher.',
      'Rizal studied at the Ateneo Municipal de Manila and later medicine at Santo Tomás.',
      'The museum’s Gallery 3 (Karunungan) covers his formal education.',
      'Reading, writing, drawing, and languages became lifelong habits.',
    ],
    photos: [
      { src: '/assets/tour/interior-06.jpg', caption: 'Books and study area inside the ancestral house.', credit: credit.ramon },
      { src: '/assets/tour/interior-07.jpg', caption: 'A quiet corner of the upper floor.', credit: credit.ramon },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Silid Kapanganakan • Bedrooms',
    shortTitle: 'Birth Room',
    coverUrl: '/assets/tour/interior-08.jpg',
    description: 'Three bedrooms complete the upper floor: the boys’ room shared by José and Paciano, the girls’ room for his nine sisters, and the master bedroom where José was born on June 19, 1861.',
    significance: 'This is the room that marks the beginning of the life of the Philippines’ national hero. The master bedroom is the largest and holds the four-poster bed where he was born.',
    hotspotLabel: 'Rizal’s birth',
    details: [
      'José was the seventh of eleven children.',
      'In the boys’ room, Paciano slept on the bed while José slept on the floor.',
      'The girls’ room preserves an original sewing machine owned by his eldest sister.',
      'The family’s simple routines here contrast with the grandeur of his later life abroad.',
    ],
    photos: [
      { src: '/assets/tour/interior-08.jpg', caption: 'Bedroom furnishings in the family quarters.', credit: credit.ramon },
      { src: '/assets/tour/interior-09.jpg', caption: 'A second view of the sleeping area.', credit: credit.ramon },
      { src: '/assets/tour/interior-10.jpg', caption: 'The master bedroom with the four-poster bed.', credit: credit.ramon },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen, Pantry & Azotea',
    shortTitle: 'Kitchen',
    coverUrl: '/assets/tour/interior-11.jpg',
    description: 'A working kitchen and pantry lead out to the azotea, an open-air terrace used for chores, rest, and enjoying the tropical surroundings.',
    significance: 'The azotea connects domestic life with nature—young Rizal’s close observation of plants and animals later appeared in his art, science, and writing.',
    hotspotLabel: 'Explore the azotea',
    details: [
      'A pail once reached the old well beside the azotea for water.',
      'The well is one of the few surviving features of the original house.',
      'The terrace looks out over the backyard and fruit trees.',
      'Visitors are asked to keep to marked areas to protect the furnishings.',
    ],
    photos: [
      { src: '/assets/tour/interior-11.jpg', caption: 'Kitchen and pantry area of the house.', credit: credit.ramon },
      { src: '/assets/tour/interior-12.jpg', caption: 'Interior passage toward the terrace.', credit: credit.ramon },
      { src: '/assets/tour/exterior-back-2023.jpg', caption: 'Back of the house and azotea side (March 2023).', credit: credit.ralff },
    ],
  },
  {
    id: 'europe',
    title: 'Galleries 4–6 • Bahay-na-Bato & Europe',
    shortTitle: 'Museum',
    coverUrl: '/assets/tour/exhibit-02.jpg',
    description: 'Gallery 4 presents the house itself and its furnishings. Galleries 5 and 6 follow Rizal’s two journeys to Europe, his studies, his nationalist writing, and the making of Noli me tangere and El Filibusterismo.',
    significance: 'These galleries, housed in a separate air-conditioned building built in 1997, connect the boy from Calamba to the thinker, novelist, doctor, and reformer he became.',
    hotspotLabel: 'Follow Rizal to Europe',
    details: [
      'Gallery 5: first trip to Europe (1882–1887), Madrid, Paris, Heidelberg, and Noli me tangere.',
      'Gallery 6: second trip (1888–1892), propaganda work, El Filibusterismo, and his return in June 1892.',
      'The museum includes memorabilia, interactive booths, and a hologram of Rizal reading a letter to Dr. Ferdinand Blumentritt.',
      'An e-learning room supports online history lessons for visiting classes.',
    ],
    photos: [
      { src: '/assets/tour/exhibit-02.jpg', caption: 'Museum display on Rizal’s life and work.', credit: credit.xiquin },
      { src: '/assets/tour/exhibit-01.jpg', caption: 'Exhibit corner inside the museum building.', credit: credit.xiquin },
      { src: '/assets/tour/interior-12.jpg', caption: 'Bahay-na-Bato gallery furnishings.', credit: credit.ramon },
    ],
  },
]

export const panoScenes = scenes.filter(scene => Boolean(scene.pano))
export const storyScenes = scenes.filter(scene => !scene.pano)

export const sceneSpots: Record<string, Spot[]> = {
  grounds: [
    { id: 'g-to-sala', x: 22, y: 55, label: 'Enter sala', kind: 'move', target: 'sala' },
    { id: 'g-to-comedor', x: 78, y: 60, label: 'Dining room', kind: 'move', target: 'comedor' },
    { id: 'g-info-1', x: 38, y: 38, label: 'Bahay kubo', kind: 'info', title: 'Pepe’s hideaway', body: 'The nipa hut in the garden is a replica of the small hut young José used as a workshop and hideaway, where he observed plants, insects, and birds.', photo: '/assets/tour/bahay-kubo-2023.jpg' },
    { id: 'g-info-2', x: 64, y: 43, label: 'Young Rizal', kind: 'info', title: 'Statue of young Pepe', body: 'Dudley Diaz sculpted this bronze statue of Rizal with his dog in 1996 for the centennial of Rizal’s death. The dog was one of his childhood companions.', photo: '/assets/tour/young-rizal-dog-2023.jpg' },
  ],
  sala: [
    { id: 'sa-to-comedor', x: 76, y: 56, label: 'Comedor', kind: 'move', target: 'comedor' },
    { id: 'sa-to-grounds', x: 22, y: 58, label: 'Garden', kind: 'move', target: 'grounds' },
    { id: 'sa-info-1', x: 38, y: 38, label: 'Capiz light', kind: 'info', title: 'Light of the sala', body: 'Translucent capiz panels fill the formal receiving room with a soft glow. This was how upper-class Filipino homes kept bright interiors before glass became common.', photo: '/assets/tour/interior-01.jpg' },
    { id: 'sa-info-2', x: 64, y: 44, label: 'Family guests', kind: 'info', title: 'A room for welcoming', body: 'Relatives, neighbors, and prominent visitors were received here. It was also where young Pepe heard the stories and debates that shaped his ideas.', photo: '/assets/tour/interior-02.jpg' },
  ],
  comedor: [
    { id: 'c-to-sala', x: 22, y: 55, label: 'Sala', kind: 'move', target: 'sala' },
    { id: 'c-to-grounds', x: 78, y: 60, label: 'Garden', kind: 'move', target: 'grounds' },
    { id: 'c-info-1', x: 43, y: 38, label: 'The punkah', kind: 'info', title: 'Punkah fan', body: 'A large rectangular Indian fan hangs in the comedor. Servants pulled the punkah to move air during long, humid Calamba meals.', photo: '/assets/tour/interior-04.jpg' },
    { id: 'c-info-2', x: 65, y: 45, label: 'Family meals', kind: 'info', title: 'Meals at home', body: 'Doña Teodora was an avid cook even with kitchen help. Rizal’s letters from Europe often looked back fondly on the food and conversation of home.', photo: '/assets/tour/interior-05.jpg' },
  ],
}

export const visitorInfo = {
  address: 'Francisco Mercado St. cor. José P. Rizal St., Brgy. 5, Poblacion, Calamba City, Laguna',
  hours: 'Tuesday–Sunday, 9:00 AM–4:00 PM · Closed Mondays',
  contact: '(049) 834-1599 · mjrc@nhcp.gov.ph',
  note: 'Entry is free. Guided tours and film showings may be arranged with the museum staff; photography rules inside the house may change, so ask first.',
  source: 'Museo ni José Rizal Calamba, National Historical Commission of the Philippines',
  lat: 14.213677,
  lng: 121.166827,
  mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=121.1633%2C14.2112%2C121.1703%2C14.2162&layer=mapnik&marker=14.213677%2C121.166827',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=14.213677%2C121.166827',
}

export type Question = {
  sceneId: string
  stop: string
  question: string
  choices: string[]
  answer: number
  explanation: string
}

export const questions: Question[] = [
  { sceneId: 'grounds', stop: 'Gardens · Bahay kubo', question: 'What was the nipa hut in the garden used by young Pepe?', choices: ['As a workshop and hideaway to observe nature', 'As a classroom for his Ateneo lessons', 'As a storehouse for the punkah', 'As a guest bedroom'], answer: 0, explanation: 'The small nipa hut was Pepe’s childhood hideaway and workshop for observing plants, insects, and birds.' },
  { sceneId: 'grounds', stop: 'Gardens · Young Rizal', question: 'Who sculpted the bronze statue of young Rizal and his dog, and when?', choices: ['Juan F. Nakpil in 1950', 'Teodora Alonso in 1861', 'Dudley Diaz in 1996', 'Dudley Diaz in 2009'], answer: 2, explanation: 'Dudley Diaz sculpted the statue in 1996 for the centennial of Rizal’s death.' },
  { sceneId: 'grounds', stop: 'Gardens · Fruits', question: 'Which fruits did Rizal remember from the family garden?', choices: ['Atis, santol, tampoy, makopa, plum, balimbing, and kasuy', 'Mango, banana, papaya, and pineapple', 'Rambutan, durian, mangosteen, and lychee', 'Coffee, cacao, tobacco, and sugarcane'], answer: 0, explanation: 'Rizal recalled the atis, santol, tampoy, makopa, plum, balimbing, and kasuy from his childhood garden.' },
  { sceneId: 'grounds', stop: 'Gardens · Family grounds', question: 'Whose remains are interred on the shrine grounds?', choices: ['Paciano and Leonor', 'Francisco Mercado and Teodora Alonso', 'Juan F. Nakpil and Dudley Diaz', 'Only José Rizal'], answer: 1, explanation: 'The remains of his parents, Francisco Mercado and Teodora Alonso, are interred on the grounds.' },
  { sceneId: 'sala', stop: 'Sala · Capiz light', question: 'What made the sala glow before glass windows were common?', choices: ['Painted paper panels', 'Translucent capiz shell panels', 'Stained glass', 'Woven bamboo slats'], answer: 1, explanation: 'Capiz shell panels diffuse daylight into a soft glow while keeping privacy.' },
  { sceneId: 'sala', stop: 'Sala · Family guests', question: 'What did young Pepe do in the sala when visitors came?', choices: ['Cooked meals for them', 'Repaired the punkah', 'Copied books in the library', 'Heard stories, readings, and debates'], answer: 3, explanation: 'Relatives and prominent visitors were received here, and young Pepe listened to the stories and ideas he heard.' },
  { sceneId: 'sala', stop: 'Sala · Upper floor', question: 'Where does the sala lead on the upper floor?', choices: ['Only to the kitchen and pantry', 'To three bedrooms and a caida', 'To the museum galleries below', 'To the azotea stairs'], answer: 1, explanation: 'A caida links the upper-floor areas, and the sala leads to the boys’, girls’, and parents’ bedrooms.' },
  { sceneId: 'comedor', stop: 'Comedor · Punkah fan', question: 'How was the punkah fan operated during meals?', choices: ['By an electric motor', 'By pulling it with a rope', 'By wind from the capiz windows', 'By a small water wheel'], answer: 1, explanation: 'Servants pulled the large Indian fan to move air during long, humid Calamba meals.' },
  { sceneId: 'comedor', stop: 'Comedor · Family meals', question: 'What did Rizal remember fondly about meals at home?', choices: ['The food, discussions, and warmth of home', 'The silence and strict rules', 'The European dishes only', 'The museum exhibits'], answer: 0, explanation: 'His letters from Europe remembered the food, conversation, and warmth of home in Calamba.' },
  { sceneId: 'comedor', stop: 'Comedor · Nearby rooms', question: 'Which room sits near the comedor for formal guests?', choices: ['The kitchen', 'The boys’ bedroom', 'The formal dining room near the library', 'The nipa hut'], answer: 2, explanation: 'A formal dining room for guests sits near the library.' },
]

export const destinations = [
  { province: 'Laguna', place: 'Rizal Shrine, Calamba', status: 'unlocked', code: 'LA', x: 50, y: 54 },
]
