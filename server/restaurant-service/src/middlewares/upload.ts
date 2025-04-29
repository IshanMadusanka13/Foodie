import multer from 'multer';

export const memoryStorage = multer.memoryStorage();
export const upload = multer({ storage: memoryStorage });

export default upload;
