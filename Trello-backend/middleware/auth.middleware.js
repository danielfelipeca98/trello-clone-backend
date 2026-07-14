import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken'

function auth(req, res, next) {
    try {
        let tkn = req.cookies.token;
        if (!tkn) {
            if(req.headers.authorization&& req.headers.authorization.startsWith('Bearer')){
                tkn = req.headers.authorization.split(' ')[1];
            }
            
        }
        if (!tkn) {
        return res.status(401).json({error:'No encontrado'})
        }
        
        const decoded = jwt.verify(tkn,process.env.JWT_SECRET);
        req.user = decoded;        
        next();

    } catch (error) {
        console.error('Usuario de autenticacion:', error.message)        
        return res.status(401).json({error:'Token invalido o expirado'})
    }
}
export default auth;