To see the DashBoard , you will need an "ADMIN" user account. In register page i added this option.

You Can register as an admin or a regular user to see the difference.

==> BEFORE RUNNING THE PROJECT <==

First You need to create two .env files , 1 for backend and 1 for frontend


==> BACK END .ENV FILE VARIABLES <==

PORT= your port number
MONGO_URL= your mongo db url
FRONTEND_URL= your frontend url
JWT_SECRET= your jwt secret

==> FRONT END .ENV FILE VARIABLES <==

VITE_FIREBASE_API_KEY= your firebase api key
BACKEND_URL= your backend url



==> BACK END INSTALLATION AND RUN <==

cd backend
npm i
npm run dev

==> FRONT END INSTALLATION AND RUN <==
cd frontend
npm i
npm run dev