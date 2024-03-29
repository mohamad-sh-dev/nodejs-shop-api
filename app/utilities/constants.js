module.exports = Object.freeze({
    API_DOCUMENT_ROUTE: '/apiDocs',
    USER_PROFILE_IAMGE_DEFAULT_NAME: 'default.jpg',
    REQUEST_PARAMS: 'params',
    REQUEST_BODY: 'body',
    REQUEST_QUERY: 'query',
    MASTER_ROLE: 'MASTER',
    MONGO_ID_PATTERN: /^[0-9a-fA-F]{24}$/,
    PASSWORD_PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Minimum eight characters, at least one letter and one number:
    PRODUCT_TYPES: ['virtual', 'phicycal'],
    UPLOADS_ENTITIES: {
        BLOGS: 'blogs',
        COURSES: 'courses',
        EPISODES: 'episodes',
        USER: 'users',
        PRODUCTS: 'products'
    },
    LIMIT_SIZES: {
        FILES: 1 * 1000 * 1000,
        VIDEOS: 200 * 1000 * 1000
    },
    UPLOAD_FIELD_NAMES: {
        IMAGE: 'image',
        IMAGES: 'images',
        IMAGECOVER: 'imageCover',
        PROFILE_IMAGE: 'profileImage',
        VIDEOS: 'video'
    },
    REQUEST_BODY_FIELD_NAMES: {
        TAGS: 'tags',
        CATEGORIES: 'categories',
        PROPERTIES: 'properties',
        METHODS: 'methods',
        PERMISSIONS: 'permissions'
    },
ZARINPAL_SANDBOX: {
        DESCRIPTION: 'پرداخت',
    },
    PAYMENT_STATUS_CODES: {
        OK: 100,
        NOT_OK: 'NOK'
    },
    STATIC_ROUTES: {
        VIEWS: {
            PAYMENT_TEMPLATE: 'payment'
        }
    }
});
