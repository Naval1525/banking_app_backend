# Banking/Wallet System MVP 🏦

A modern banking and wallet system built with Node.js, TypeScript, and NeonDB. Features secure user authentication, atomic money transfers, real-time transaction streaming, and a clean functional architecture.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- 💰 **Multi-Account Support** - Users can create multiple checking/savings accounts
- ⚡ **Atomic Transfers** - ACID-compliant money transfers with automatic rollback on failure
- 📊 **Transaction History** - Paginated transaction queries with detailed records
- 🔄 **Real-time Updates** - Server-Sent Events (SSE) for live transaction notifications
- 🛡️ **Security First** - Input validation, SQL injection protection, and proper authorization
- 🏗️ **Functional Architecture** - Clean separation of concerns with repository/controller pattern

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- NeonDB account (or any PostgreSQL database)
- npm or yarn

### Installation

1. **Clone and setup project**
```bash
mkdir banking-wallet-mvp
cd banking-wallet-mvp
npm init -y
```

2. **Install dependencies**
```bash
# Core dependencies
npm install express cors helmet morgan dotenv
npm install @prisma/client prisma
npm install jsonwebtoken bcryptjs ws zod

# Development dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs @types/ws
npm install -D ts-node nodemon
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

4. **Setup database**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

5. **Start development server**
```bash
npm run dev
```

Server will be running at `http://localhost:3000` 🎉

## 📁 Project Structure

```
src/
├── controllers/           # Business logic functions
│   ├── user.controller.ts
│   ├── account.controller.ts
│   └── transaction.controller.ts
├── repositories/          # Database query functions
│   ├── user.repository.ts
│   ├── account.repository.ts
│   └── transaction.repository.ts
├── routes/               # Express route handlers
│   ├── user.routes.ts
│   ├── account.routes.ts
│   ├── transaction.routes.ts
│   └── stream.routes.ts
├── middleware/           # Authentication & validation
│   └── auth.ts
├── services/            # Business services
│   └── streaming.service.ts
├── utils/               # Utility functions
│   └── auth.ts
├── types/               # TypeScript types & schemas
│   └── index.ts
├── lib/                 # External service connections
│   └── db.ts
└── server.ts           # Application entry point

prisma/
└── schema.prisma       # Database schema

.env                    # Environment variables
.env.example           # Environment template
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |

### Accounts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/accounts` | Create account | ✅ |
| GET | `/api/accounts` | Get user accounts | ✅ |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Transfer money | ✅ |
| GET | `/api/transactions/account/:id` | Get account transactions | ✅ |

### Streaming

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stream/transactions` | SSE transaction stream | ✅ |

## 📝 API Usage Examples

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Account
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Main Checking",
    "type": "CHECKING"
  }'
```

### 4. Transfer Money
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 100.50,
    "description": "Payment to friend",
    "debitAccountId": "SOURCE_ACCOUNT_ID",
    "creditAccountId": "DESTINATION_ACCOUNT_ID"
  }'
```

### 5. Get Transaction History
```bash
curl -X GET "http://localhost:3000/api/transactions/account/ACCOUNT_ID?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Real-time Transaction Stream
```bash
curl -X GET http://localhost:3000/api/stream/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Accept: text/event-stream"
```

## 🧪 Testing

### Manual Testing Flow

1. **Register a new user**
2. **Login to get JWT token**
3. **Create two accounts** (source and destination)
4. **Transfer money** between accounts
5. **View transaction history**
6. **Open SSE stream** in another terminal to see real-time updates

### Testing with VS Code REST Client

Create `test-requests.http`:

```http
### Register User
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}

### Login User
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Create Account
POST http://localhost:3000/api/accounts
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Savings Account",
  "type": "SAVINGS"
}
```

### Frontend SSE Test

