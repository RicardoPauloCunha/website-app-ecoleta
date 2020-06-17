import {Request, Response} from 'express';
import knex from '../database/connection';

class ItemsControllers {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
    
        const serializedItems = items.map(x => {
            return {
                id: x.id,
                name: x.titulo,
                image_url: `http://192.168.0.101:3333/uploads/${x.image}`,
            }
        });
    
        return response.json(serializedItems);
    };
};

export default ItemsControllers;