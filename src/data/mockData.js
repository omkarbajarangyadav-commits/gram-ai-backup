export const MARKET_DATA = {
    'Maharashtra': {
        'Solapur': [
            { crop: 'Onion', price: '₹1,200', trend: 'up', location: 'Solapur APMC' },
            { crop: 'Maize', price: '₹1,850', trend: 'stable', location: 'Barshi APMC' }
        ],
        'Latur': [
            { crop: 'Soyabean', price: '₹4,550', trend: 'stable', location: 'Latur APMC' },
            { crop: 'Tur (Arhar)', price: '₹7,200', trend: 'up', location: 'Latur APMC' }
        ],
        'Pune': [
            { crop: 'Tomato', price: '₹850', trend: 'down', location: 'Pune APMC' },
            { crop: 'Potato', price: '₹1,100', trend: 'stable', location: 'Manchar APMC' }
        ],
        'Akola': [
            { crop: 'Cotton (Kapas)', price: '₹6,900', trend: 'up', location: 'Akola APMC' }
        ]
    },
    'Karnataka': {
        'Belagavi': [
            { crop: 'Sugarcane', price: '₹2,900', trend: 'up', location: 'Belagavi APMC' },
            { crop: 'Maize', price: '₹2,100', trend: 'up', location: 'Gokak APMC' }
        ],
        'Hubballi': [
            { crop: 'Cotton', price: '₹7,100', trend: 'stable', location: 'Hubli APMC' },
            { crop: 'Groundnut', price: '₹5,600', trend: 'down', location: 'Dharwad APMC' }
        ]
    },
    'Madhya Pradesh': {
        'Indore': [
            { crop: 'Soyabean', price: '₹4,400', trend: 'down', location: 'Indore Mandi' },
            { crop: 'Wheat', price: '₹2,350', trend: 'stable', location: 'Sanwer Mandi' }
        ],
        'Ujjain': [
            { crop: 'Gram (Chana)', price: '₹5,100', trend: 'up', location: 'Ujjain Mandi' }
        ]
    },
    'Punjab': {
        'Ludhiana': [
            { crop: 'Wheat', price: '₹2,275', trend: 'stable', location: 'Khanna Mandi' },
            { crop: 'Rice (Basmati)', price: '₹3,800', trend: 'up', location: 'Sahnewal Mandi' }
        ]
    }
};

export const SHOPS_DATA = [
    { name: 'Kisan Agro Center', type: 'Fertilizers', location: 'Pune', phone: '9876543210' },
    { name: 'Samarth Seeds', type: 'Seeds', location: 'Pune', phone: '9123456789' },
    { name: 'Laxmi Krishi Kendra', type: 'Tools', location: 'Solapur', phone: '9988776655' }
];

export const COMMUNITY_POSTS = [
    {
        id: 1,
        user: 'Ramesh Patil',
        crop: 'Cotton',
        question: 'Why are my cotton leaves turning yellow?',
        image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&q=80',
        likes: 24,
        answers: 5,
        expertAnswer: 'Nitrogen deficiency. Apply Urea.'
    },
    {
        id: 2,
        user: 'Suresh Deshmukh',
        crop: 'Tomato',
        question: 'Black spots on tomato fruits. What can be the reason?',
        image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d9?w=500&q=80',
        likes: 12,
        answers: 2,
        expertAnswer: null
    }
];
