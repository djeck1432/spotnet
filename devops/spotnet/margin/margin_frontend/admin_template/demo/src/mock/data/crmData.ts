function getDate(dayString: string) {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString()

    if (month.length === 1) {
        month = '0' + month
    }

    return dayString.replace('YEAR', year).replace('MONTH', month)
}

export const crmDashboardData = {
    statisticData: [
        {
            key: 'newLeads',
            label: 'New Leads',
            value: 63,
            growShrink: 2.6,
        },
        {
            key: 'emailResponse',
            label: 'Email',
            value: 25,
            growShrink: 5.5,
        },
        {
            key: 'proposals',
            label: 'Proposals',
            value: 49,
            growShrink: -0.7,
        },
        {
            key: 'appointment',
            label: 'Appointment',
            value: 12,
            growShrink: 2.6,
        },
    ],
    leadByRegionData: [
        {
            name: 'United States of America',
            value: 37.61,
        },
        {
            name: 'Brazil',
            value: 16.79,
        },
        {
            name: 'India',
            value: 12.42,
        },
        {
            name: 'China',
            value: 9.85,
        },
        {
            name: 'Algeria',
            value: 7.68,
        },
        {
            name: 'Indonesia',
            value: 5.11,
        },
    ],
    recentLeadsData: [
        {
            id: 1,
            name: 'Eileen Horton',
            avatar: '/img/avatars/thumb-1.jpg',
            status: 0,
            createdTime: 1623430400,
            email: 'eileen_h@hotmail.com',
            assignee: 'Carrie Harris',
        },
        {
            id: 2,
            name: 'Terrance Moreno',
            avatar: '/img/avatars/thumb-2.jpg',
            status: 1,
            createdTime: 1632393600,
            email: 'terrance_moreno@infotech.io',
            assignee: 'Toni Lane',
        },
        {
            id: 3,
            name: 'Ron Vargas',
            avatar: '/img/avatars/thumb-3.jpg',
            status: 1,
            createdTime: 1632393600,
            email: 'ronnie_vergas@infotech.io',
            assignee: 'Joanne Mendoza',
        },
        {
            id: 4,
            name: 'Luke Cook',
            avatar: '/img/avatars/thumb-4.jpg',
            status: 2,
            createdTime: 1632761600,
            email: 'cookie_lukie@hotmail.com',
            assignee: 'Lorraine Carr',
        },
        {
            id: 5,
            name: 'Joyce Freeman',
            avatar: '/img/avatars/thumb-5.jpg',
            status: 3,
            createdTime: 1632416000,
            email: 'joyce991@infotech.io',
            assignee: 'Myrtle Mason',
        },
        {
            id: 6,
            name: 'Samantha Phillips',
            avatar: '/img/avatars/thumb-6.jpg',
            status: 0,
            createdTime: 1633107200,
            email: 'samanthaphil@infotech.io',
            assignee: 'Perry Ward',
        },
    ],
    emailSentData: {
        precent: 73,
        opened: 893,
        unopen: 330,
        total: 1223,
    },
}

