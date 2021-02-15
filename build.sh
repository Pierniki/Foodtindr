cd backend
npm run build
cd ..
mv backend/public_nodejs .

cd app
npm run build
cd ..
mv app/build public_nodejs/src


