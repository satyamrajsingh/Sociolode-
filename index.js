const express=require('express');
const env = require('./config/environment');
const cookieParser=require('cookie-parser');
const app=express();

const port=3300;

const expessLayouts= require('express-ejs-layouts');

const db=require('./config/mongoose');

//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-stratedgy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle= require('./config/passport-google-oauth2-strategy');

const MongoStore= require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');

app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'

}));


//reading through the post requests
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//set up for static files
app.use(express.static(env.asset_path));

//make the upload path available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expessLayouts);

//using expressLayouts to insert css and script tag in proper place in ejs file
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongostore is used to store the session cookie in db
app.use(session({
    name:'codeial',
    //todo- change the secret before deploying in production state
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection:db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err|| 'connect-mongodb setup ok');
        }
    )

}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//accesing route middleware
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err)
    {
        console.log('Error in running the server: ',err);
    }
    else
    {
        console.log(`Server is running on port: ${port}`);
    }
});