export const eventsData = [
    {
        id: '0',
        title: 'All Day Event',
        start: getDate('YEAR-MONTH-01'),
        eventColor: 'orange',
    },
    {
        id: '1',
        title: 'Long Event',
        start: getDate('YEAR-MONTH-07'),
        end: getDate('YEAR-MONTH-10'),
        eventColor: 'red',
    },
    {
        id: '2',
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-09T16:00:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '3',
        groupId: '999',
        title: 'Repeating Event',
        start: getDate('YEAR-MONTH-16T16:00:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '4',
        title: 'Conference',
        start: 'YEAR-MONTH-17',
        end: getDate('YEAR-MONTH-19'),
        eventColor: 'blue',
    },
    {
        id: '5',
        title: 'Meeting',
        start: getDate('YEAR-MONTH-18T10:30:00+00:00'),
        end: getDate('YEAR-MONTH-18T12:30:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '6',
        title: 'Lunch',
        start: getDate('YEAR-MONTH-18T12:00:00+00:00'),
        eventColor: 'emerald',
    },
    {
        id: '7',
        title: 'Birthday Party',
        start: getDate('YEAR-MONTH-19T07:00:00+00:00'),
        eventColor: 'purple',
    },
    {
        id: '8',
        title: 'Meeting',
        start: getDate('YEAR-MONTH-18T14:30:00+00:00'),
        eventColor: 'blue',
    },
    {
        id: '9',
        title: 'Happy Hour',
        start: getDate('YEAR-MONTH-18T17:30:00+00:00'),
        eventColor: 'cyan',
    },
    {
        id: '10',
        title: 'Dinner',
        start: getDate('YEAR-MONTH-18T20:00:00+00:00'),
        eventColor: 'emerald',
    },
]

export const mailData = [
    {
        id: 1,
        name: 'Eileen Horton',
        label: '',
        group: 'sentItem',
        flagged: false,
        starred: false,
        from: 'eileen_h@hotmail.com',
        avatar: '/img/avatars/thumb-1.jpg',
        title: "An 'extremely credible source'",
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 11,
                name: 'Eileen Horton',
                mail: ['nathan@themenate.com'],
                from: 'eileen_h@hotmail.com',
                avatar: '/img/avatars/thumb-1.jpg',
                date: '12:06PM',
                content:
                    "<p>Hi Nathan,</p><br /><p>An 'extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud. Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen.</p><p>This can't be! Artoo, you're playing the wrong message. There will be no bargain. We're doomed. I will not give up my favorite decoration. I like Captain Solo where he is. Artoo, look! Captain Solo. And he's still frozen in carbonite. What could possibly have come over Master Luke. Is it something I did? He never expressed any unhappiness with my work. Oh! Oh! Hold it! Ohh!</p><p> <br>Your fleet has lost. And your friends on the Endor moon will not survive. There is no escape, my young apprentice. <br><br><br>Moruth Doole, <br></p>",
                attachment: [
                    {
                        file: 'Prospectus.doc',
                        size: '1MB',
                        type: 'doc',
                    },
                    {
                        file: 'Financial_Report.xls',
                        size: '652KB',
                        type: 'xls',
                    },
                ],
            },
            {
                id: 12,
                name: 'Nathan',
                mail: ['nathan@themenate.com'],
                from: 'eileen_h@hotmail.com',
                avatar: '/img/avatars/thumb-16.jpg',
                date: '08:49AM',
                content:
                    "<p>Hi Eileen,</p><br /><p>We will never become a truly paper-less society until the Palm Pilot folks come out with WipeMe 1.0. </p> <br><p> The cheapest, fastest, and most reliable components are those that aren't there. Ready, fire, aim: the fast approach to software development. Ready, aim, aim, aim, aim: the slow approach to software development. Software undergoes beta testing shortly before it's released. Beta is Latin for “still doesn't work”. </p> <br> <br><p>Regards,</p>",
                attachment: [],
            },
            {
                id: 22,
                name: 'Eileen Horton',
                mail: ['nathan@themenate.com'],
                from: 'eileen_h@hotmail.com',
                avatar: '/img/avatars/thumb-1.jpg',
                date: '03:27AM',
                content:
                    '<p>Hi Nathan,</p><br /><p>Saucer grinder to go organic extraction coffee frappuccino lungo. Carajillo, dark, bar , qui, rich latte medium aged americano. Cream breve, mug at flavour half and half breve.</p> <br> <p>Plunger pot redeye con panna, in, espresso brewed et americano ut spoon. Java frappuccino plunger pot coffee, eu coffee shop variety percolator id robusta black. As plunger pot, americano, mocha skinny, at aroma grinder arabica americano wings spoon.</p> <br><br>Moruth Doole',
                attachment: [],
            },
        ],
    },
    {
        id: 2,
        name: 'Terrance Moreno',
        label: 'work',
        group: '',
        flagged: true,
        starred: false,
        from: 'terrance_moreno@infotech.io',
        avatar: '/img/avatars/thumb-2.jpg',
        title: 'Lorem Ipsum is FAKE TEXT!',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 13,
                name: 'Terrance Moreno',
                mail: ['nathan@themenate.com'],
                from: 'terrance_moreno@infotech.io',
                avatar: '/img/avatars/thumb-2.jpg',
                date: '9:35PM',
                content:
                    "<p>Hi Nathan,</p><br /><p>All of the words in Lorem Ipsum have flirted with me - consciously or unconsciously. That's to be expected. We have so many things that we have to do better</p> <p>The concept of Lorem Ipsum was created by and for the Chinese in order to make U.S. design jobs non-competitive. I think my strongest asset maybe by far is my temperament. I have a placeholding temperament. The other thing with Lorem Ipsum is that you have to take out its family. The other thing with Lorem Ipsum is that you have to take out its family.</p><p>An ‘extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud. Lorem Ipsum is unattractive, both inside and out. I fully understand why it's former users left it for something else. They made a good decision.</p><br/><p>Terrance Moreno<br/> Chief Officer</p>",
                attachment: [
                    {
                        file: 'Prospectus.pdf',
                        size: '219KB',
                        type: 'pdf',
                    },
                    {
                        file: 'Company_img.jpg',
                        size: '152KB',
                        type: 'jpg',
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        name: 'Ron Vargas',
        label: 'private',
        group: 'starred',
        flagged: false,
        starred: true,
        from: 'ronnie_vergas@infotech.io',
        avatar: '/img/avatars/thumb-3.jpg',
        title: 'My text is long and beautiful',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 14,
                name: 'Ron Vargas',
                mail: ['nathan@themenate.com'],
                from: 'ronnie_vergas@infotech.io',
                avatar: '/img/avatars/thumb-3.jpg',
                date: '8:16am',
                content:
                    "<p>Hi Nathan,</p><br /><p>I think my strongest asset maybe by far is my temperament. I have a placeholding temperament. When other websites give you text, they're not sending the best.</p> <p>I'm the best thing that ever happened to placeholder text. All of the words in Lorem Ipsum have flirted with me - consciously or unconsciously. That's to be expected. I will write some great placeholder text – and nobody writes better placeholder text than me, believe me – and I'll write it very inexpensively. I will write some great, great text on your website's Southern border, and I will make Google pay for that text. Mark my words. All of the words in Lorem Ipsum have flirted with me - consciously or unconsciously. That's to be expected. Look at these words. Are they small words? And he referred to my words - if they're small, something else must be small. I guarantee you there's no problem, I guarantee.</p><p>The other thing with Lorem Ipsum is that you have to take out its family. You're telling the enemy exactly what you're going to do. No wonder you've been fighting Lorem Ipsum your entire adult life.</p><br /><p><strong>Ron Vargas</strong><br />Sales & Marketing Director</p>",
                attachment: [
                    {
                        file: 'Presentation.pdf',
                        size: '3.2MB',
                        type: 'pdf',
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        name: 'Luke Cook',
        label: 'work',
        group: 'sentItem',
        flagged: false,
        starred: false,
        from: 'cookie_lukie@hotmail.com',
        avatar: '/img/avatars/thumb-4.jpg',
        title: "They're bringing mistakes",
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 15,
                name: 'Luke Cook',
                mail: ['nathan@themenate.com'],
                from: 'cookie_lukie@hotmail.com',
                avatar: '/img/avatars/thumb-4.jpg',
                date: 'Feb 3',
                content:
                    "<p>Dear Nathan,</p><br /><p>Despite the constant negative ipsum covfefe. You have so many different things placeholder text has to be able to do, and I don't believe Lorem Ipsum has the stamina. I know words. I have the best words. If Trump Ipsum weren't my own words, perhaps I'd be dating it.</p><br /><p><strong>Luke Cook</strong><br />Sales & Marketing Director</p>",
                attachment: [],
            },
            {
                id: 22,
                name: 'Nathan',
                mail: ['nathan@themenate.com'],
                from: 'nathan@themenate.com',
                avatar: '/img/avatars/thumb-16.jpg',
                date: 'Feb 2',
                content:
                    '<p>Dear Luke,</p><br /><p>Percolator robust mocha, con panna, wings, cappuccino seasonal barista, ristretto, id macchiato beans aromatic, cinnamon seasonal turkish id et mocha crema to go instant. Java, con panna, organic, blue mountain iced, fair trade americano, caffeine a java, percolator, wings, instant cultivar so foam iced siphon.</p> <br> <p>Aromatic, mug cream, cultivar skinny, wings roast con panna mocha cup, robusta variety skinny at blue mountain sit iced. Coffee saucer, a and, est barista, wings chicory, so americano percolator single origin frappuccino. Medium beans, steamed rich so redeye, whipped, mazagran, ristretto ut arabica to go variety, lungo beans cream saucer con panna.</p> <br><p>Regards,</p>',
                attachment: [],
            },
            {
                id: 23,
                name: 'Luke Cook',
                mail: ['nathan@themenate.com'],
                from: 'cookie_lukie@hotmail.com',
                avatar: '/img/avatars/thumb-16.jpg',
                date: 'Feb 2',
                content:
                    '<p>Dear Nathan,</p><br /><p>Barista medium, single origin coffee as id cinnamon coffee as irish, shop acerbic kopi-luwak, variety, latte, arabica filter, so siphon wings strong turkish. Organic whipped doppio qui decaffeinated, café au lait cortado viennese beans con panna carajillo americano cappuccino ut id dark doppio breve, filter aftertaste foam aged filter frappuccino. Organic blue mountain a plunger pot, lungo, pumpkin spice viennese,</p> <strong>Luke Cook</strong><br />Sales & Marketing Director</p>',
                attachment: [
                    {
                        file: 'Issue.pdf',
                        size: '1.1MB',
                        type: 'pdf',
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        name: 'Joyce Freeman',
        label: 'important',
        group: 'draft',
        flagged: false,
        starred: false,
        from: 'joyce991@infotech.io',
        avatar: '/img/avatars/thumb-5.jpg',
        title: "I don't think anybody knows",
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 16,
                name: 'Joyce Freeman',
                mail: ['nathan@themenate.com'],
                from: 'joyce991@infotech.io',
                avatar: '/img/avatars/thumb-5.jpg',
                date: 'Feb 2',
                content:
                    "<p>Hi Nathan,</p><br /><p>Some people have an ability to write placeholder text... It's an art you're basically born with. You either have it or you don't. I was going to say something extremely rough to Lorem Ipsum, to its family, </p><p>Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. He's not a word hero. He's a word hero because he was captured. I like text that wasn't captured. You have so many different things placeholder text has to be able to do, and I don't believe Lorem Ipsum has the stamina. When other websites give you text, they're not sending the best. They're not sending you, they're sending words that have lots of problems and they're bringing those problems with us. They're bringing mistakes. They're bringing misspellings. They're typists… And some, I assume, are good words.</p><br /><p><strong>Joyce Freeman</strong><br />Chief Technical Officer</p>",
                attachment: [],
            },
        ],
    },
    {
        id: 6,
        name: 'Samantha Phillips',
        label: '',
        group: 'starred',
        flagged: false,
        starred: true,
        from: 'samanthaphil@infotech.io',
        avatar: '/img/avatars/thumb-6.jpg',
        title: 'Lorem Ipsum is unattractive',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 17,
                name: 'Samantha Phillips',
                mail: ['nathan@themenate.com'],
                from: 'samanthaphil@infotech.io',
                avatar: '/img/avatars/thumb-6.jpg',
                date: 'Jan 30',
                content:
                    "<p>Hi Nathan,</p><br /><p> I fully understand why it's former users left it for something else. They made a good decision. Be careful, or I will spill the beans on your placeholder text.</p><br /><p><strong>Samantha Phillips</strong><br />Normal Crew</p>",
                attachment: [],
            },
        ],
    },
    {
        id: 7,
        name: 'Tara Fletcher',
        label: 'work',
        group: 'draft',
        flagged: false,
        starred: false,
        from: 'taratarara@imaze.edu.du',
        avatar: '/img/avatars/thumb-7.jpg',
        title: "He's not a word hero",
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 18,
                name: 'Tara Fletcher',
                mail: ['nathan@themenate.com'],
                from: 'taratarara@imaze.edu.du',
                avatar: '/img/avatars/thumb-7.jpg',
                date: 'Jan 28',
                content:
                    "<p>Hi Nathan,</p><br /><p>He's a word hero because he was captured. I like text that wasn't captured. I think the only difference between me and the other placeholder text is that I'm more honest and my words are more beautiful. </p><p>Lorem Ipsum's father was with Lee Harvey Oswald prior to Oswald's being, you know, shot. All of the words in Lorem Ipsum have flirted with me - consciously or unconsciously. That's to be expected. I was going to say something extremely rough to Lorem Ipsum, to its family, and I said to myself, 'I can't do it. I just can't do it. It's inappropriate. It's not nice.'</p><br /><p><strong>Tara Fletcher</strong><br />CFO</p>",
                attachment: [
                    {
                        file: 'Family.jpg',
                        size: '2.1MB',
                        type: 'jpg',
                    },
                    {
                        file: 'Brotherhood.jpg',
                        size: '1.9MB',
                        type: 'jpg',
                    },
                ],
            },
        ],
    },
    {
        id: 8,
        name: 'Lisa Smith',
        label: '',
        group: 'starred',
        flagged: false,
        starred: true,
        from: 'iamfred@imaze.infotech.io',
        avatar: '/img/avatars/thumb-8.jpg',
        title: 'I love Hispanics',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 19,
                name: 'Lisa Smith',
                mail: ['nathan@themenate.com'],
                from: 'iamfred@imaze.infotech.io',
                avatar: '/img/avatars/thumb-8.jpg',
                date: 'Jan 27',
                content:
                    "<p>Hi Nathan,</p><br /><p>An 'extremely credible source' has called my office and told me that Lorem Ipsum's birth certificate is a fraud. I'm the best thing that ever happened to placeholder text. That other text? Sadly, it's no longer a 10. I know words. I have the best words.</p><p>Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website. Lorem Ipsum's father was with Lee Harvey Oswald prior to Oswald's being, you know, shot. We have so many things that we have to do better... and certainly ipsum is one of them. An 'extremely credible source' has called my office and told me that Lorem Ipsum's birth certificate is a fraud.</p><p>An ‘extremely credible source' has called my office and told me that Barack Obama's placeholder text is a fraud. Lorem Ipsum is unattractive, both inside and out. I fully understand why it's former users left it for something else. They made a good decision.</p><br /><p><strong>Lisa Smith</strong><br />Sales & Marketing Director</p>",
                attachment: [
                    {
                        file: 'Prospectus.doc',
                        size: '1MB',
                        type: 'doc',
                    },
                    {
                        file: 'Financial_Report.xls',
                        size: '652KB',
                        type: 'xls',
                    },
                ],
            },
        ],
    },
    {
        id: 9,
        name: 'Carolyn Hanson',
        label: 'important',
        group: 'deleted',
        flagged: false,
        starred: false,
        from: 'carolyn_h@gmail.com',
        avatar: '/img/avatars/thumb-9.jpg',
        title: 'Greater than ever before',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 20,
                name: 'Carolyn Hanson',
                mail: ['nathan@themenate.com'],
                from: 'carolyn_h@gmail.com',
                avatar: '/img/avatars/thumb-9.jpg',
                date: 'Jan 26',
                content:
                    "<p>Hi Nathan,</p><br /><p>I was going to say something extremely rough to Lorem Ipsum, to its family, and I said to myself, 'I can't do it. I just can't do it. It's inappropriate. It's not nice.' Lorem Ispum is a choke artist. It chokes! You could see there was text coming out of her eyes, text coming out of her wherever.</p><p>The other thing with Lorem Ipsum is that you have to take out its family. Lorem Ipsum better hope that there are no 'tapes' of our conversations before he starts leaking to the press! I know words. I have the best words. Lorem Ipsum is FAKE TEXT! My text is long and beautiful, as, it has been well documented, are various other parts of my website. Trump Ipsum is calling for a total and complete shutdown of Muslim text entering your website.</p><br /><p><strong>Carolyn Hanson</strong><br />Sales & Marketing Executive</p>",
                attachment: [
                    {
                        file: 'Prospectus.doc',
                        size: '1MB',
                        type: 'doc',
                    },
                    {
                        file: 'Financial_Report.xls',
                        size: '652KB',
                        type: 'xls',
                    },
                ],
            },
        ],
    },
    {
        id: 10,
        name: 'Brittany Hale',
        label: '',
        group: 'deleted',
        flagged: false,
        starred: false,
        from: 'brittany1134@gmail.com',
        avatar: '/img/avatars/thumb-10.jpg',
        title: 'I will write some great placeholder',
        mail: ['nathan@themenate.com'],
        message: [
            {
                id: 21,
                name: 'Brittany Hale',
                mail: ['nathan@themenate.com'],
                from: 'brittany1134@gmail.com',
                avatar: '/img/avatars/thumb-10.jpg',
                date: 'Jan 26',
                content:
                    "<p>Hi Nathan,</p><br /><p>Lorem Ipsum best not make any more threats to your website. It will be met with fire and fury like the world has never seen. I write the best placeholder text, and I'm the biggest developer on the web by far... While that's mock-ups and this is politics, are they really so different?</p><p>I'm speaking with myself, number one, because I have a very good brain and I've said a lot of things. I’m the best thing that ever happened to placeholder text. The best taco bowls are made in Trump Tower Grill. I love Hispanics! Lorem Ipsum is FAKE TEXT!</p><p>The best taco bowls are made in Trump Tower Grill. I love Hispanics! Look at these words. Are they small words? And he referred to my words - if they're small, something else must be small. I guarantee you there's no problem, I guarantee.</p><br /><p><strong>Brittany Hale</strong><br />Sales & Marketing Executive</p>",
                attachment: [],
            },
        ],
    },
]
