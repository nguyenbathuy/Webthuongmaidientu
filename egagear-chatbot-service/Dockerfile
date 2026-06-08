# Sử dụng môi trường Node.js siêu nhẹ
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy các file cấu hình và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi động service
CMD ["node", "server.js"]