"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const google_auth_library_1 = require("google-auth-library");
const oauth2Client = new google_auth_library_1.OAuth2Client();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 3000;
app.post('/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the code from frontend
        const code = req.headers.authorization;
        console.log('Authorization Code:', code);
        // Exchange the authorization code for an access token
        const response = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: '587301-d27f8hofgi6i0.apps.googleusercontent.com',
            client_secret: 'GOCSPX-u02eNWutQVi',
            redirect_uri: 'postmessage',
            grant_type: 'authorization_code'
        });
        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);
        // Fetch user details using the access token
        const userResponse = yield axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const userDetails = userResponse.data;
        console.log('User Details:', userDetails);
        // Process user details and perform necessary actions
        res.status(200).json({ message: 'Authentication successful' });
    }
    catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ message: 'Failed to save code' });
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
