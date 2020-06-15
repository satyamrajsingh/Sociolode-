const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'sattyrajpoot39@gmail.com',
            pass: '4meninaboat'
        }
    },
    google_client_id: "496497945558-7kug0tdajehogn0fekp77lpfjmucbqs1.apps.googleusercontent.com",
    google_client_secret:  "6ghx5O1a3eka2q5NCv_PNl7q",
    google_call_back_url: "http://localhost:3300/users/auth/google/callback",
    jwt_secret: 'codeial',
}

const production =  {
    name: 'production'
}



module.exports = development;


//mil gya