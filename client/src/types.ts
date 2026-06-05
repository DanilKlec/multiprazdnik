export interface Program {
  id: string;
  title: string;
  intro: string;
  description: string;
  iconName: 'Beaker' | 'Droplet' | 'Music' | 'Sparkles' | 'Home' | 'Car';
  colorTheme: 'primary' | 'secondary' | 'tertiary' | 'rose' | 'amber' | 'blue';
}

export interface Booking {
  id: string;
  ticketId: string;
  childName: string;
  childAge: number;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM
  selectedProgram: string;
  selectedCharacter: string;
  parentName: string;
  parentPhone: string;
  specificWishes: string;
  addCake: boolean;
  addConfetti: boolean;
  totalPrice: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Character {
  id: string;
  name: string;
  category: 'girls' | 'boys' | 'teens' | 'universal';
  tags: string[];
  imageUrl: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  date: string;
  rating: number;
  avatarLetter: string;
  avatarBg: string;
}

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'science',
    title: 'Научное шоу',
    intro: 'Увлекательные эксперименты, которые удивят даже взрослых. Безопасно и очень интересно!',
    description: 'Яркое и увлекательное представление, где дети становятся настоящими маленькими учеными. Безопасные эксперименты, необычные реакции, дым, пена и множество удивительных эффектов превращают праздник в настоящее научное приключение. Такое шоу не только развлекает, но и вызывает у детей интерес к открытиям и новым знаниям.',
    iconName: 'Beaker',
    colorTheme: 'primary'
  },
  {
    id: 'bubbles',
    title: 'Шоу мыльных пузырей',
    intro: 'Огромные пузыри, погружение внутрь пузыря и море восторга для малышей и не только.',
    description: 'Волшебная программа, которая завораживает детей любого возраста. Огромные мыльные пузыри, необычные фигуры, дымовые пузыри и интерактив с детьми создают атмосферу настоящей сказки. Это красивое и легкое шоу дарит много улыбок, эмоций и ярких фотографий.',
    iconName: 'Droplet',
    colorTheme: 'secondary'
  },
  {
    id: 'drums',
    title: 'Барабанное шоу',
    intro: 'Ритмичное, громкое и невероятно веселое шоу, где каждый сможет почувствовать себя музыкантом.',
    description: 'Энергичная и шумная программа для детей, которые любят движение, музыку и активное участие. Дети могут не только смотреть выступление, но и сами попробовать себя в роли барабанщиков. Такое шоу создает невероятную атмосферу драйва, веселья и командного настроения.',
    iconName: 'Music',
    colorTheme: 'tertiary'
  },
  {
    id: 'serpentine',
    title: 'Серпантиновое шоу',
    intro: 'Горы цветного серпантина, танцы и невероятно красивые фотографии с праздника.',
    description: 'Настоящий взрыв эмоций и веселья. Яркий серпантин, музыка, танцы и активные игры превращают праздник в красочное шоу, где дети полностью погружаются в атмосферу радости. Особенно эффектно смотрится в финале мероприятия и создает незабываемые впечатления.',
    iconName: 'Sparkles',
    colorTheme: 'rose'
  },
  {
    id: 'studio',
    title: 'Праздники в студии',
    intro: 'Уютная и безопасная атмосфера в нашей оборудованной студии, идеальная для детских вечеринок.',
    description: 'Наша студия — это уютное и подготовленное пространство для проведения детских праздников. Здесь есть всё необходимое для комфортного отдыха детей и родителей: праздничная атмосфера, место для игр, программ, шоу и развлечений. Мы помогаем организовать праздник так, чтобы родители могли наслаждаться моментом вместе с детьми.',
    iconName: 'Home',
    colorTheme: 'amber'
  },
  {
    id: 'animators',
    title: 'Выездные аниматоры',
    intro: 'Приедем к вам домой, в кафе или на природу, чтобы подарить сказку там, где вам удобно.',
    description: 'Наши аниматоры могут приехать в любое удобное место: домой, в кафе, школу, детский сад или на открытую площадку. Любимые герои проводят игры, конкурсы, танцы и интерактивные программы, создавая настоящий праздник в любом месте. Мы стараемся сделать так, чтобы каждый ребенок почувствовал себя героем своей собственной сказки.',
    iconName: 'Car',
    colorTheme: 'blue'
  }
];

