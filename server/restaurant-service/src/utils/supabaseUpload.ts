import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const uploadImagesToSupabase = async (files: Express.Multer.File[], folder: string): Promise<string[]> => {
    const imageUrls: string[] = [];

    for (const file of files) {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
            .from('foodie') 
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) throw new Error(`Image upload failed: ${error.message}`);

        const { data } = supabase.storage
            .from('foodie')
            .getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
    }

    return imageUrls;
};