Create `sse-test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Transaction Stream Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .transaction {
            border: 1px solid #ddd;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            background: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>🔄 Real-time Transaction Feed</h1>
    <button onclick="connect()">Connect</button>
    <button onclick="disconnect()">Disconnect</button>
    <div id="status">Disconnected</div>
    <hr>
    <div id="transactions"></div>

    <script>
        let eventSource = null;
        const token = prompt('Enter your JWT token:');

        function connect() {
            if (!token) {
                alert('Token required');
                return;
            }

            eventSource = new EventSource('http://localhost:3000/api/stream/transactions');

            // Note: EventSource doesn't support custom headers
            // You'll need to modify the server to accept token via query param for SSE

            document.getElementById('status').textContent = 'Connecting...';

            eventSource.onopen = function() {
                document.getElementById('status').textContent = 'Connected ✅';
            };

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                addTransaction(data);
            };

            eventSource.onerror = function() {
                document.getElementById('status').textContent = 'Error ❌';
            };
        }

        function disconnect() {
            if (eventSource) {
                eventSource.close();
                eventSource = null;
                document.getElementById('status').textContent = 'Disconnected';
            }
        }

        function addTransaction(data) {
            const div = document.createElement('div');
            div.className = 'transaction';
            div.innerHTML = `
                <strong>${new Date().toLocaleTimeString()}</strong><br>
                Type: ${data.type}<br>
                Data: <pre>${JSON.stringify(data.data, null, 2)}</pre>
            `;
            document.getElementById('transactions').insertBefore(div, document.getElementById('transactions').firstChild);
        }
    </script>
</body>
</html>
```

## 🗄️ Database Schema

The system uses three main entities:

### Users
- Stores user authentication and profile information
- Passwords are hashed with bcrypt
- Email addresses are unique

### Accounts
- Each user can have multiple accounts
- Supports different account types (CHECKING, SAVINGS)
- Uses decimal precision for accurate currency storage
- Tracks current balance

### Transactions
- Records all money transfers between accounts
- Atomic operations ensure data consistency
- Bidirectional relationships to both debit and credit accounts
- Includes transaction status and timestamps

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt
- **JWT Authentication**: Stateless token-based auth
- **Input Validation**: Zod schemas for request validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Account Authorization**: Users can only access their own accounts
- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting Ready**: Architecture supports easy rate limiting addition

## 🏗️ Architecture Principles

### Functional Programming
- No classes or OOP patterns
- Pure functions for business logic
- Immutable data transformations
- Easy testing and reasoning

### Separation of Concerns
- **Repositories**: Database operations only
- **Controllers**: Business logic and HTTP handling
- **Services**: Cross-cutting concerns (streaming, notifications)
- **Middleware**: Authentication and validation

### ACID Compliance
- Database transactions for money transfers
- Automatic rollback on failures
- Consistent state guarantees
- Isolation between concurrent operations

## 📊 Performance Considerations

### Database
- Indexed foreign keys for fast lookups
- Connection pooling via Prisma
- Prepared statements for query optimization

### API
- Paginated responses for large datasets
- Efficient JSON serialization
- Proper HTTP status codes

### Real-time
- SSE for low-overhead streaming
- Client management for memory efficiency
- Graceful connection handling

## 🚀 Deployment

### Environment Setup
```bash
# Production environment
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="secure-random-string-for-production"
PORT=3000
```

### Build Process
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t banking-app .

# Run with environment variables
docker run -p 3000:3000 --env-file .env banking-app
```

### NeonDB Configuration
1. Create account at [Neon](https://neon.tech)
2. Create new database
3. Copy connection string to `DATABASE_URL`
4. Run `npx prisma db push` to create tables

## 🔮 Future Enhancements

### Phase 1 - Core Features
- [ ] Account statements (PDF generation)
- [ ] Transaction categories and tags
- [ ] Recurring/scheduled transfers
- [ ] Multi-currency support with exchange rates

### Phase 2 - Advanced Features
- [ ] Fraud detection algorithms
- [ ] Spending analytics dashboard
- [ ] Push notifications (email/SMS)
- [ ] Account linking with external banks

### Phase 3 - Enterprise Features
- [ ] Admin panel and user management
- [ ] Compliance reporting and audit trails
- [ ] API rate limiting and quotas
- [ ] Advanced security (2FA, device tracking)

### Phase 4 - Scale & Performance
- [ ] Redis caching layer
- [ ] Database read replicas
- [ ] Microservices architecture
- [ ] Load balancing and auto-scaling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs and feature requests in GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

## 🙏 Acknowledgments

- **Prisma** for excellent database tooling
- **NeonDB** for serverless PostgreSQL
- **Express.js** for robust web framework
- **TypeScript** for type safety and developer experience

---

