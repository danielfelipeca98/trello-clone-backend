import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken'

function auth(req, res, next) {
    try {
        console.log('🔍 Headers recibidos:', req.headers);
        console.log('🔍 Cookies recibidas:', req.cookies);

        let tkn = req.cookies.token;
        console.log('🔍 Token de cookie:', tkn ? 'Presente' : 'No encontrado');
        if (!tkn) {
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                tkn = req.headers.authorization.split(' ')[1];
                console.log('🔍 Token de header:', tkn ? 'Presente' : 'No encontrado');
            }
        }
        if (!tkn) {
            console.log('No se encontró token');
            return res.status(401).json({ error: 'No encontrado' })
        }
        console.log('🔍 Verificando token con JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'FALTA');
        const decoded = jwt.verify(tkn, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error de autenticacion:', error.message) 
        console.error('Usuario de autenticacion:', error.message)
        return res.status(401).json({ error: 'Token invalido o expirado' })
    }
}
export default auth;