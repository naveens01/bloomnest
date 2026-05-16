- PORT=5000
- NODE_ENV=development
- MONGODB_URI=mongodb://localhost:27017/bloomnest
- JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
- JWT_EXPIRE=7d
- UPLOAD_PATH=./uploads
- MAX_FILE_SIZE=5242880
- ADMIN_EMAIL=admin@bloomnest.com
- ADMIN_PASSWORD=admin123

# DB switch - set to atlas to use MongoDB Atlas
DB_TARGET=atlas
# Atlas URI template
MONGODB_URI_ATLAS=mongodb+srv://naveens01:mahasri@bloomnest.g485gn0.mongodb.net/bloomnest?retryWrites=true&w=majority&appName=bloomnest
