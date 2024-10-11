## [Messenger](https://bigbruhh-messenger.vercel.app/)  

Real-time chat app using Next.js(v14), MongoDB for database, Pusher to handle web-socket and Next-Auth(v4) to handle authentication.  

## Env  

DB_URI: Mongodb uri   
DB_NAME: Database name  

NEXTAUTH_URL: Url to redirect to the app, http://localhost:3000 if run local  
NEXTAUTH_SECRET: Secret for next-auth to sign jwt  

GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: Google oauth keys **_--> setup google oauth app: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)_**  

GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET: Github oauth keys 
**_--> setup github oauth app: [https://github.com/settings/developers](https://github.com/settings/developers)_**  

NEXT_PUBLIC_PUSHER_APP_KEY, NEXT_PUBLIC_PUSHER_CLUSTER, PUSHER_APP_ID, PUSHER_SECRET: Pusher keys **_--> setup pusher: [https://dashboard.pusher.com/channels](https://dashboard.pusher.com/channels)_**  

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: **_--> setup cloudinary: [https://console.cloudinary.com/settings](https://console.cloudinary.com/settings)_**  