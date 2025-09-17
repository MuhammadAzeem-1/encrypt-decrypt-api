# Encryption API - Vercel Deployment

A Node.js API for RSA-AES hybrid encryption/decryption, optimized for Vercel serverless deployment.

## Features

- **RSA-AES Hybrid Encryption**: Combines RSA for key exchange with AES for data encryption
- **Serverless Functions**: Optimized for Vercel's serverless architecture
- **CORS Enabled**: Ready for frontend integration
- **Environment Variables**: Secure key management

## API Endpoints

### POST `/api/encrypt`
Encrypts data using RSA-AES hybrid encryption.

**Request Body:**
```json
{
  "key": "value",
  "data": "any json data"
}
```

**Response:**
```json
{
  "result": "base64-encoded-encrypted-data"
}
```

### POST `/api/decrypt`
Decrypts data using RSA-AES hybrid decryption.

**Request Body:**
```json
{
  "data": "base64-encoded-encrypted-data"
}
```

**Response:**
```json
{
  "result": {
    "key": "value",
    "data": "original json data"
  }
}
```

## Environment Variables

Copy `env.example` to `.env.local` and fill in your RSA key pair:

```bash
cp env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_KEY_PEM`: RSA public key in PEM format (for encryption)
- `NEXT_PUBLIC_PRIVATE_KEY_PEM`: RSA private key in PEM format (for decryption)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run locally with Vercel CLI:
```bash
npm run dev
```

Or run the original Express server:
```bash
npm start
```

## Deployment to Vercel

### Option 1: Vercel CLI
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npm run deploy
```

### Option 2: Vercel Dashboard
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_KEY_PEM` and `NEXT_PUBLIC_PRIVATE_KEY_PEM`

## Project Structure

```
├── api/
│   ├── encrypt.js      # Encryption endpoint
│   └── decrypt.js      # Decryption endpoint
├── encrypt.js          # Encryption logic
├── decrypt.js          # Decryption logic
├── index.js            # Original Express server (for local dev)
├── vercel.json         # Vercel configuration
├── package.json        # Dependencies and scripts
└── env.example         # Environment variables template
```

## Security Notes

- Keep your private keys secure and never commit them to version control
- Use environment variables for all sensitive data
- The API includes CORS headers for frontend integration
- Consider implementing rate limiting for production use

## Dependencies

- `node-forge`: Cryptographic operations
- `vercel`: Serverless deployment platform
