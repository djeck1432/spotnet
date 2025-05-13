const y = new Date().getFullYear()

export const projectList = [
    {
        id: 27,
        name: 'EVO SaaS',
        category: 'Web Application',
        desc: 'Most of you are familiar with the virtues of a programmer',
        attachmentCount: 12,
        totalTask: 32,
        completedTask: 27,
        progression: 80,
        dayleft: 21,
        status: 'none',
        member: [
            {
                name: 'Frederick Adams',
                img: '/img/avatars/thumb-8.jpg',
            },
            {
                name: 'Joyce Freeman',
                img: '/img/avatars/thumb-5.jpg',
            },
            {
                name: 'Clayton Bates',
                img: '',
            },
            {
                name: 'Clayton Bates',
                img: '',
            },
        ],
    },
    {
        id: 28,
        name: 'AIA Bill App',
        category: 'Mobile Application',
        desc: 'We are not shipping your machine!',
        attachmentCount: 5,
        totalTask: 36,
        completedTask: 15,
        progression: 45,
        dayleft: 19,
        status: 'none',
        member: [
            {
                name: 'Carolyn Perkins',
                img: '/img/avatars/thumb-1.jpg',
            },
            {
                name: 'Gabriel Frazier',
                img: '',
            },
        ],
    },
    {
        id: 29,
        name: 'IOP Web',
        category: 'Web Backend Application',
        desc: 'There are two ways to write error-free programs; only the third one works.',
        attachmentCount: 8,
        totalTask: 27,
        completedTask: 19,
        progression: 73,
        dayleft: 6,
        status: 'orange',
        member: [
            {
                name: 'Debra Hamilton',
                img: '',
            },
            {
                name: 'Stacey Ward',
                img: '',
            },
            {
                name: 'Ron Vargas',
                img: '/img/avatars/thumb-3.jpg',
            },
            {
                name: 'Ron Vargas',
                img: '/img/avatars/thumb-3.jpg',
            },
            {
                name: 'Ron Vargas',
                img: '/img/avatars/thumb-3.jpg',
            },
            {
                name: 'Ron Vargas',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
    },
    {
        id: 31,
        name: 'Octonine POS',
        category: 'Backend Application',
        desc: 'Everything that can be invented has been invented.',
        attachmentCount: 8,
        totalTask: 78,
        completedTask: 23,
        progression: 21,
        dayleft: 52,
        status: 'cyan',
        member: [
            {
                name: 'Brittany Hale',
                img: '/img/avatars/thumb-10.jpg',
            },
            {
                name: 'Frederick Adams',
                img: '/img/avatars/thumb-8.jpg',
            },
            {
                name: 'Samantha Phillips',
                img: '/img/avatars/thumb-6.jpg',
            },
            {
                name: 'Samantha Phillips',
                img: '/img/avatars/thumb-6.jpg',
            },
            {
                name: 'Samantha Phillips',
                img: '/img/avatars/thumb-6.jpg',
            },
        ],
    },
    {
        id: 30,
        name: 'Evo SaaS API',
        category: 'Backend Services',
        desc: 'Debugging is twice as hard as writing the code in the first place.',
        attachmentCount: 2,
        totalTask: 15,
        completedTask: 13,
        progression: 87,
        dayleft: 2,
        status: 'red',
        member: [
            {
                name: 'Troy Alexander',
                img: '',
            },
            {
                name: 'Lloyd Obrien',
                img: '/img/avatars/thumb-11.jpg',
            },
        ],
    },
    {
        id: 32,
        name: 'Posiflex Web',
        category: 'Frontend Web Application',
        desc: 'The function of good software is to make the complex appear to be simple.',
        attachmentCount: 6,
        totalTask: 18,
        completedTask: 9,
        progression: 50,
        dayleft: 6,
        status: 'orange',
        member: [
            {
                name: 'Gabriella May',
                img: '/img/avatars/thumb-12.jpg',
            },
            {
                name: 'Larry Campbell',
                img: '',
            },
            {
                name: 'Phyllis Chapman',
                img: '',
            },
        ],
    },
    {
        id: 33,
        name: 'FoksMart APP',
        category: 'Mobile Application',
        desc: 'It is not about bits, bytes and protocols, but profits, losses and margins. ',
        attachmentCount: 3,
        totalTask: 26,
        completedTask: 19,
        progression: 67,
        dayleft: 14,
        status: 'none',
        member: [
            {
                name: 'Lee Wheeler',
                img: '/img/avatars/thumb-13.jpg',
            },
            {
                name: 'Ella Robinson',
                img: '/img/avatars/thumb-15.jpg',
            },
        ],
    },
]

export const projectDashboardData = {
    userName: 'Carolyn Perkins',
    taskCount: 5,
    projectOverviewData: {
        chart: {
            daily: {
                onGoing: 13,
                finished: 9,
                total: 21,
                series: [
                    {
                        name: 'On Going',
                        data: [20, 19, 18, 14, 12, 10],
                    },
                    {
                        name: 'Finished',
                        data: [1, 4, 8, 15, 16, 18],
                    },
                ],
                range: [
                    '6:00am',
                    '9:00am',
                    '12:00pm',
                    '03:00pm',
                    '06:00pm',
                    '09:00pm',
                ],
            },
            weekly: {
                onGoing: 126,
                finished: 87,
                total: 213,
                series: [
                    {
                        name: 'On Going',
                        data: [45, 52, 68, 84, 103, 112, 126],
                    },
                    {
                        name: 'Finished',
                        data: [35, 41, 62, 62, 75, 81, 87],
                    },
                ],
                range: [
                    '21 Jan',
                    '22 Jan',
                    '23 Jan',
                    '24 Jan',
                    '25 Jan',
                    '26 Jan',
                    '27 Jan',
                ],
            },
            monthly: {
                onGoing: 270,
                finished: 113,
                total: 383,
                series: [
                    {
                        name: 'On Going',
                        data: [28, 52, 91, 154, 227, 256, 270],
                    },
                    {
                        name: 'Finished',
                        data: [22, 31, 74, 88, 97, 107, 113],
                    },
                ],
                range: [
                    '01 Jan',
                    '05 Jan',
                    '10 Jan',
                    '15 Jan',
                    '20 Jan',
                    '25 Jan',
                    '27 Jan',
                ],
            },
        },
    },
    myTasksData: [
        {
            taskId: 'KCM-1393',
            taskSubject: 'Design sign up flow',
            priority: 0,
            assignees: [
                {
                    id: '1',
                    name: 'Carolyn Perkins',
                    email: 'eileen_h@hotmail.com',
                    img: '/img/avatars/thumb-1.jpg',
                },
                {
                    id: '2',
                    name: 'Terrance Moreno',
                    email: '',
                    img: '/img/avatars/thumb-2.jpg',
                },
            ],
        },
        {
            taskId: 'KCM-2039',
            taskSubject: 'Update contact page',
            priority: 1,
            assignees: [
                {
                    id: '1',
                    name: 'Carolyn Perkins',
                    email: 'eileen_h@hotmail.com',
                    img: '/img/avatars/thumb-1.jpg',
                },
            ],
        },
        {
            taskId: 'KCM-2155',
            taskSubject: 'Document features 2.0',
            priority: 1,
            assignees: [
                {
                    id: '1',
                    name: 'Carolyn Perkins',
                    email: 'eileen_h@hotmail.com',
                    img: '/img/avatars/thumb-1.jpg',
                },
                {
                    id: '2',
                    name: 'Terrance Moreno',
                    email: '',
                    img: '/img/avatars/thumb-2.jpg',
                },
                {
                    id: '3',
                    name: 'Ron Vargas',
                    email: 'ronnie_vergas@infotech.io',
                    img: '/img/avatars/thumb-3.jpg',
                },
            ],
        },
        {
            taskId: 'KCM-2270',
            taskSubject: 'Fix typo in home page',
            priority: 2,
            assignees: [
                {
                    id: '1',
                    name: 'Carolyn Perkins',
                    email: 'eileen_h@hotmail.com',
                    img: '/img/avatars/thumb-1.jpg',
                },
                {
                    id: '5',
                    name: 'Joyce Freeman',
                    email: 'joyce991@infotech.io',
                    img: '/img/avatars/thumb-5.jpg',
                },
            ],
        },
        {
            taskId: 'KCM-1957',
            taskSubject: 'Fix broken API',
            priority: 0,
            assignees: [
                {
                    id: '1',
                    name: 'Carolyn Perkins',
                    email: 'eileen_h@hotmail.com',
                    img: '/img/avatars/thumb-1.jpg',
                },
            ],
        },
    ],
    scheduleData: [
        {
            id: '0',
            time: '10:00am',
            eventName: 'Sprint Planning',
            desciption: 'via Zoom',
            type: 'meeting',
        },
        {
            id: '1',
            time: '1:00pm',
            eventName: 'Design discussion',
            desciption: 'via Microsoft Teams',
            type: 'meeting',
        },
        {
            id: '2',
            time: '3:00pm',
            eventName: 'Create daily report',
            desciption: 'Daily task',
            type: 'task',
        },
        {
            id: '3',
            time: '4:00pm',
            eventName: 'MySql online workshop',
            desciption: 'Online workshop',
            type: 'workshop',
        },
    ],
    projectsData: projectList.filter((_, index) => index <= 3),
    activitiesData: [
        {
            type: 'UPDATE-TICKET',
            dateTime: 1646580000,
            ticket: 'PD-979',
            status: 0,
            userName: 'Carolyn Perkins',
            userImg: '',
        },
        {
            type: 'COMMENT',
            dateTime: 1646578417,
            userName: 'Ron Vargas',
            userImg: '/img/avatars/thumb-3.jpg',
            comment: `Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.`,
        },
        {
            type: 'ADD-TAGS-TO-TICKET',
            dateTime: 1646574027,
            userName: 'Joyce Freeman',
            tags: ['Live Issue', 'Backend'],
        },
        {
            type: 'ADD-FILES-TO-TICKET',
            dateTime: 1646569123,
            userName: 'Luke Cook',
            files: ['document.csv'],
            ticket: 'PD-1092',
        },
    ],
}

export const labels = [
    {
        color: 'blue',
        label: 'Task',
    },
    {
        color: 'gold',
        label: 'Bug',
    },
    {
        color: 'red',
        label: 'Live issue',
    },
    {
        color: 'cyan',
        label: 'Low priority',
    },
]

const toBeProcessCards = [
    {
        id: 'zb7zxtjctd',
        name: 'Unable to upload file',
        description:
            'Scenester hashtag sustainable art party 3 wolf moon live-edge portland offal master cleanse disrupt viral palo santo tacos. Offal sriracha you probably havent heard of them vaporware glossier.',
        cover: '/img/others/img-13.jpg',
        members: [
            {
                id: '1',
                name: 'Carolyn Perkins',
                email: 'eileen_h@hotmail.com',
                img: '/img/avatars/thumb-1.jpg',
            },
            {
                id: '2',
                name: 'Terrance Moreno',
                email: '',
                img: '/img/avatars/thumb-2.jpg',
            },
            {
                id: '3',
                name: 'Ron Vargas',
                email: 'ronnie_vergas@infotech.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        labels: ['Task', 'Live issue'],
        attachments: [
            {
                id: 'jubuK7XGp3',
                name: 'mail.jpg',
                src: '/img/others/img-13.jpg',
                size: '36.1kb',
            },
            {
                id: 'xsb3HCejCM',
                name: 'mail.jpg',
                src: '/img/others/img-14.jpg',
                size: '55.9kb',
            },
        ],
        comments: [
            {
                id: 'R22TqMkACm',
                name: 'Carolyn Hanson',
                src: '/img/avatars/thumb-9.jpg',
                message:
                    'I am baby kitsch plaid mustache, williamsburg butcher gluten-free 3 wolf moon authentic quinoa selvage knausgaard unicorn. Palo santo viral everyday carry, heirloom tumblr raw denim yr iceland wayfarers single-origin coffee tote bag shoreditch cloud bread poke.',
                date: new Date(y, 4, 20),
            },
        ],
        dueDate: new Date(y, 7, 5),
    },
    {
        id: '7qgsduurxt',
        name: 'Table data incorrect',
        description:
            'Extra  breve french press organic milk lungo bar. At, carajillo, saucer latte americano and shop rich french press. And barista mazagran, black, cup extraction ristretto plunger pot cinnamon café au lait.',
        cover: '',
        members: [
            {
                id: '8',
                name: 'Frederick Adams',
                email: 'iamfred@imaze.infotech.io',
                img: '/img/avatars/thumb-8.jpg',
            },
        ],
        labels: ['Bug'],
        attachments: [],
        comments: [
            {
                id: 'Wx8FDSsVTg',
                name: 'Samantha Phillips',
                src: '/img/avatars/thumb-6.jpg',
                message:
                    'Helvetica 8-bit photo booth tumblr food truck. Enamel pin wolf tousled sartorial, brunch shoreditch skateboard beard helvetica. Plaid typewriter gastropub bespoke.',
                date: new Date(y, 4, 20),
            },
            {
                id: '3AhkqqSFFr',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'Af trust fund meggings, meditation chicharrones brunch wolf narwhal shoreditch whatever bicycle rights ramps. ',
                date: new Date(y, 4, 20),
            },
        ],
        dueDate: new Date(y, 6, 11),
    },
    {
        id: 'wtwgpz6csc',
        name: 'Fix broken UI',
        description:
            'Air plant subway tile four loko ramps. Microdosing offal tote bag, single-origin coffee biodiesel before they sold out swag pok pok gastropub tacos letterpress.',
        cover: '',
        members: [
            {
                id: '13',
                name: 'Lee Wheeler',
                email: 'leeWheeler@infotech.io',
                img: '/img/avatars/thumb-13.jpg',
            },
            {
                id: '5',
                name: 'Joyce Freeman',
                email: 'joyce991@infotech.io',
                img: '/img/avatars/thumb-5.jpg',
            },
        ],
        labels: ['Low priority'],
        attachments: [],
        comments: [
            {
                id: 'bAvBdtKHNC',
                name: 'Lloyd Obrien',
                src: '/img/avatars/thumb-11.jpg',
                message:
                    'Helvetica 8-bit photo booth tumblr food truck. Enamel pin wolf tousled sartorial, brunch shoreditch skateboard beard helvetica. Plaid typewriter gastropub bespoke.',
                date: new Date(y, 4, 20),
            },
        ],
        dueDate: new Date(y, 7, 5),
    },
]

const processingCards = [
    {
        id: 'ywejrdr3rn',
        name: 'Fix dashboard layout',
        description:
            'Biodiesel selvage letterpress 8-bit, coloring book banjo austin pabst post-ironic try-hard gluten-free tilde authentic prism man braid.',
        cover: '',
        members: [
            {
                id: '2',
                name: 'Terrance Moreno',
                email: '',
                img: '/img/avatars/thumb-2.jpg',
            },
            {
                id: '8',
                name: 'Frederick Adams',
                email: 'iamfred@imaze.infotech.io',
                img: '/img/avatars/thumb-8.jpg',
            },
        ],
        labels: ['Bug'],
        attachments: [],
        comments: [
            {
                id: 'afPugkEmkp',
                name: 'Carolyn Perkins',
                src: '/img/avatars/thumb-1.jpg',
                message: '',
                date: new Date(y, 5, 16),
            },
        ],
        dueDate: new Date(y, 3, 17),
    },
    {
        id: 'tkBXWJGwkr',
        name: 'New design',
        description:
            'Typewriter hell of cloud bread health goth beard mlkshk four loko.',
        cover: '',
        members: [
            {
                id: '10',
                name: 'Brittany Hale',
                email: 'brittany1134@gmail.com',
                img: '/img/avatars/thumb-10.jpg',
            },
        ],
        labels: ['Task'],
        attachments: [
            {
                id: 'NjHJhHeWrG',
                name: 'issue.jpg',
                src: '/img/others/img-16.jpg',
                size: '46.1kb',
            },
        ],
        comments: [
            {
                id: 'MAsPDzGwnA',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'Af trust fund meggings, meditation chicharrones brunch wolf narwhal shoreditch whatever bicycle rights ramps. ',
                date: new Date(y, 4, 20),
            },
        ],
        dueDate: null,
    },
    {
        id: 'VQgUDrYJYH',
        name: 'Improve user experiences',
        description:
            'Java, barista, single origin, aged foam, id dripper organic at grounds id turkish. Grounds french press viennese, strong dark that extra  spoon café au lait cappuccino. Doppio, coffee, affogato, skinny eu latte, ut carajillo black crema instant dark.',
        cover: '',
        members: [
            {
                id: '6',
                name: 'Samantha Phillips',
                email: 'samanthaphil@infotech.io',
                img: '/img/avatars/thumb-6.jpg',
            },
        ],
        labels: ['Low priority', 'Task'],
        attachments: [],
        comments: [],
        dueDate: new Date(y, 4, 20),
    },
]

const submittedCards = [
    {
        id: 'jzjn95g3v4',
        name: 'Update node environment',
        description:
            'Unicorn occupy locavore pug, stumptown literally tofu irony. Af street art paleo shoreditch. Banh mi before they sold out activated charcoal.',
        cover: '',
        members: [
            {
                id: '3',
                name: 'Ron Vargas',
                email: 'ronnie_vergas@infotech.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        labels: ['Low priority'],
        attachments: [],
        comments: [
            {
                id: 'nBAGhJqe9v',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message: '',
                date: new Date(y, 1, 8),
            },
        ],
        dueDate: null,
    },
    {
        id: 'ZFQDPmscwA',
        name: 'Remove user data',
        description:
            'Crucifix polaroid hot chicken asymmetrical wolf helvetica keytar fashion axe ramps YOLO wayfarers 90s.',
        cover: '/img/others/img-15.jpg',
        members: [
            {
                id: '9',
                name: 'Carolyn Hanson',
                email: 'carolyn_h@gmail.com',
                img: '/img/avatars/thumb-9.jpg',
            },
            {
                id: '10',
                name: 'Brittany Hale',
                email: 'brittany1134@gmail.com',
                img: '/img/avatars/thumb-10.jpg',
            },
        ],
        labels: ['Live issue'],
        attachments: [
            {
                id: 'NjHJhHeWrG',
                name: 'issue.jpg',
                src: '/img/others/img-15.jpg',
                size: '42.6kb',
            },
        ],
        comments: [
            {
                id: 'nBAGhJqe9v',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'Lorem Khaled Ipsum is a major key to success. They key is to have every key, the key to open every door. Im up to something. Life is what you make it, so lets make it.',
                date: new Date(y, 1, 8),
            },
        ],
        dueDate: null,
    },
]

const completedCards = [
    {
        id: 'yhjk5679xr',
        name: 'Ready to test',
        description:
            'Yr green juice health goth, williamsburg four dollar toast shabby chic meggings jean shorts VHS.',
        cover: '',
        members: [
            {
                id: '13',
                name: 'Lee Wheeler',
                email: 'leeWheeler@infotech.io',
                img: '/img/avatars/thumb-13.jpg',
            },
            {
                id: '9',
                name: 'Carolyn Hanson',
                email: 'carolyn_h@gmail.com',
                img: '/img/avatars/thumb-9.jpg',
            },
        ],
        labels: ['Task'],
        attachments: [],
        comments: [
            {
                id: 'yxc5gwrXUZ',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message: '',
                date: new Date(y, 3, 4),
            },
        ],
        dueDate: new Date(y, 3, 4),
    },
    {
        id: 'UMgvapYVXm',
        name: 'Slow API connection',
        description:
            'Yr green juice health goth, williamsburg four dollar toast shabby chic meggings jean shorts VHS.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Joyce Freeman',
                email: 'joyce991@infotech.io',
                img: '/img/avatars/thumb-5.jpg',
            },
            {
                id: '6',
                name: 'Samantha Phillips',
                email: 'samanthaphil@infotech.io',
                img: '/img/avatars/thumb-6.jpg',
            },
            {
                id: '7',
                name: 'Tara Fletcher',
                email: 'taratarara@imaze.edu.du',
                img: '/img/avatars/thumb-7.jpg',
            },
        ],
        labels: ['Bug'],
        attachments: [],
        comments: [],
        dueDate: new Date(y, 7, 19),
    },
    {
        id: 'uRZNVsCmDW',
        name: 'Login failed',
        description:
            'Air plant subway tile four loko ramps. Microdosing offal tote bag, single-origin coffee biodiesel before they sold.',
        cover: '',
        members: [
            {
                id: '4',
                name: 'Luke Cook',
                email: 'cookie_lukie@hotmail.com',
                img: '/img/avatars/thumb-4.jpg',
            },
        ],
        labels: ['Live issue'],
        attachments: [],
        comments: [],
        dueDate: new Date(y, 4, 6),
    },
    {
        id: 'PBSGmhVgvS',
        name: 'Locale incorrect',
        description:
            'Hoodie mustache woke pour-over you probably havent heard of them cray.',
        cover: '',
        members: [
            {
                id: '5',
                name: 'Joyce Freeman',
                email: 'joyce991@infotech.io',
                img: '/img/avatars/thumb-5.jpg',
            },
            {
                id: '3',
                name: 'Ron Vargas',
                email: 'ronnie_vergas@infotech.io',
                img: '/img/avatars/thumb-3.jpg',
            },
        ],
        labels: ['Low priority'],
        attachments: [],
        comments: [
            {
                id: 'dNskbPFeQD',
                name: 'Ron Vargas',
                src: '/img/avatars/thumb-3.jpg',
                message:
                    'Af trust fund meggings, meditation chicharrones brunch wolf narwhal shoreditch whatever bicycle rights ramps. ',
                date: new Date(y, 4, 20),
            },
            {
                id: 'qNzkmRZiTO',
                name: 'Terrance Moreno',
                src: '/img/avatars/thumb-2.jpg',
                message: 'Noted!',
                date: new Date(y, 4, 20),
            },
        ],
        dueDate: new Date(y, 7, 13),
    },
]

export const issueData = {
    ticketId: '#PD-127',
    title: 'API not working',
    createdBy: 'Carolyn Perkins',
    underProject: 'Sprint 2',
    description: `<p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
	<p>Enslave the hooman pounce on unsuspecting person or tuxedo cats always looking dapper yet poop on grasses or growl at dogs in my sleep but love blinks and purr purr purr purr yawn.</p>
	<p>Decide to want nothing to do with my owner today being gorgeous with belly side up claw your carpet in places everyone can see - why hide my amazing artistic clawing skills?</p>
	<p>Bite nose of your human leave fur on owners clothes so scratch my tummy actually i hate you now fight me blow up sofa in 3 seconds.</p>
	`,
    date: `Jan 22, ${new Date().getFullYear()}`,
    assignees: [
        {
            id: '8',
            name: 'Frederick Adams',
            email: 'iamfred@imaze.infotech.io',
            img: '/img/avatars/thumb-8.jpg',
        },
        {
            id: '5',
            name: 'Joyce Freeman',
            email: 'joyce991@infotech.io',
            img: '/img/avatars/thumb-5.jpg',
        },
    ],
    labels: [
        {
            title: 'Bug',
            class: 'bg-red-500',
        },
        {
            title: 'High priority',
            class: 'bg-amber-500',
        },
    ],
    activity: [
        {
            type: 'COMMENT',
            name: 'Frederick Adams',
            img: '/img/avatars/thumb-8.jpg',
            time: '3h ago',
            comment: `Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.`,
        },
        {
            type: 'ASSIGN',
            name: 'Carolyn Perkins',
            time: '4h ago',
            assignees: ['Frederick Adams', 'Joyce Freeman'],
        },
        {
            type: 'TAG',
            name: 'Carolyn Perkins',
            time: '4h ago',
            labels: [
                {
                    title: 'Bug',
                    class: 'bg-red-500',
                },
                {
                    title: 'High priority',
                    class: 'bg-amber-500',
                },
            ],
        },
        {
            type: 'COMMENT',
            name: 'Carolyn Perkins',
            img: '/img/avatars/thumb-1.jpg',
            time: '4h ago',
            comment:
                'Saying that Java is nice because it works on all OSes is like saying that anal sex is nice because it works on all genders.',
        },
    ],
}

export const scrumboardData = {
    'To Do': toBeProcessCards,
    'In Progress': processingCards,
    Submitted: submittedCards,
    Completed: completedCards,
}
