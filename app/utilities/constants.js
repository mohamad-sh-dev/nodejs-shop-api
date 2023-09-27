module.exports = {
    REQUEST_PARAMS: 'params',
    REQUEST_BODY: 'body',
    REQUEST_QUERY: 'query',
    MONGO_ID_PATTERN: /^[0-9a-fA-F]{24}$/,
    PASSWORD_PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Minimum eight characters, at least one letter and one number:
    PRODUCT_TYPES: ['virtual', 'phicycal'],
    UPLOADS_ENTITIES: {
        BLOGS: 'blogs',
        COURSES: 'courses',
        EPISODES: 'episodes',
        USER: 'user',
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
    }
};

// {
//     "status": "success",
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTM4Nzk0OTI3OSIsImlhdCI6MTY5NTgzNDA0OCwiZXhwIjoxNjk1OTIwNDQ4fQ.UaKWClXthtkPLPoONgdPJ9TAFPNvYHbnilpezFRn3B8",
//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTM4Nzk0OTI3OSIsImlhdCI6MTY5NTgzNDA0OCwiZXhwIjoxNzI3MzkxNjQ4fQ.ri_ZJmYZAj0TnHOGm3L_7uljAYH22EK-ApcX-v7teys"
//   }