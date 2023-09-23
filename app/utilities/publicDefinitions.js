class PublicDefinitions {
    blogsAllowedFieldsToBeUpdated() {
        return ['title', 'summary', 'body', 'image', 'tag', 'category'];
    }

    episodesAllowedFieldsToBeUpdated() {
        return ['title', 'description', 'type'];
    }

    productsAllowedFieldsToBeUpdated() {
        return ['title', 'summary', 'description', 'image', 'tags', 'category', 'price', 'discount', 'type', 'properties'];
    }

    userAllowedFieldsToBeUpdated() {
        return ['firstName', 'lastName', 'profileImage', 'password', 'birthDate'];
    }

    nullishData() {
        return [undefined, null, '', {}, []];
    }

    allowedVideosFormats() {
        return ['video/x-matroska', 'video/mp4'];
    }

    allowedImagesFormats() {
        return ['image/png', 'image/jpg', 'image/jpeg'];
    }
}

module.exports = {
    publicDefinitions: new PublicDefinitions()
};
