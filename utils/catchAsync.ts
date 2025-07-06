import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>; // Isso aqui define um type que retorna uma Promise <any> (talvez pode usar void?)

export default function catchAsync(fn: AsyncHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
}

// Exemplo de uso: (no meu app.ts)
// app.get('/example', catchAsync(async (req, res) => {
//     const data = await someAsyncOperation();
//     res.send(data);
// }));

// Isso faz com que não precisa usar try/catch em cada rota, e se der erro, o next já vai chamar o middleware de erro global :D
