exports.userFilter = ( user ) => {
    return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        url: user.url,
    }
}