export const CHARACTERS_DATA: Character[] = [
  // ================= GIRLS =================
  {
    id: 'rapunzel',
    name: 'Рапунцель',
    category: 'girls',
    tags: ['Сказка', 'Принцесса'],
    imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=600&auto=format&fit=crop',
    description: 'Золотая коса, весёлый хамелеон Паскаль и море творчества! Прекрасная принцесса Рапунцель наполнит праздник песнями, рисованием, запуском волшебных фонариков и зажигательными танцами.'
  },
  {
    id: 'princess-ball',
    name: 'Балл принцесс',
    category: 'girls',
    tags: ['Королевство', 'Торжество'],
    imageUrl: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop',
    description: 'Настоящий королевский приём для юных леди! Все девочки почувствуют себя прекрасными принцессами. В программе: уроки этикета, королевское дефиле, блеск-тату, изящный вальс и коронация именинницы.'
  },
  {
    id: 'wednesday-girls',
    name: 'Уэнсдей',
    category: 'girls',
    tags: ['Готика', 'Челленджи'],
    imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop',
    description: 'Для смелых девчонок, любящих загадки Академии Невермор! Уэнсдей проведёт мистический квест, научит своему знаменитому вирусному танцу и поможет разгадать секреты семейки Аддамс.'
  },
  {
    id: 'unicorns',
    name: 'Единороги',
    category: 'girls',
    tags: ['Блестки', 'Магия'],
    imageUrl: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?q=80&w=600&auto=format&fit=crop',
    description: 'Радужная сказка для самых маленьких мечтательниц. В компании милейшего Единорога крохи отправятся на поиски волшебных кристаллов, станцуют под радужным шлейфом и получат сверкающий грим.'
  },
  {
    id: 'mermaid-pirate-girls',
    name: 'Русалочка и Пират',
    category: 'girls',
    tags: ['Океан', 'Сокровища'],
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
    description: 'Морское приключение, полное тайн и веселья! Прекрасная Ариэль и весёлый Пират возглавят экспедицию по поиску затерянных сокровищ, проведут эстафету на ловкость и научат понимать язык дельфинов.'
  },
  {
    id: 'forest-fairies',
    name: 'Лесные феи',
    category: 'girls',
    tags: ['Природа', 'Волшебство'],
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop',
    description: 'Магия цветов и доброты от лесных волшебниц! Юные гости научатся беречь природу, загадают заветные желания с помощью настоящей звёздной пыльцы и поучаствуют в нежном цветочном дефиле.'
  },
  {
    id: 'fantasy-patrol',
    name: 'Сказочный патруль',
    category: 'girls',
    tags: ['Магия', 'Команда'],
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop',
    description: 'Вместе с юными волшебницами из Мышкина ребятам предстоит освоить основы природной магии, защитить город от сказочных монстров и пройти командный квест на дружбу.'
  },
  {
    id: 'lalafan-kitty',
    name: 'Лалафан и Хэлоу китти',
    category: 'girls',
    tags: ['Милота', 'Игрушки'],
    imageUrl: 'https://images.unsplash.com/photo-1555448248-2571daf655e8?q=80&w=600&auto=format&fit=crop',
    description: 'Самая нежная, мягкая и милая программа для малышей! Уточка Лалафанфан и Хэлоу Китти устроят весёлый плюшевый бой, научат делать милые обнимашки и подарят море радужного настроения.'
  },

  // ================= BOYS =================
  {
    id: 'leon-brawl',
    name: 'Леон бравл старс',
    category: 'boys',
    tags: ['Гейминг', 'Актив'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
    description: 'Легендарный боец Brawl Stars в фирменном зелёном худи! Ребят ждут захватывающие раунды, сбор кристаллов силы, прохождение полосы препятствий и активная тренировка ловкости.'
  },
  {
    id: 'superhero-party-boys',
    name: 'Вечеринка супергероев',
    category: 'boys',
    tags: ['Спасатели', 'Сила'],
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    description: 'Всеобщая мобилизация юных спасателей! Командные состязания, проверка на супер-силу, преодоление гравитации и защита вселенной. В конце — торжественное посвящение в Лигу Героев!'
  },
  {
    id: 'batman',
    name: 'Бэтмен',
    category: 'boys',
    tags: ['Готэм', 'Логово'],
    imageUrl: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?q=80&w=600&auto=format&fit=crop',
    description: 'Зажиточный Готэм в безопасности, когда Бэтмен спешит на помощь! Бэтмен научит юных героев скрытности, прохождению лазерных паутин, дешифровке посланий и командной взаимовыручке.'
  },
  {
    id: 'ninja-turtles',
    name: 'Черепашки ниндзя',
    category: 'boys',
    tags: ['Ниндзя', 'Пицца'],
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop',
    description: 'Кавабанга! Легендарный Леонардо или Рафаэль научит боевому искусству ниндзя, проведёт тренировку с нунчаками (безопасными!) и устроит весёлый пицца-турнир.'
  },
  {
    id: 'swat-party-boys',
    name: 'Вечеринка спецназ',
    category: 'boys',
    tags: ['Курс', 'Препятствия'],
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    description: 'Тактический вызов для сильных духом! Настоящий армейский курс молодого бойца: маскировка, тактическая полоса препятствий, спортивное ориентирование и разминирование макета бомбы.'
  },
  {
    id: 'transformers',
    name: 'Трансформеры',
    category: 'boys',
    tags: ['Роботы', 'Будущее'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
    description: 'Космическая кибернетическая битва автоботов! Оптимус Прайм соберёт команду для поиска затерянной Искры, проведёт лазерные учения и научит трансформироваться под зажигательную музыку.'
  },

  // ================= TEENS =================
  {
    id: 'squid-game',
    name: 'Игра в кальмара',
    category: 'teens',
    tags: ['Квесты', 'Тренды'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    description: 'Безопасная и мега-популярная игра на сплочение! Ребятам предстоит пройти испытания «Тише едешь — дальше будешь», вырезать фигурки из сахарных сот и заработать миллионы игровых баллов.'
  },
  {
    id: 'wednesday-teens',
    name: 'Уэнсдей',
    category: 'teens',
    tags: ['Таинственность', 'Танец'],
    imageUrl: 'https://images.unsplash.com/photo-1541512416146-3cf58d6b27ca?q=80&w=600&auto=format&fit=crop',
    description: 'Погружение в мрачную, но невероятно притягательную атмосферу Академии Невермор! Готические челленджи, угадывание мыслей от Вещи, вирусный танец Уэнсдей и раскрытие тайны монстра.'
  },
  {
    id: 'barbie-party',
    name: 'Барби вечеринка',
    category: 'teens',
    tags: ['Гламур', 'Стиль'],
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600&auto=format&fit=crop',
    description: 'Hi Barbie! Самая гламурная и розовая тусовка этого года. Блеск-шоу, модный показ, создание стильных аксессуаров своими руками, фотосессия в стиле Барби-бокс и розовый лимонад.'
  },
  {
    id: 'blogger-party',
    name: 'Вечеринка Блогеров',
    category: 'teens',
    tags: ['Челленджи', 'Тренды'],
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    description: 'Для тех, кто всегда в тренде! TikTok, YouTube, Likee челленджи в реальном времени. Будем снимать вирусные дуэты, угадывать напитки по вкусу, проходить "Трясучки" и зарабатывать лайки.'
  },
  {
    id: 'swat-party-teens',
    name: 'Вечеринка спецназ',
    category: 'teens',
    tags: ['Миссия', 'Актив'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    description: 'Крутой курс выживания и полоса препятствий для подростков! Обучение тактике, ориентирование в темноте, командные спасательные миссии и захватывающий лазерный бой.'
  },
  {
    id: 'joker-harley',
    name: 'Джокер и Харли Квинн',
    category: 'teens',
    tags: ['Косплей', 'Безумие'],
    imageUrl: 'https://images.unsplash.com/photo-1601513525393-0130e89fd399?q=80&w=600&auto=format&fit=crop',
    description: 'Потрясающий взрыв вечеринки в стиле Готэм-сити! Сумасшедшие качественные пранки, весёлый дестрой, яркий неоновый аквагрим и море шуток от самой безбашенной парочки.'
  },
  {
    id: 'harry-potter-party',
    name: 'Вечеринка Гарри Поттер',
    category: 'teens',
    tags: ['Магия', 'Хогвартс'],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
    description: 'Письмо из Хогвартса получено! Распределяющая Шляпа выберет факультет, ребята сварят волшебное зелье, освоят заклинания волшебными палочками и поучаствуют в турнире по Квиддичу.'
  },

  // ================= UNIVERSAL =================
  {
    id: 'paw-patrol',
    name: 'Щенячий патруль',
    category: 'universal',
    tags: ['Будни', 'Подвиги'],
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
    description: 'Отважным щенкам всё-всё по зубам! Вместе с Гонщиком или Скай малыши отправятся спасать Бухту Приключений, соберут пожарный шланг, пройдут полосу препятствий и станцуют Тяв-Тяв Буги!'
  },
  {
    id: 'trolls',
    name: 'Тролли',
    category: 'universal',
    tags: ['Песни', 'Краски'],
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop',
    description: 'Самая яркая, добрая и обнимательная программа! Розочка и Цветан устроят взрывной флешмоб, разукрасят праздник радужными красками и научат главному закону троллей: петь, танцевать и обниматься каждые 15 минут.'
  },
  {
    id: 'pikachu',
    name: 'Пикачу',
    category: 'universal',
    tags: ['Покемоны', 'Энергия'],
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    description: 'Жёлтая супер-молния Пикачу дарит невероятный заряд бодрости! Ребят ждут ловля покемонов в огромные покеболы, зажигательные танцы, запуск бумажных молний и море задора.'
  },
  {
    id: 'ladybug-catnoir',
    name: 'Леди Баг и Супер Кот',
    category: 'universal',
    tags: ['Париж', 'Спасение'],
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop',
    description: 'Париж в опасности! Леди Баг и Супер Кот собирают команду смельчаков. Ребятам предстоит поймать всех темных бабочек Акум, разгадать секретные послания и спасаться от Бражника.'
  },
  {
    id: 'huggy-kissy',
    name: 'Хагги Ваги и Кисси мисси',
    category: 'universal',
    tags: ['Тренды', 'Улыбка'],
    imageUrl: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop',
    description: 'Вопреки легендам, наши Хагги Ваги и Кисси Мисси – безумно дружелюбные и милые плюшевые гиганты! Они обожают активные игры, догонялки, цветные туннели и самые крепкие объятия в мире.'
  },
  {
    id: 'among-us-universal',
    name: 'Амонг ас',
    category: 'universal',
    tags: ['Космос', 'Квест'],
    imageUrl: 'https://images.unsplash.com/photo-1608889174639-414d9fde97f8?q=80&w=600&auto=format&fit=crop',
    description: 'Космический квест на сплочение прямо у вас! Таинственное голосование, проверка отсеков космического корабля, починка электропроводки и вычисление хитрого предателя.'
  },
  {
    id: 'minecraft-universal',
    name: 'Майнкрафт',
    category: 'universal',
    tags: ['Строительство', 'Выживание'],
    imageUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop',
    description: 'Проходим кубический квест! Строим защитную крепость из огромных блоков, крафтим алмазные мечи, побеждаем Ифрита и танцуем победный танец Стива.'
  },
  {
    id: 'fixies',
    name: 'Фиксики',
    category: 'universal',
    tags: ['Винтик', 'Приборы'],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
    description: 'А кто такие Фиксики — большой-большой секрет! Но только не у нас на празднике. Симка и Нолик познакомят ребят с устройством приборов, потанцуют под «Помогатор» и соберут гигантский винтик.'
  },
  {
    id: 'mermaid-pirate-universal',
    name: 'Русалочка и Пират',
    category: 'universal',
    tags: ['Поиск', 'Океан'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    description: 'Любимый приключенческий коктейль для всех ребят! Поднимаем паруса, преодолеваем рифы, учимся морским узлам и делим сундук золотых дублонов дружно и весело.'
  }
];

export const INITIAL_REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Анна Ковальчук',
    text: '"Дочка до сих пор вспоминает Эльзу! Лучший день рождения. Очень профессиональное шоу."',
    date: '14.03.2026',
    rating: 5,
    avatarLetter: 'А',
    avatarBg: 'bg-orange-100 text-orange-700'
  },
  {
    id: 'rev-2',
    author: 'Игорь Паламарчук',
    text: '"Дети в восторге от Человека-Паука и научного шоу. Обязательно закажем вас снова!"',
    date: '02.02.2026',
    rating: 5,
    avatarLetter: 'И',
    avatarBg: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 'rev-3',
    author: 'Екатерина Лисовая',
    text: '"Теплая атмосфера, уютная студия, замечательные аниматоры. Все продумано до мелочей!"',
    date: '27.01.2026',
    rating: 5,
    avatarLetter: 'Е',
    avatarBg: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'rev-4',
    author: 'Дмитрий Гончаров',
    text: '"Выездной праздник Minecraft прошел на высшем уровне. Родители смогли полноценно отдохнуть."',
    date: '18.12.2025',
    rating: 5,
    avatarLetter: 'Д',
    avatarBg: 'bg-blue-100 text-blue-700'
  }
];
